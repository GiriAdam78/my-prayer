interface CountdownProps {
  prayerName: string;
  countdown: string;
}

export default function Countdown({ prayerName, countdown }: CountdownProps) {
  return (
    <div className="mx-auto mb-12 max-w-xl text-center">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
        Menuju {prayerName}
      </p>

      <div className="mt-3 text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
        {countdown}
      </div>

      <p className="mt-3 text-sm text-slate-500">
        Waktu tersisa menuju adzan {prayerName}
      </p>
    </div>
  );
}
