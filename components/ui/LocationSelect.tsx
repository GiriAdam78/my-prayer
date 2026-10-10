"use client";

import { useEffect, useRef, useState } from "react";

interface City {
  id: string;
  lokasi: string;
}

interface LocationSelectProps {
  cities: City[];
  value?: string;
  onChange?: (city: City) => void;
}

export default function LocationSelect({
  cities,
  value = "",
  onChange,
}: LocationSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedCity = cities.find((city) => city.id === value);

  const filteredCities = cities.filter((city) =>
    city.lokasi.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (city: City) => {
    onChange?.(city);
    setOpen(false);
    setSearch("");
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xs">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`
          flex h-11 w-full items-center justify-between
          rounded-lg border bg-white px-3.5
          text-sm font-medium
          shadow-sm outline-none
          transition
          ${
            open
              ? "border-emerald-500 ring-2 ring-emerald-500/10"
              : "border-slate-200 hover:border-slate-300"
          }
        `}
      >
        <span className={selectedCity ? "text-slate-900" : "text-slate-400"}>
          {selectedCity?.lokasi || "Pilih kota / kabupaten"}
        </span>

        {/* Chevron */}
        <svg
          className={`h-4 w-4 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {/* Search */}
          <div className="border-b border-slate-100 p-2">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 104.371 8.842l3.143 3.143a.75.75 0 101.06-1.06l-3.143-3.143A5.5 5.5 0 009 3.5zM5 9a4 4 0 118 0 4 4 0 01-8 0z"
                  clipRule="evenodd"
                />
              </svg>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari kota atau kabupaten..."
                autoFocus
                className="
                  h-10 w-full rounded-md
                  border-0 bg-slate-50
                  pl-9 pr-3
                  text-sm text-slate-900
                  outline-none
                  placeholder:text-slate-400
                  focus:ring-1 focus:ring-emerald-500
                "
              />
            </div>
          </div>

          {/* Options */}
          <div className="max-h-64 overflow-y-auto p-1.5">
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => {
                const isSelected = city.id === value;

                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => handleSelect(city)}
                    className={`
                      flex w-full items-center
                      justify-between rounded-md
                      px-3 py-2.5
                      text-left text-sm
                      transition
                      ${
                        isSelected
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }
                    `}
                  >
                    <span>{city.lokasi}</span>

                    {isSelected && (
                      <svg
                        className="h-4 w-4 text-emerald-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0l-3.25-3.25a1 1 0 111.42-1.42l2.54 2.54 6.54-6.54a1 1 0 011.42 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-8 text-center text-sm text-slate-400">
                Kota atau kabupaten tidak ditemukan.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
