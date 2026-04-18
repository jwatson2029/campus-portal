import CTAButton from "@/components/CTAButton";
import type { Metadata } from "next";

const CHROME_STORE_URL =
  "https://chromewebstore.google.com/detail/Studently/mbojfndockcpgcdlbpmcheiimdhndbho";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Studently — the Chrome extension that gives students a better Infinite Campus experience with a clean, modern dashboard.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <div className="animate-fade-in">
        <span className="inline-block rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-medium text-accent">
          About Studently
        </span>

        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          Built for students, by students
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-muted">
          Studently is a free Chrome extension that transforms your Infinite Campus experience. We believe students deserve a modern, intuitive interface for tracking their academic progress — not the outdated, clunky one they&apos;re stuck with.
        </p>
      </div>

      <div className="animate-fade-in-delay mt-16 space-y-12">
        <section>
          <h2 className="text-2xl font-bold">What is Studently?</h2>
          <p className="mt-4 leading-relaxed text-muted">
            Studently is a Chrome extension that enhances the Infinite Campus student portal. Once installed, it automatically provides a cleaner layout, easier grade tracking, GPA visibility, and a faster overall experience — all without changing any of your data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">Why we built it</h2>
          <p className="mt-4 leading-relaxed text-muted">
            Let&apos;s be honest: Infinite Campus hasn&apos;t kept up with the times. Navigating through nested menus just to check a grade shouldn&apos;t feel like a chore. We built Studently because we wanted a better way to stay on top of our grades — and we figured other students did too.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">Who it&apos;s for</h2>
          <p className="mt-4 leading-relaxed text-muted">
            Studently is designed for students who use Infinite Campus and want a faster, cleaner way to access their grades and assignments. Whether you&apos;re checking in between classes or planning your study schedule, Studently makes it easier.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">Our values</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { title: "Privacy first", desc: "We don't collect or sell your data. Your information stays yours." },
              { title: "Always free", desc: "Studently is and will remain free for all students." },
              { title: "Open feedback", desc: "We listen to student feedback and improve Studently based on real needs." },
              { title: "Simple by design", desc: "No bloat, no unnecessary features — just a better Infinite Campus." },
            ].map((v) => (
              <div key={v.title} className="rounded-xl border border-border p-5">
                <h3 className="font-semibold">{v.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-16 rounded-2xl border border-border bg-gradient-to-r from-accent/5 to-purple-500/5 p-8 text-center">
        <h2 className="text-2xl font-bold">Try Studently today</h2>
        <p className="mt-2 text-muted">
          It takes less than a minute to install. See the difference for yourself.
        </p>
        <div className="mt-6">
          <CTAButton href={CHROME_STORE_URL} external>
            Install Studently
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
