"use client";

import { TbHttpConnect, TbChevronDown } from "react-icons/tb";
import { useState } from "react";

const CardConnection = ({ routers = [], uplink }) => {
  const [showup, setShow] = useState(true);

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Header */}
      <button
        onClick={() => setShow(!showup)}
        className="flex items-center justify-between w-full rounded-lg border bg-white px-4 py-3 shadow-sm hover:shadow-md transition"
      >
        <h1 className="text-sm font-semibold text-slate-700">
          Connected Routers
        </h1>

        <TbChevronDown
          className={`transition-transform duration-300 ${
            showup ? "rotate-180" : ""
          }`}
          size={20}
        />
      </button>

      {/* Content */}
      <div
        className={`grid gap-3 transition-all duration-300 ${
          showup ? "opacity-100 max-h-125" : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        {routers.map((router, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm hover:shadow-md transition"
          >
            <div>
              <p className="text-xs text-slate-500">Router #{index + 1}</p>
              <p className="text-sm font-medium text-slate-800">{router}</p>
            </div>

            {uplink && router && (
              <TbHttpConnect size={26} className="text-emerald-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardConnection;
