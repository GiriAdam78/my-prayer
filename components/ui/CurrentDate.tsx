"use client";

import { useEffect, useState } from "react";

interface HijriDate {
  tanggal: string;
  [key: string]: unknown;
}

export default function CurrentDate() {
  const [gregorianDate, setGregorianDate] = useState("");
  const [hijriDate, setHijriDate] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const updateGregorianDate = () => {
      setGregorianDate(
        new Intl.DateTimeFormat("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Jakarta",
        }).format(new Date()),
      );
    };

    updateGregorianDate();

    const timer = window.setInterval(updateGregorianDate, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchHijriDate() {
      try {
        const response = await fetch(
          "/api/myquran/cal/today?tz=Asia%2FJakarta&method=islamic-umalqura",
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil kalender Hijriah");
        }

        const result = await response.json();

        if (!result.status || !result.data?.hijr) {
          throw new Error("Data Hijriah tidak tersedia");
        }

        const hijri = result.data.hijr;

        const formattedDate = `${hijri.day} ${hijri.monthName} ${hijri.year} H`;

        if (!cancelled) {
          setHijriDate(formattedDate);
          setError(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
        }
      }
    }

    fetchHijriDate();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="shrink-0 text-right">
      <p className="text-sm font-semibold text-slate-800 sm:text-base">
        {gregorianDate || "Memuat tanggal..."}
      </p>

      <p className="mt-1 text-sm text-emerald-600">
        {hijriDate ||
          (error
            ? "Tanggal Hijriah tidak tersedia"
            : "Memuat kalender Hijriah...")}
      </p>
    </div>
  );
}
