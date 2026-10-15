"use client";

import { useEffect } from "react";

interface PrayerToastProps {
  prayerName: string;
  onClose: () => void;
}

export default function PrayerToast({ prayerName, onClose }: PrayerToastProps) {
  useEffect(() => {
    const timeout = window.setTimeout(onClose, 4000);

    return () => window.clearTimeout(timeout);
  }, [onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="
        fixed right-3 top-3 z-[100]
        w-[calc(100%-1.5rem)] max-w-[300px]
        animate-in slide-in-from-top-2 fade-in
        duration-200
        rounded-lg border border-emerald-200
        bg-white p-3 shadow-lg
      "
    >
      <div className="flex items-start gap-2.5">
        <div
          className="
            flex h-8 w-8 shrink-0 items-center
            justify-center rounded-full
            bg-emerald-100 text-emerald-700
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug text-gray-900">
            Waktu sholat {prayerName} telah tiba
          </p>

          <p className="mt-1 text-xs leading-relaxed text-gray-600">
            Saatnya mengambil air wudhu dan melaksanakan sholat.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup notifikasi"
          className="
            shrink-0 rounded p-1 text-gray-400
            transition hover:bg-gray-100 hover:text-gray-700
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m18 6-12 12M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
