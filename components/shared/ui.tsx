import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "onDark" | "ghostDark";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  onDark: "btn-on-dark",
  ghostDark: "btn-ghost-dark",
};

const SIZES: Record<Size, string> = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
};

export function buttonStyles(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn("btn", VARIANTS[variant], SIZES[size], className);
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  external,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
  ariaLabel?: string;
}) {
  const classes = buttonStyles(variant, size, className);
  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("eyebrow", className)}>{children}</span>;
}

export function GoldRule({ className }: { className?: string }) {
  return <div className={cn("hairline", className)} aria-hidden="true" />;
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  tone = "light",
  align = "left",
  action,
  id,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
  action?: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <Eyebrow className={tone === "dark" ? "text-gold-300" : undefined}>{eyebrow}</Eyebrow>
        ) : null}
        <h2
          id={id}
          className={cn(
            "mt-4 text-display-md",
            tone === "dark" ? "text-parchment-100" : "text-forest-900",
          )}
        >
          {title}
        </h2>
        {lead ? (
          <p className={cn("mt-4 lead", tone === "dark" && "text-parchment-200/75")}>{lead}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function LotusMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="currentColor">
        <ellipse cx="12" cy="7.4" rx="1.9" ry="4.1" opacity="0.95" />
        <ellipse cx="12" cy="7.4" rx="1.9" ry="4.1" transform="rotate(34 12 12)" opacity="0.8" />
        <ellipse cx="12" cy="7.4" rx="1.9" ry="4.1" transform="rotate(-34 12 12)" opacity="0.8" />
        <ellipse cx="12" cy="7.4" rx="1.8" ry="3.9" transform="rotate(66 12 12)" opacity="0.6" />
        <ellipse cx="12" cy="7.4" rx="1.8" ry="3.9" transform="rotate(-66 12 12)" opacity="0.6" />
      </g>
      <path d="M4 15.6c2.4 2.6 5.1 3.9 8 3.9s5.6-1.3 8-3.9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />
      <circle cx="12" cy="12.6" r="1.1" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

export function Wordmark({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <LotusMark size={30} className={inverted ? "text-gold-300" : "text-gold-500"} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "display text-[1.32rem] tracking-tight",
            inverted ? "text-parchment-100" : "text-forest-900",
          )}
        >
          Jathaka Katha
        </span>
        <span
          className={cn(
            "si mt-1 text-[0.66rem] tracking-[0.14em]",
            inverted ? "text-parchment-300/70" : "text-ink-500",
          )}
        >
          ජාතක කතා
        </span>
      </span>
    </span>
  );
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("tag", className)}>{children}</span>;
}

export function MetaLine({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-[0.72rem] uppercase tracking-[0.14em] text-ink-500", className)}>{children}</p>;
}
