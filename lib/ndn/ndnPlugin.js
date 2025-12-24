import { FileMetadata } from "@ndn/fileserver";
import { Name, Interest } from "@ndn/packet";
import { retrieveMetadata } from "@ndn/rdr";
import { fetch, RttEstimator, TcpCubic } from "@ndn/segmented-object";
import PQueue from "p-queue";
import hirestime from "hirestime";
import shaka from "shaka-player";

const fwHints = [];

/**
 * Update forwarding hint mapping.
 * @param {Record<string, string> | undefined} m
 */
export function updateFwHints(m = {}) {
  fwHints.splice(0);
  for (const [prefix, fh] of Object.entries(m)) {
    fwHints.push([new Name(prefix), new FwHint(fh)]);
  }
  fwHints.sort((a, b) => b[0].length - a[0].length);
}

/**
 * Determine forwarding hint for Interest.
 * @param {Name} name
 * @returns {import("@ndn/packet").Interest.ModifyFields | undefined}
 */
function findFwHint(name) {
  for (const [prefix, fwHint] of fwHints) {
    if (prefix.isPrefixOf(name)) {
      return { fwHint };
    }
  }
  return undefined;
}
function applyInterestOptions(name) {
  return {
    modifyInterest: (interest) => {
      // name udah ada
      interest.canBePrefix = false;
      interest.mustBeFresh = true;
      interest.lifetime = 3000;

      // FIX PALING PENTING → nonce unik
      interest.nonce = Interest.generateNonce();
    },
    retx: 10,
  };
}

// A high-resolution timer
const getNow = hirestime();

/**
 * Manages video fetching operations, including queueing and network congestion control.
 */
export class VideoFetcher {
  /** @type {PQueue} */
  queue;
  /** @type {RttEstimator} */
  rttEstimator;
  /** @type {TcpCubic} */
  congestionAvoidance;

  constructor() {
    // Limit concurrency to 4 parallel fetches
    this.queue = new PQueue({ concurrency: 4 });
    // Estimator for Round-Trip Time, with a max RTO of 10 seconds
    this.rttEstimator = new RttEstimator({ maxRto: 10000 });
    // TCP CUBIC congestion avoidance algorithm
    this.congestionAvoidance = new TcpCubic({ c: 0.1 });
  }
}

/**
 * Handles the retrieval of a single file (or video segment) from the NDN network.
 */
export class FileFetcher {
  /** @type {VideoFetcher} */
  videoFetcher;
  /** @type {string} */
  uri;
  /** @type {shaka.net.NetworkingEngine.RequestType} */
  requestType;
  /** @type {Name} */
  name;
  /** @type {AbortController} */
  abort;
  /** @type {Endpoint} */
  endpoint;

  constructor(videoFetcher, uri, requestType) {
    this.videoFetcher = videoFetcher;
    this.uri = uri;
    this.requestType = requestType;
    this.name = new Name(uri.replace(/^ndn:/, ""));
    this.abort = new AbortController();

    /**
     * 🔥 FIX TERPENTING
     * Endpoint harus dibuat SYNCHRONOUS.
     * Jangan async, jangan pakai await.
     * Biar metadata & fetch bisa berjalan.
     */
    // this.endpoint = consume(this.name, {
    //   // modifyInterest: findFwHint(this.name),
    //   // ...applyInterestOptions(this.name),
    //   retx: 10,
    //   modifyInterest: findFwHint(this.name),

    //   signal: this.abort.signal,
    // });
  }

  /**
   * Retrieves the file content from the NDN network.
   * @returns {Promise<shaka.extern.Response>}
   */
  async retrieve() {
    const modifyInterest = findFwHint(this.name);
    const { signal } = this.abort;
    let retryCount = 0;

    const metadata = await retrieveMetadata(this.name, FileMetadata, {
      retx: 10,
      modifyInterest,
      signal,
    });

    const t0 = getNow();
    const payload = await fetch(metadata.name, {
      rtte: this.videoFetcher.rtte,
      ca: this.videoFetcher.ca,
      retxLimit: 4,
      estimatedFinalSegNum: metadata.lastSeg,
      modifyInterest,
      signal,
      onRetry: () => retryCount++,
    });
    const timeMs = getNow() - t0;
    const size = payload.byteLength;
    const segCount = metadata.lastSeg + 1; // approximate
    return {
      uri: this.uri,
      name: this.name,
      originalUri: this.uri,
      data: payload,

      headers: {
        status: 200,
        "Content-Type": this.requestType,
        __ndnMetrics: { timeMs, size, retryCount, segCount },
      },
      timeMs,
    };
  }

  /**
   * Handles errors during the fetch process, creating a Shaka-compatible error.
   */
  handleError() {
    if (this.abort.signal.aborted) {
      return shaka.util.AbortableOperation.aborted();
    }
    // Throw a recoverable network error for Shaka
    throw new shaka.util.Error(
      shaka.util.Error.Severity.RECOVERABLE,
      shaka.util.Error.Category.NETWORK,
      shaka.util.Error.Code.BAD_HTTP_STATUS,
      this.uri,
      503, // Service Unavailable
      null,
      {},
      this.requestType
    );
  }
}

// Global instance of VideoFetcher to manage all downloads
let videoFetcher;

/**
 * The main network plugin for Shaka Player to handle 'ndn:' scheme URIs.
 * @param {string} uri The URI of the content to fetch.
 * @param {shaka.extern.Request} request The request object from Shaka.
 * @param {shaka.net.NetworkingEngine.RequestType} requestType The type of request.
 * @returns {shaka.extern.IAbortableOperation<shaka.extern.Response>}
 */
export function NdnPlugin(uri, _, requestType) {
  const fileFetcher = new FileFetcher(videoFetcher, uri, requestType);

  // Return an abortable operation
  return new shaka.util.AbortableOperation(
    // Add the retrieve task to the videoFetcher's queue
    videoFetcher.queue.add(async () => {
      try {
        return await fileFetcher.retrieve();
      } catch (err) {
        // console.error("❌ NDN Fetcher error:", err);
        fileFetcher.handleError();
      }
    }),
    // Abort controller
    () => fileFetcher.abort.abort()
  );
}

/**
 * Formats a number as a rounded integer string.
 * @param {number} num The number to format.
 * @returns {string}
 */
export function formatInt(num) {
  return Number.isNaN(num) ? "?" : `${Math.round(num)}`;
}

/**
 * Resets the plugin's internal state by creating a new VideoFetcher.
 */
NdnPlugin.reset = () => {
  videoFetcher = new VideoFetcher();
};

/**
 * Returns the internal VideoFetcher instance for debugging or external access.
 * @returns {VideoFetcher}
 */
NdnPlugin.getInternals = () => videoFetcher;

// Initialize the plugin on script load
NdnPlugin.reset();
