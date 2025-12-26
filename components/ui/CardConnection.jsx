"use client";

import { TbHttpConnect, TbChevronDown } from "react-icons/tb";
import { useState } from "react";

const CardConnection = ({ routers = [], uplink }) => {
  const [showup, setShow] = useState(true);

  return (
    <div className="w-full max-w-md space-y-3">
      {/* Header */}
      <button
        onClick={() => setShow(!showup)}
        className="
          flex w-full items-center justify-between
          rounded-xl border border-slate-200
          bg-slate-50 px-4 py-3
          text-left
          transition
          hover:bg-white hover:shadow-sm
        "
      >
        <h1 className="text-sm font-semibold text-slate-800">
          Connected Routers
        </h1>

        <TbChevronDown
          size={18}
          className={`text-slate-500 transition-transform duration-300 ${
            showup ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Content */}
      <div
        className={`grid gap-2 overflow-hidden transition-all duration-300 ${
          showup ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {routers.map((router, index) => (
          <div
            key={index}
            className="
              flex items-center justify-between
              rounded-lg border border-slate-200
              bg-white px-4 py-3
              transition
              hover:bg-slate-50
            "
          >
            <div>
              <p className="text-[11px] font-medium text-slate-500">
                Router #{index + 1}
              </p>
              <p className="text-sm font-semibold text-slate-800">{router}</p>
            </div>

            {uplink && router && (
              <TbHttpConnect size={22} className="text-emerald-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardConnection;
