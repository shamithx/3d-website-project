"use client";

import { useRef, useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DownloadIcon, ShareIcon } from "@/components/shared/Icons";
import { LotusMark } from "@/components/shared/ui";

export function DailyWisdomCard({
  quote,
  sourceTitle,
  attribution,
}: {
  quote: string;
  sourceTitle: string;
  attribution: string;
}) {
  const { locale, t } = useLocale();
  const [status, setStatus] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isSinhala = locale === "si";

  async function downloadCard() {
    try {
      await document.fonts.ready;
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no canvas");

      const displayFamily =
        getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim() ||
        "Georgia, serif";
      const sinhalaFamily =
        getComputedStyle(document.documentElement).getPropertyValue("--font-sinhala").trim() ||
        "sans-serif";

      ctx.fillStyle = "#F8F0DE";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(192,148,63,0.75)";
      ctx.lineWidth = 3;
      ctx.strokeRect(54, 54, canvas.width - 108, canvas.height - 108);
      ctx.strokeStyle = "rgba(30,58,43,0.18)";
      ctx.lineWidth = 1;
      ctx.strokeRect(74, 74, canvas.width - 148, canvas.height - 148);

      ctx.fillStyle = "#A2762C";
      ctx.font = `600 20px ${displayFamily}`;
      ctx.textAlign = "center";
      ctx.fillText("J A T H A K A   K A T H A", canvas.width / 2, 170);

      // Lotus mark
      ctx.save();
      ctx.translate(canvas.width / 2, 236);
      ctx.fillStyle = "rgba(192,148,63,0.85)";
      for (let i = -2; i <= 2; i += 1) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 7);
        ctx.beginPath();
        ctx.ellipse(0, -26, 15, 34, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();

      ctx.fillStyle = "#1B2E24";
      ctx.textAlign = "center";
      const bodySize = isSinhala ? 50 : 58;
      ctx.font = `${isSinhala ? 500 : 400} ${bodySize}px ${isSinhala ? sinhalaFamily : displayFamily}`;
      const words = quote.split(" ");
      const lines: string[] = [];
      let line = "";
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > canvas.width - 260) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      }
      if (line) lines.push(line);
      const lineHeight = bodySize * (isSinhala ? 1.75 : 1.45);
      const startY = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2;
      lines.slice(0, 9).forEach((entry, index) => {
        ctx.fillText(entry, canvas.width / 2, startY + index * lineHeight);
      });

      ctx.strokeStyle = "rgba(192,148,63,0.55)";
      ctx.lineWidth = 2;
      const ruleY = Math.min(canvas.height - 320, startY + lines.length * lineHeight + 40);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 60, ruleY);
      ctx.lineTo(canvas.width / 2 + 60, ruleY);
      ctx.stroke();

      ctx.fillStyle = "#5C5647";
      ctx.font = `500 26px ${isSinhala ? sinhalaFamily : displayFamily}`;
      ctx.fillText(sourceTitle, canvas.width / 2, ruleY + 62);

      ctx.fillStyle = "rgba(92,86,71,0.7)";
      ctx.font = `400 20px ${displayFamily}`;
      ctx.fillText(attribution, canvas.width / 2, canvas.height - 150);
      ctx.fillText("Ancient Wisdom. Living Stories.", canvas.width / 2, canvas.height - 106);

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("no blob");
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "jathaka-katha-daily-wisdom.png";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setStatus(t("common.saved"));
    } catch {
      setStatus(t("common.tryAgain"));
    }
  }

  async function share() {
    const shareData = {
      title: "Jathaka Katha",
      text: `${quote} — ${sourceTitle}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(`${quote}\n— ${sourceTitle}\n${window.location.href}`);
      setStatus(t("common.copied"));
    } catch {
      setStatus(null);
    }
  }

  return (
    <div>
      <div
        ref={cardRef}
        className="relative overflow-hidden border border-gold-500/35 bg-parchment-50 px-7 py-10 sm:px-10"
      >
        <div className="flex items-center justify-between">
          <span className="text-[0.58rem] uppercase tracking-[0.24em] text-gold-600">Jathaka Katha</span>
          <LotusMark size={22} className="text-gold-500" />
        </div>

        <blockquote className="mt-10">
          <p
            className={
              isSinhala
                ? "si text-[1.45rem] leading-[1.8] text-forest-900 sm:text-[1.65rem]"
                : "display text-[1.75rem] italic leading-[1.35] text-forest-900 sm:text-[2rem]"
            }
          >
            “{quote}”
          </p>
          <footer className="mt-7 flex items-center gap-3 border-t border-gold-500/30 pt-4">
            <span className="h-px w-8 bg-gold-500/60" aria-hidden="true" />
            <cite className="not-italic text-[0.72rem] uppercase tracking-[0.14em] text-ink-500">
              {sourceTitle}
            </cite>
          </footer>
        </blockquote>

        <div className="mt-8 flex items-center justify-between">
          <p className="max-w-[16rem] text-[0.62rem] leading-relaxed text-ink-500/70">{attribution}</p>
          <LotusMark size={26} className="text-gold-500/60" />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={downloadCard} className="btn btn-secondary btn-sm">
          <DownloadIcon size={15} />
          {t("common.download")}
        </button>
        <button type="button" onClick={share} className="btn btn-sm border-forest-900/20 text-forest-900">
          <ShareIcon size={15} />
          {t("common.share")}
        </button>
        {status ? (
          <span role="status" className="text-[0.72rem] text-forest-800">
            {status}
          </span>
        ) : null}
      </div>
    </div>
  );
}
