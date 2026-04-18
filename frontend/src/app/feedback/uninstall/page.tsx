import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uninstall Feedback",
  description:
    "Help us improve Studently by sharing why you uninstalled the educational Chrome extension. Your feedback helps us build a better tool for students.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UninstallFeedbackPage() {
  return (
    <div className="relative min-h-[80vh]">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/5 via-blue-400/5 to-transparent" />

      <div className="mx-auto max-w-2xl px-6 py-24">
        <div className="animate-fade-in rounded-2xl border border-border bg-background/80 p-8 shadow-xl shadow-accent/5 backdrop-blur-sm sm:p-12">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <span className="text-3xl">👋</span>
            </div>

            <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
              We&apos;re sorry to see you go
            </h1>

            <p className="mt-4 text-muted leading-relaxed">
              Thanks for giving Studently a try. We&apos;d love to hear your feedback so we can make it better for everyone.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-xl border border-border">
            <iframe
              src="https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true"
              width="100%"
              height="600"
              className="border-0"
              title="Uninstall Feedback Form"
            >
              Loading form…
            </iframe>
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            Your feedback is anonymous and helps us improve Studently for all students.
          </p>
        </div>
      </div>
    </div>
  );
}
