const HALF_HOUR = 30 * 60 * 1000;

export function getHalfHourTimeSlots() {
  return Array.from({ length: 48 }, (_, index) => {
    const hours = Math.floor(index / 2).toString().padStart(2, "0");
    const minutes = index % 2 === 0 ? "00" : "30";
    return `${hours}:${minutes}`;
  });
}

export function combineDateAndTime(date: string, time: string) {
  return date && time ? `${date}T${time}` : "";
}

export function toChinaDateTimeInputValues(value: Date | string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(value));
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
  return { date: `${part("year")}-${part("month")}-${part("day")}`, time: `${part("hour")}:${part("minute")}` };
}

export function isHalfHourBoundary(date: Date) {
  return date.getSeconds() === 0 && date.getMilliseconds() === 0 && [0, 30].includes(date.getMinutes());
}

export function validateTimeRange(startAt: Date, endAt: Date) {
  if (!isHalfHourBoundary(startAt) || !isHalfHourBoundary(endAt)) {
    return "开始和结束时间必须落在整点或半点";
  }
  if (endAt.getTime() <= startAt.getTime()) return "结束时间必须晚于开始时间";
  if ((endAt.getTime() - startAt.getTime()) % HALF_HOUR !== 0) return "会议时长必须按半小时递增";
  return null;
}

export function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && aEnd > bStart;
}
