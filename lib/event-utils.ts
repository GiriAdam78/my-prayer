import type { CalendarEvent } from "./event";

function parseLocalDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getDaysRemaining(date: string) {
  const today = new Date();

  // Bandingkan tanggal kalender lokal, bukan jam saat ini.
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const targetDate = parseLocalDate(date);

  return Math.round((targetDate.getTime() - todayDate.getTime()) / 86_400_000);
}

export function getUpcomingEvents(events: CalendarEvent[]) {
  return events
    .map((event) => ({
      ...event,
      daysRemaining: getDaysRemaining(event.date),
    }))
    .filter((event) => event.daysRemaining >= 0)
    .sort(
      (a, b) =>
        a.daysRemaining - b.daysRemaining || a.date.localeCompare(b.date),
    );
}
