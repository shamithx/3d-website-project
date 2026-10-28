"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { CloseIcon } from "@/components/shared/Icons";

export function PwaRegister() {
  const { t } = useLocale();
  const [offline, setOffline] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") setOffline(!navigator.onLine);

    const goOnline = () => setOffline(false);
    const goOffline = () => setOffline(true);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      const register = () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {
          // Offline support is an enhancement; the app still works without it.
        });
      };
      if (document.readyState === "complete") register();
      else window.addEventListener("load", register, { once: true });
    }

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (!offline || dismissed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="no-print fixed inset-x-3 bottom-3 z-[65] flex items-center justify-between gap-4 rounded-sm border border-gold-500/40 bg-forest-900 px-4 py-3 text-parchment-100 shadow-panel sm:inset-x-auto sm:right-5 sm:max-w-sm"
    >
      <p className="text-[0.8rem] leading-snug">
        <span className="font-semibold">{t("common.offline")}.</span> {t("offline.body")}
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
        aria-label={t("common.close")}
      >
        <CloseIcon size={16} />
      </button>
    </div>
  );
}
