"use client";

import { useEffect, useState } from "react";
import CurrentDate from "./ui/CurrentDate";

export default function Header() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Intl.DateTimeFormat("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Jakarta",
        }).format(new Date()),
      );
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-slate-200 bg-white/20 backdrop:backdrop-blur-sm">
      <div className="flex min-h-[90px] items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-10">
        {/* Clock */}
        <div className="shrink-0">
          <div className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {time || "16:29:00"}
          </div>

          <div className="text-xs font-semibold tracking-wider text-slate-500">
            WIB
          </div>
        </div>

        {/* Title */}
        <div className="hidden min-w-0 lg:flex-1 text-center">
          <h1 className="truncate text-xl font-bold text-slate-950 sm:text-2xl">
            Jadwal Sholat
          </h1>

          <p className="mt-1 text-sm font-medium text-slate-500 sm:text-base">
            Jadwal Sholat & Imsakiyah
          </p>
        </div>

        {/* Date */}
        <div className="shrink-0 text-right sm:block">
          <CurrentDate/>
        </div>
      </div>
    </header>
  );
}
