import Image from "next/image";
import CTAButton from "@/components/CTAButton";
import FeatureCard from "@/components/FeatureCard";
import type { Metadata } from "next";

const CHROME_STORE_URL =
  "https://chromewebstore.google.com/detail/Studently/mbojfndockcpgcdlbpmcheiimdhndbho";

export const metadata: Metadata = {
  title: "Studently – Better Infinite Campus Dashboard | Free Educational Tool",
  description:
    "Studently is a free educational Chrome extension that gives students a better way to view grades on Infinite Campus. Clean UI, fast loading, GPA tracking, assignment monitoring, and more. Built for educational purposes to help students succeed.",
  keywords: [
    "Infinite Campus alternative UI",
    "student grade tracker",
    "better way to view grades",
    "Infinite Campus Chrome extension",
    "Studently",
    "educational tool",
    "free grade tracker",
    "student dashboard",
    "GPA calculator",
    "academic progress",
    "school grades app",
    "high school grades",
    "student productivity tool",
  ],
  alternates: {
    canonical: "https://studently.app",
  },
  other: {
    "educational-purpose":
      "This page describes an educational Chrome extension that helps students track academic grades and progress on Infinite Campus.",
  },
};

const features = [
  {
    icon: "📊",
    title: "Clean Grade Overview",
    description:
      "See all your grades at a glance in a beautifully designed dashboard. No more navigating through clunky menus.",
  },
  {
    icon: "📝",
    title: "Assignment Tracking",
    description:
      "Keep track of upcoming and past assignments with a streamlined interface that puts important info first.",
  },
  {
    icon: "🎯",
    title: "GPA Visibility",
    description:
      "Instantly see your GPA and understand how each class contributes to your overall academic performance.",
  },
  {
    icon: "⚡",
    title: "Faster Than Infinite Campus",
    description:
      "Built for speed. Studently loads faster and feels snappier than the default Infinite Campus interface.",
  },
];

const steps = [
  {
    number: "01",
    title: "Install Studently",
    description: "Add the free Chrome extension from the Chrome Web Store in one click.",
  },
  {
    number: "02",
    title: "Log Into Infinite Campus",
    description: "Sign in to your school's Infinite Campus portal as you normally would.",
  },
  {
    number: "03",
    title: "Enjoy the New Dashboard",
    description: "Studently automatically enhances your experience with a modern, clean interface.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent/5 blur-3xl" />

        <div className="mx-auto max-w-4xl px-6 pb-24 pt-24 text-center sm:pt-32 lg:pt-40">
          <div className="animate-fade-in">
            <span className="inline-block rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-medium text-accent">
              Free Chrome Extension
            </span>
          </div>

          <h1 className="animate-fade-in mt-8 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            A better way to use{" "}
            <span className="bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
              Infinite Campus
            </span>
          </h1>

          <p className="animate-fade-in-delay mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
            Studently helps students track grades, assignments, and progress in a clean, modern dashboard.
          </p>

          <div className="animate-fade-in-delay mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CTAButton href={CHROME_STORE_URL} external>
              <Image
                src="/chrome-logo.png"
                alt="Chrome"
                width={20}
                height={20}
                className="h-5 w-5"
              />
              Install Studently
            </CTAButton>
            <CTAButton href="#features" variant="secondary">
              Learn more
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to{" "}
              <span className="text-accent">stay on top of grades</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted">
              Studently transforms the Infinite Campus experience with features designed for how students actually work.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="border-t border-border bg-gradient-to-b from-accent/[0.02] to-transparent py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Get started in{" "}
              <span className="text-accent">3 easy steps</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              It takes less than a minute to upgrade your Infinite Campus experience.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
                  <span className="text-2xl font-bold text-accent">{step.number}</span>
                </div>
                <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mock UI Preview */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              A modern dashboard for{" "}
              <span className="text-accent">modern students</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              Clean, intuitive, and designed with students in mind.
            </p>
          </div>

          <div className="mt-16 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-accent/5 to-blue-400/5 p-1">
            <div className="rounded-xl bg-background p-6 sm:p-8">
              {/* Mock Dashboard */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h3 className="text-lg font-semibold">My Grades</h3>
                    <p className="text-sm text-muted">Fall 2026 • Quarter 1</p>
                  </div>
                  <div className="rounded-lg bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent">
                    GPA: 3.85
                  </div>
                </div>

                <div className="grid gap-3">
                  {[
                    { course: "AP Computer Science", grade: "A", pct: "96%" },
                    { course: "English 11", grade: "A-", pct: "92%" },
                    { course: "Pre-Calculus", grade: "B+", pct: "88%" },
                    { course: "US History", grade: "A", pct: "95%" },
                    { course: "Chemistry", grade: "B+", pct: "89%" },
                  ].map((row) => (
                    <div key={row.course} className="flex items-center justify-between rounded-xl border border-border px-4 py-3 transition-colors hover:bg-accent/[0.02]">
                      <span className="text-sm font-medium">{row.course}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted">{row.pct}</span>
                        <span className="rounded-md bg-accent/10 px-2.5 py-1 text-sm font-semibold text-accent">
                          {row.grade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border bg-gradient-to-b from-accent/[0.03] to-transparent py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to upgrade your Infinite Campus?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Join students who are already using Studently to get a cleaner, faster, and more modern gradebook experience.
          </p>
          <div className="mt-10">
            <CTAButton href={CHROME_STORE_URL} external>
              Install Studently — It&apos;s Free
            </CTAButton>
          </div>
        </div>
      </section>
    </>
  );
}
