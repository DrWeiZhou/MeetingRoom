export type DeviceType = "desktop" | "mobile" | "tablet" | "unknown";

export function inferDeviceType(userAgent: string | null): DeviceType {
  if (!userAgent) return "unknown";
  if (/ipad|tablet|playbook|silk/i.test(userAgent)) return "tablet";
  if (/mobile|iphone|ipod|android/i.test(userAgent)) return "mobile";
  return "desktop";
}
