import Link from "next/link";

const Hero = () => {
  return (
    <section className="flex h-[90vh] items-center justify-center">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-slate-900 lg:text-4xl">
          Streaming Experiment Lab
        </h1>

        {/* Subtitle */}
        <p className="mt-2 text-sm font-medium text-indigo-600">
          HTTP & Named Data Networking (NDN)
        </p>

        {/* Description */}
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-600 lg:text-lg">
          Platform ini dirancang sebagai ruang eksperimen untuk mengeksplorasi
          teknologi streaming video modern menggunakan{" "}
          <span className="font-medium text-slate-800">
            Named Data Networking (NDN)
          </span>{" "}
          dan HTTP konvensional.
        </p>

        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 lg:text-lg">
          Fokus utama eksperimen meliputi adaptive bitrate (ABR), buffering
          behavior, frame drop, serta perbandingan performa antar protokol dalam
          skenario Video-on-Demand.
        </p>

        {/* CTA */}
        <div className="mt-8">
          <Link href="/streaming">
            <button
              className="
                rounded-lg border border-indigo-500 bg-indigo-50 px-5 py-2.5
                text-sm font-semibold text-indigo-700
                transition
                hover:bg-indigo-100
              "
            >
              Open Streaming Lab
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
