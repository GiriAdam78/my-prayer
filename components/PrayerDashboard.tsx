"use client";

import { useEffect, useState, useRef } from "react";
import Countdown from "@/components/Countdown";
import PrayerScheduleHeader from "@/components/PrayerScheduleHeader";
import PrayerSchedule from "@/components/PrayerSchedule";
import IslamicEventCountdown from "./IslamicEventCountdown";
import PrayerToast from "./ui/PrayerToast";

interface City {
  id: string;
  lokasi: string;
}

interface PrayerTimes {
  tanggal: string;
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

interface ApiResponse<T> {
  status: boolean;
  message?: string;
  data: T;
}

const CITY_STORAGE_KEY = "jadwal-sholat-city-id";

const PRAYER_NAMES: Record<string, string> = {
  subuh: "Subuh",
  dzuhur: "Dzuhur",
  ashar: "Ashar",
  maghrib: "Maghrib",
  isya: "Isya",
};

function getWibSeconds() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const part = (type: string) =>
    Number(parts.find((item) => item.type === type)?.value ?? 0);

  return part("hour") * 3600 + part("minute") * 60 + part("second");
}

function getNextPrayer(times: PrayerTimes, nowSeconds: number) {
  const prayers = [
    ["subuh", times.subuh],
    ["dzuhur", times.dzuhur],
    ["ashar", times.ashar],
    ["maghrib", times.maghrib],
    ["isya", times.isya],
  ] as const;

  for (const [key, time] of prayers) {
    const [hour, minute] = time.split(":").map(Number);
    const prayerSeconds = hour * 3600 + minute * 60;

    if (prayerSeconds > nowSeconds) {
      return {
        name: PRAYER_NAMES[key],
        time,
        secondsLeft: prayerSeconds - nowSeconds,
      };
    }
  }

  // Jika semua waktu sholat hari ini sudah lewat,
  // countdown diarahkan ke Subuh hari berikutnya.
  const [hour, minute] = times.subuh.split(":").map(Number);
  const subuhSeconds = hour * 3600 + minute * 60;

  return {
    name: "Subuh",
    time: times.subuh,
    secondsLeft: 86400 - nowSeconds + subuhSeconds,
  };
}

function formatCountdown(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export default function PrayerDashboard() {
  const [toastPrayer, setToastPrayer] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [times, setTimes] = useState<PrayerTimes | null>(null);

  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [online, setOnline] = useState(true);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);

  const notifiedPrayers = useRef(new Set<string>());
  // Pantau koneksi internet dan detak countdown.
  useEffect(() => {
    const updateOnline = () => setOnline(navigator.onLine);

    updateOnline();

    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);

    const timer = window.setInterval(() => {
      setTick((value) => value + 1);
    }, 1000);

    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
      window.clearInterval(timer);
    };
  }, []);

  // Ambil daftar kota dan pulihkan pilihan dari localStorage.
  useEffect(() => {
    let cancelled = false;

    async function loadCities() {
      setLoadingCities(true);

      try {
        const response = await fetch("/api/myquran/sholat/kabkota/semua");

        if (!response.ok) {
          throw new Error("Gagal mengambil daftar kota.");
        }

        const result: ApiResponse<City[]> = await response.json();

        if (!result.status || !Array.isArray(result.data)) {
          throw new Error("Respons daftar kota tidak valid.");
        }

        if (cancelled) return;

        setCities(result.data);

        const savedId = localStorage.getItem(CITY_STORAGE_KEY);

        const savedCity = result.data.find((city) => city.id === savedId);

        if (savedCity) {
          setSelectedCity(savedCity.id);
        } else {
          localStorage.removeItem(CITY_STORAGE_KEY);
          setSelectedCity("");
        }

        setError("");
      } catch {
        if (!cancelled) {
          setError(
            navigator.onLine
              ? "Daftar kota gagal dimuat. Periksa koneksi atau coba lagi."
              : "Koneksi internet terputus. Sambungkan internet untuk memuat daftar kota.",
          );
        }
      } finally {
        if (!cancelled) setLoadingCities(false);
      }
    }

    loadCities();

    return () => {
      cancelled = true;
    };
  }, []);

  // Simpan kota setiap kali pengguna memilih lokasi baru.
  useEffect(() => {
    if (selectedCity) {
      localStorage.setItem(CITY_STORAGE_KEY, selectedCity);
    }
  }, [selectedCity]);

  // Ambil jadwal setiap kali kota berubah.
  useEffect(() => {
    if (!selectedCity) return;

    let cancelled = false;

    async function loadSchedule() {
      setLoadingSchedule(true);
      setError("");

      try {
        const response = await fetch(
          `/api/myquran/sholat/jadwal/${encodeURIComponent(
            selectedCity,
          )}/today?tz=Asia%2FJakarta`,
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil jadwal sholat.");
        }

        const result = await response.json();

        if (!result.status || !result.data?.jadwal) {
          throw new Error("Data jadwal tidak tersedia.");
        }

        const dailySchedule = Object.values(result.data.jadwal)[0] as
          | PrayerTimes
          | undefined;

        if (!dailySchedule) {
          throw new Error("Jadwal hari ini tidak ditemukan.");
        }

        if (!cancelled) {
          setTimes(dailySchedule);
          setError("");
        }
      } catch {
        if (!cancelled) {
          setError(
            navigator.onLine
              ? "Jadwal sholat gagal dimuat. Silakan coba lagi."
              : "Tidak ada koneksi internet. Hubungkan perangkat ke internet untuk memuat jadwal sholat.",
          );
        }
      } finally {
        if (!cancelled) setLoadingSchedule(false);
      }
    }

    loadSchedule();

    return () => {
      cancelled = true;
    };
  }, [selectedCity]);

  const nextPrayer = times ? getNextPrayer(times, getWibSeconds()) : null;

  // Memakai tick agar countdown diperbarui setiap detik.
  void tick;

  const prayers = times
    ? [
        { name: "Imsak", time: times.imsak },
        { name: "Subuh", time: times.subuh },
        { name: "Terbit", time: times.terbit },
        { name: "Dhuha", time: times.dhuha },
        { name: "Dzuhur", time: times.dzuhur },
        { name: "Ashar", time: times.ashar },
        { name: "Maghrib", time: times.maghrib },
        { name: "Isya", time: times.isya },
      ].map((prayer) => ({
        ...prayer,
        active: prayer.name === nextPrayer?.name,
      }))
    : [];

  useEffect(() => {
    if (!times || !selectedCity) return;

    const nowSeconds = getWibSeconds();

    const date = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    const prayers = [
      { name: "Subuh", time: times.subuh },
      { name: "Dzuhur", time: times.dzuhur },
      { name: "Ashar", time: times.ashar },
      { name: "Maghrib", time: times.maghrib },
      { name: "Isya", time: times.isya },
    ];

    for (const prayer of prayers) {
      const [hour, minute] = prayer.time.split(":").map(Number);
      const prayerSeconds = hour * 3600 + minute * 60;
      const key = `${selectedCity}-${date}-${prayer.name}`;

      if (nowSeconds >= prayerSeconds && !notifiedPrayers.current.has(key)) {
        notifiedPrayers.current.add(key);
        setToastPrayer(prayer.name);
        break;
      }
    }
  }, [times, selectedCity, tick]);
  return (
    <>
      {/* Peringatan koneksi */}
      {(!online || error) && (
        <div
          role="alert"
          className="border-b border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-900"
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <p>
              {!online
                ? "Koneksi internet terputus. Data terbaru membutuhkan internet."
                : error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="shrink-0 font-semibold underline underline-offset-4"
            >
              Coba lagi
            </button>
          </div>
        </div>
      )}

      {/* Pita informasi bergantian */}
      <IslamicEventCountdown
        nextPrayerName={nextPrayer?.name ?? "Memuat"}
        nextPrayerTime={nextPrayer?.time ?? "--:--"}
        countdown={
          nextPrayer ? formatCountdown(nextPrayer.secondsLeft) : "--:--:--"
        }
      />

      {/* Countdown utama */}
      <section className="relative flex min-h-[50dvh] items-center overflow-hidden px-5 py-16 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 top-40 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl" />

        <div className="relative mx-auto w-full max-w-6xl">
          <Countdown
            prayerName={nextPrayer?.name ?? "Sholat"}
            countdown={
              nextPrayer ? formatCountdown(nextPrayer.secondsLeft) : "--:--:--"
            }
          />
        </div>
      </section>
      <div className="mx-auto lg:max-w-7xl max-w-6xl mb-2">
        <PrayerScheduleHeader
          cities={cities}
          value={selectedCity}
          onChange={(city: any) => setSelectedCity(city.id)}
        />
        {loadingCities || loadingSchedule ? (
          <p className="py-8 text-center text-sm text-slate-500">
            Memuat jadwal sholat...
          </p>
        ) : times ? (
          <PrayerSchedule prayers={prayers} />
        ) : (
          <p className="rounded-xl border border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
            Jadwal belum tersedia. Periksa koneksi internet, lalu coba lagi.
          </p>
        )}
      </div>

      {/* Jadwal dan pemilih kota */}
      {toastPrayer && (
        <PrayerToast
          prayerName={toastPrayer}
          onClose={() => setToastPrayer("")}
        />
      )}
    </>
  );
}
