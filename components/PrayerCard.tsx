interface PrayerCardProps {
  name: string;
  time: string;
  active?: boolean;
}

export default function PrayerCard({
  name,
  time,
  active = false,
}: PrayerCardProps) {
  return (
    <div
      className={`
        flex min-h-[145px] flex-col items-center justify-center
        border-r border-slate-200 px-3 py-5
        last:border-r-0
        ${active ? "bg-emerald-600 text-white" : "bg-white text-slate-900"}
      `}
    >
      <span
        className={`
          text-sm font-bold uppercase tracking-wide
          ${active ? "text-white" : "text-slate-500"}
        `}
      >
        {name}
      </span>

      <span
        className={`
          mt-2 text-4xl font-black tracking-tight
          ${active ? "text-white" : "text-slate-950"}
        `}
      >
        {time}
      </span>

      {active && (
        <span className="mt-1 text-[10px] font-bold uppercase tracking-wide text-white">
          Berikutnya
        </span>
      )}
    </div>
  );
}
