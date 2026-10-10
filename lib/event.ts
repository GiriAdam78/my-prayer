export type EventCategory = "islam" | "nasional";

export interface CalendarEvent {
  id: string;
  name: string;
  date: string; // Format YYYY-MM-DD
  category: EventCategory;
  description?: string;
}

export const calendarEvents: CalendarEvent[] = [
  // Hari besar Islam.
  // Tanggal Hijriah perlu disesuaikan dengan kalender tahunan.
  {
    id: "ramadan",
    name: "Awal Ramadan",
    date: "2027-02-08",
    category: "islam",
    description: "Perkiraan awal bulan Ramadan",
  },
  {
    id: "nuzulul-quran",
    name: "Nuzulul Quran",
    date: "2027-02-24",
    category: "islam",
  },
  {
    id: "idulfitri",
    name: "Idulfitri",
    date: "2027-03-10",
    category: "islam",
  },
  {
    id: "iduladha",
    name: "Iduladha",
    date: "2027-05-17",
    category: "islam",
  },
  {
    id: "tahun-baru-islam",
    name: "Tahun Baru Islam",
    date: "2027-06-07",
    category: "islam",
  },
  {
    id: "maulid-nabi",
    name: "Maulid Nabi Muhammad SAW",
    date: "2027-08-15",
    category: "islam",
  },

  // Hari besar nasional.
  {
    id: "tahun-baru",
    name: "Tahun Baru Masehi",
    date: "2027-01-01",
    category: "nasional",
  },
  {
    id: "hari-kartini",
    name: "Hari Kartini",
    date: "2027-04-21",
    category: "nasional",
  },
  {
    id: "kemerdekaan",
    name: "Hari Kemerdekaan RI",
    date: "2027-08-17",
    category: "nasional",
  },
  {
    id: "sumpah-pemuda",
    name: "Hari Sumpah Pemuda",
    date: "2027-10-28",
    category: "nasional",
  },
  {
    id: "hari-pahlawan",
    name: "Hari Pahlawan",
    date: "2027-11-10",
    category: "nasional",
  },
];
