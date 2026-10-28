"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { LocaleSwitch } from "@/components/layout/LocaleSwitch";
import { CloseIcon, MenuIcon, StarIcon } from "@/components/shared/Icons";
import { Wordmark } from "@/components/shared/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useProgress } from "@/components/providers/ProgressProvider";
import { cn } from "@/lib/utils";
import type { MessageKey } from "@/lib/i18n";

const LINKS: { href: string; key: MessageKey }[] = [
  { href: "/", key: "nav.home" },
  { href: "/stories", key: "nav.stories" },
  { href: "/#journey", key: "nav.journey" },
  { href: "/teachers", key: "nav.teachers" },
  { href: "/about", key: "nav.about" },
];

export function SiteHeader() {
  const { t } = useLocale();
  const pathname = usePathname();
  const { stars, hydrated } = useProgress();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTarget = panelRef.current?.querySelector<HTMLElement>("a, button");
    focusTarget?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (event.key === "Tab" && panelRef.current) {
        const nodes = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
        ).filter((node) => node.offsetParent !== null);
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/";
      if (href.includes("#")) return false;
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname],
  );

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-colors duration-300",
          scrolled
            ? "border-b border-forest-900/10 bg-parchment-100/95 backdrop-blur-sm"
            : "border-b border-transparent bg-parchment-100/80 backdrop-blur-[2px]",
        )}
      >
        <div className="shell flex h-[var(--header-h)] items-center justify-between gap-4">
          <Link href="/" className="shrink-0" aria-label={`${t("site.name")} — ${t("nav.home")}`}>
            <Wordmark />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label={t("nav.menu")}>
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative py-2 text-[0.8rem] font-medium tracking-[0.03em] transition-colors",
                  isActive(link.href)
                    ? "text-forest-900"
                    : "text-ink-500 hover:text-forest-900",
                )}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {t(link.key)}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-px bg-gold-500 transition-all duration-300",
                    isActive(link.href) ? "w-full" : "w-0",
                  )}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <LocaleSwitch />
            <Link
              href="/progress"
              className="hidden items-center gap-1.5 text-[0.76rem] font-medium text-forest-900 transition-colors hover:text-gold-600 md:inline-flex"
            >
              <StarIcon size={15} className="text-gold-500" />
              <span className="hidden xl:inline">{t("nav.progress")}</span>
              {hydrated && stars > 0 ? (
                <span className="rounded-full bg-forest-900/8 px-1.5 py-0.5 text-[0.66rem] tabular-nums text-forest-900">
                  {stars}
                </span>
              ) : null}
            </Link>
            <button
              ref={triggerRef}
              type="button"
              className="icon-btn lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? t("a11y.closeMenu") : t("a11y.openMenu")}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-nav"
        ref={panelRef}
        className={cn(
          "fixed inset-0 z-[70] flex flex-col bg-forest-900 text-parchment-100 transition-all duration-500 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
        inert={!open ? true : undefined}
      >
        <div className="shell flex h-[var(--header-h)] items-center justify-between">
          <Wordmark inverted />
          <button
            type="button"
            className="icon-btn border-parchment-200/30 text-parchment-100 hover:bg-parchment-100/10"
            onClick={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
            aria-label={t("a11y.closeMenu")}
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <div
          className={cn(
            "shell flex flex-1 flex-col justify-between pb-10 pt-6 transition-transform duration-500",
            open ? "translate-y-0" : "translate-y-4",
          )}
        >
          <nav aria-label={t("nav.menu")} className="flex flex-col">
            {LINKS.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-4 border-b border-parchment-200/15 py-5"
              >
                <span className="w-6 shrink-0 text-[0.62rem] tracking-[0.2em] text-gold-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="display text-[2rem] leading-tight transition-colors group-hover:text-gold-300">
                  {t(link.key)}
                </span>
              </Link>
            ))}
            <Link
              href="/progress"
              onClick={() => setOpen(false)}
              className="group flex items-baseline gap-4 py-5"
            >
              <span className="w-6 shrink-0 text-[0.62rem] tracking-[0.2em] text-gold-400">
                {String(LINKS.length + 1).padStart(2, "0")}
              </span>
              <span className="display text-[2rem] leading-tight transition-colors group-hover:text-gold-300">
                {t("nav.progress")}
              </span>
            </Link>
          </nav>

          <div className="mt-10 flex flex-col gap-6">
            <LocaleSwitch tone="dark" />
            <p className="max-w-xs text-[0.78rem] leading-relaxed text-parchment-200/60">
              {t("footer.privacy")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
