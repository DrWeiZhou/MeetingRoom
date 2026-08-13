const WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

export function chinaDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(date);
  const find = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  return { year: Number(find("year")), month: Number(find("month")), day: Number(find("day")), weekday: find("weekday") };
}

export function getChinaWeekRange(now = new Date()) {
  const { year, month, day } = chinaDateParts(now);
  const chinaNoon = new Date(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T12:00:00+08:00`);
  const mondayOffset = (chinaNoon.getUTCDay() + 6) % 7;
  const startNoon = new Date(chinaNoon.getTime() - mondayOffset * 86400000);
  const startParts = chinaDateParts(startNoon);
  const start = new Date(`${startParts.year}-${String(startParts.month).padStart(2, "0")}-${String(startParts.day).padStart(2, "0")}T00:00:00+08:00`);
  return { start, end: new Date(start.getTime() + 7 * 86400000) };
}

export function getWeekDays(start: Date) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start.getTime() + index * 86400000);
    const parts = chinaDateParts(date);
    return { date, key: `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`, label: parts.weekday || WEEKDAYS[index + 1], day: `${parts.month}/${parts.day}` };
  });
}

export function chinaDateKey(date: Date | string) {
  const parts = chinaDateParts(new Date(date));
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}
