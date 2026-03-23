/**
 * Facebook Pixel helper — ensures events fire reliably before page navigation.
 *
 * Uses fbq() if available, plus a sendBeacon fallback to guarantee delivery
 * even if the page navigates away immediately after.
 */

const FB_PIXEL_ID = "1432471141994433";

type FbqFn = (...args: unknown[]) => void;

function getFbq(): FbqFn | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  return typeof w.fbq === "function" ? (w.fbq as FbqFn) : null;
}

/**
 * Track a pixel event. Returns a promise that resolves once the event
 * has been sent (or after a short timeout if fbq isn't loaded).
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
): Promise<void> {
  return new Promise((resolve) => {
    const fbq = getFbq();

    if (fbq) {
      // Fire via fbq (queues if library still loading)
      if (params) {
        fbq("track", eventName, params);
      } else {
        fbq("track", eventName);
      }
    }

    // Also fire via sendBeacon as a reliable fallback —
    // this guarantees delivery even if the page navigates away
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const beaconUrl = new URL("https://www.facebook.com/tr");
      beaconUrl.searchParams.set("id", FB_PIXEL_ID);
      beaconUrl.searchParams.set("ev", eventName);
      beaconUrl.searchParams.set("noscript", "1");
      if (params) {
        beaconUrl.searchParams.set("cd", JSON.stringify(params));
      }
      navigator.sendBeacon(beaconUrl.toString());
    }

    // Give the fbq beacon 300ms to actually send before resolving
    setTimeout(resolve, 300);
  });
}

/**
 * Track Lead event — call this on form submission, await it before navigating.
 */
export function trackLead(params?: Record<string, unknown>): Promise<void> {
  return trackEvent("Lead", params);
}

/**
 * Track Schedule event — call this when Calendly booking completes.
 */
export function trackSchedule(params?: Record<string, unknown>): Promise<void> {
  return trackEvent("Schedule", params);
}
