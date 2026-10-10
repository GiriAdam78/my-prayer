import { Search } from "lucide-react";
import PrayerCard from "./PrayerCard";
import LocationSelect from "./ui/LocationSelect";


interface Prayer {
  name: string;
  time: string;
  active?: boolean;
}

interface PrayerScheduleProps {
  prayers: Prayer[];
}

export default function PrayerSchedule({ prayers }: PrayerScheduleProps) {
  return (
    <section>
      <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:grid-cols-4 lg:grid-cols-8">
        {prayers.map((prayer) => (
          <PrayerCard
            key={prayer.name}
            name={prayer.name}
            time={prayer.time}
            active={prayer.active}
          />
        ))}
      </div>
    </section>
  );
}
