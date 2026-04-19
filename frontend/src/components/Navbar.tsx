"use client";

import Link from "next/link";
import { useState } from "react";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";

const CHROME_STORE_URL =
  "https://chromewebstore.google.com/detail/Studently/cmjhihkdjmadgndaidfmbpbaaghljbpd";

const SITE_URL = "https://studently.website";

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
          <Link href="/dashboard" className="text-sm text-muted hover:text-foreground transition-colors">
            Dashboard
          </Link>
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
            {!isLoaded ? (
              <span className="h-8 w-20 rounded-full bg-border/60 animate-pulse" aria-hidden />
            ) : userId ? (
              <UserButton />
            ) : (
              <>
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="text-sm font-medium text-muted hover:text-foreground transition-colors"
                  >
                    Log in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    type="button"
                    className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent/[0.06] transition-colors"
                  >
                    Sign up
                  </button>
                </SignUpButton>
              </>
            )}
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-accent-light transition-colors"
            >
              Install Extension
            </a>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-6 bg-foreground transition-transform ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-6 bg-foreground transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-foreground transition-transform ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border px-6 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm text-muted hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/about" onClick={() => setMobileOpen(false)} className="text-sm text-muted hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/privacy" onClick={() => setMobileOpen(false)} className="text-sm text-muted hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" onClick={() => setMobileOpen(false)} className="text-sm text-muted hover:text-foreground transition-colors">
              Terms
            </Link>
            {!isLoaded ? null : userId ? (
              <div className="flex items-center gap-2 pt-2">
                <span className="text-sm text-muted">Account</span>
                <UserButton />
              </div>
            ) : (
              <div className="mt-2 flex flex-col gap-2">
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="w-full rounded-lg border border-border py-2 text-center text-sm font-medium text-foreground"
                  >
                    Log in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    type="button"
                    className="w-full rounded-lg bg-accent py-2 text-center text-sm font-medium text-white"
                  >
                    Sign up
                  </button>
                </SignUpButton>
              </div>
            )}
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block rounded-full bg-accent px-5 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-accent-light transition-colors"
            >
              Install Extension
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
