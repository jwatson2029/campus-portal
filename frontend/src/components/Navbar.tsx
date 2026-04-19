"use client";

import Link from "next/link";
import { useState } from "react";
import { UserButton, useAuth } from "@clerk/nextjs";

const SITE_URL = "https://studently.website";

const dashboardButtonClass =
  "rounded-full bg-accent px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-accent-light transition-colors";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isLoaded, userId } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href={SITE_URL}
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground hover:opacity-90"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/favicon.png" alt="" width={28} height={28} className="rounded-md" />
          Studently
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/about" className="text-sm text-muted hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/privacy" className="text-sm text-muted hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="text-sm text-muted hover:text-foreground transition-colors">
            Terms
          </Link>
          <div className="flex items-center gap-3">
            {isLoaded && userId ? <UserButton /> : null}
            <Link href="/dashboard" className={dashboardButtonClass}>
              Dashboard
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          {isLoaded && userId ? <UserButton /> : null}
          <Link href="/dashboard" className={dashboardButtonClass}>
            Dashboard
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col gap-1.5"
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-6 bg-foreground transition-transform ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-6 bg-foreground transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-foreground transition-transform ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border px-6 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link href="/about" onClick={() => setMobileOpen(false)} className="text-sm text-muted hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/privacy" onClick={() => setMobileOpen(false)} className="text-sm text-muted hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" onClick={() => setMobileOpen(false)} className="text-sm text-muted hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
