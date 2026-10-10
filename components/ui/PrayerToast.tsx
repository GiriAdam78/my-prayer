"use client";

import { useEffect } from "react";

interface PrayerToastProps {
  prayerName: string;
  onClose: () => void;
}

export default function PrayerToast({ prayerName, onClose }: PrayerToastProps) {
  useEffect(() => {
    const timeout = window.setTimeout(onClose, 1000);

    return () => window.clearTimeout(timeout);
  }, [onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-sm animate-in slide-in-from-top-2 duration-200 rounded-xl border border-emerald-200 bg-white p-4 shadow-xl"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
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
          <p className="font-semibold text-gray-900">
            Waktu sholat {prayerName} telah tiba
          </p>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">
            Silakan mengambil air wudhu untuk melaksanakan sholat.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup notifikasi"
          className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m18 6-12 12M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
