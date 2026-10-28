"use client";

import Link from "next/link";
import { useEffect } from "react";
import { LotusMark } from "@/components/shared/ui";
import { ResetIcon } from "@/components/shared/Icons";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep the console trace for local debugging; nothing is sent to a server.
    console.error(error);
  }, [error]);

  return (
    <div className="shell flex min-h-[70svh] flex-col items-center justify-center py-20 text-center">
      <LotusMark size={52} className="text-gold-500" />
      <h1 className="mt-6 text-display-md text-forest-900">Something interrupted the story</h1>
      <p className="mt-3 max-w-md text-[0.94rem] leading-relaxed text-ink-500">
        The page could not finish loading. Your reading progress is stored on this device and has not
        been lost.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn btn-primary btn-sm">
          <ResetIcon size={14} />
          Try again
        </button>
        <Link href="/" className="btn btn-secondary btn-sm">
          Return home
        </Link>
      </div>
    </div>
  );
}
