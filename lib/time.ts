const HALF_HOUR = 30 * 60 * 1000;

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
