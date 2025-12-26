"use client";

import Link from "next/link";
import { FaThreads } from "react-icons/fa6";

function Navbar() {
  return (
    <nav
      className="
        sticky top-0 z-50
        border-b bg-white/80 backdrop-blur
      "
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <FaThreads size={28} className="text-indigo-600" />
          <span className="text-sm font-semibold text-slate-900">
            Bilsyp Lab
          </span>
        </Link>

        {/* Nav */}
        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/streaming"
            className="
              font-medium text-slate-600
              transition
              hover:text-indigo-600
            "
          >
            Stream Lab
          </Link>

          <Link
            href="/future-work"
            className="
              font-medium text-slate-600
              transition
              hover:text-indigo-600
            "
          >
            Future Work
          </Link>
          <Link
            href="/theory"
            className="
              font-medium text-slate-600
              transition
              hover:text-indigo-600
            "
          >
            Theory
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
