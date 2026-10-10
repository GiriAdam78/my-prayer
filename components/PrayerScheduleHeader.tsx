"use client";

import LocationSelect from "./ui/LocationSelect";

interface City {
  id: string;
  lokasi: string;
}

interface PrayerScheduleHeaderProps {
  cities: City[];
  value: string;
  onChange: (city: City) => void;
}

export default function PrayerScheduleHeader({
  cities,
  value,
  onChange,
}: PrayerScheduleHeaderProps) {
  const selected = cities.find((city) => city.id === value);

  return (
    <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Jadwal Sholat Hari Ini
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {selected?.lokasi ?? "Pilih kota atau kabupaten"}
        </p>
      </div>

      <LocationSelect cities={cities} value={value} onChange={onChange} />
    </div>
  );
}
