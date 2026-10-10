"use client";

import { useEffect, useState } from "react";
import { calendarEvents } from "@/lib/event";
import { getUpcomingEvents } from "@/lib/event-utils";

interface IslamicEventCountdownProps {
  nextPrayerName: string;
  nextPrayerTime: string;
  countdown: string;
}

export default function IslamicEventCountdown({
  nextPrayerName,
  nextPrayerTime,
  countdown,
}: IslamicEventCountdownProps) {
  const [showPrayer, setShowPrayer] = useState(false);
  const [visible, setVisible] = useState(true);

  const [upcomingEvents, setUpcomingEvents] = useState<
    ReturnType<typeof getUpcomingEvents>
  >([]);

  // Hitung event terdekat dan perbarui ketika tanggal berganti.
  useEffect(() => {
    const updateEvents = () => {
      setUpcomingEvents(getUpcomingEvents(calendarEvents));
    };

    updateEvents();

    const timer = window.setInterval(updateEvents, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  // Pergantian informasi dengan fade.
  useEffect(() => {
    const interval = window.setInterval(() => {
      setVisible(false);

      const timeout = window.setTimeout(() => {
        setShowPrayer((prev) => !prev);
        setVisible(true);
      }, 400);

      return () => window.clearTimeout(timeout);
    }, 6000);

    return () => window.clearInterval(interval);
  }, []);

  const nextEvent = upcomingEvents[0];

  return (
    <section className="border-y border-emerald-100 bg-emerald-50/70">
      <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center px-5 py-3 sm:px-8 lg:px-10">
        <div
          className={`flex w-full items-center justify-between gap-4 transition-opacity duration-300 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          {!showPrayer ? (
            nextEvent ? (
              <>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold uppercase tracking-wider text-emerald-700 sm:text-sm">
                    {nextEvent.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {nextEvent.category === "islam"
                      ? "Hari besar Islam"
                      : "Hari besar nasional"}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-center rounded-lg bg-white px-4 py-2 shadow-sm">
                  <span className="text-xl font-black leading-none text-emerald-700 sm:text-2xl">
                    {nextEvent.daysRemaining === 0
                      ? "Hari ini"
                      : nextEvent.daysRemaining}
                  </span>

                  {nextEvent.daysRemaining !== 0 && (
                    <span className="mt-1 text-[9px] font-bold uppercase tracking-wide text-slate-500">
                      Hari lagi
                    </span>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-500">
                Tidak ada event mendatang.
              </p>
            )
          ) : (
            <>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 sm:text-sm">
                  Sholat selanjutnya
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {nextPrayerName} · {nextPrayerTime}
                </p>
              </div>

              <div className="shrink-0 rounded-lg bg-white px-4 py-2 text-center shadow-sm">
                <p className="text-lg font-black tabular-nums text-slate-900">
                  {countdown}
                </p>

                <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-slate-500">
                  Waktu tersisa
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
