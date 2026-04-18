import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Studently's terms of service — understand the terms governing the use of our educational Chrome extension and website. Studently is intended for educational use by students.",
  alternates: {
    canonical: "https://studently.app/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-4 text-muted">Last updated: April 2026</p>
      </div>

      <div className="animate-fade-in-delay mt-12 space-y-10">
        <section>
          <h2 className="text-xl font-semibold">Acceptance of Terms</h2>
          <p className="mt-3 leading-relaxed text-muted">
            By installing or using the Studently Chrome extension or visiting the Studently website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Description of Service</h2>
          <p className="mt-3 leading-relaxed text-muted">
            Studently is a free Chrome extension that enhances the Infinite Campus student portal by providing a cleaner, more modern user interface. The extension is intended for educational and personal use by students.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Permitted Use</h2>
          <p className="mt-3 leading-relaxed text-muted">
            Studently is provided for educational use only. You may use the extension to view and interact with your own Infinite Campus data in an improved interface. You agree not to use the extension for any unlawful, harmful, or unauthorized purpose.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Restrictions</h2>
          <p className="mt-3 leading-relaxed text-muted">You agree not to:</p>
          <ul className="mt-3 list-inside list-disc space-y-2 text-muted">
            <li>Reverse engineer, decompile, or disassemble the extension</li>
            <li>Modify, adapt, or create derivative works based on the extension</li>
            <li>Use the extension to access data that does not belong to you</li>
            <li>Attempt to interfere with or disrupt the extension&apos;s functionality</li>
            <li>Use the extension for any commercial or non-educational purpose without permission</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Service Provided &ldquo;As-Is&rdquo;</h2>
          <p className="mt-3 leading-relaxed text-muted">
            Studently is provided &ldquo;as-is&rdquo; and &ldquo;as available&rdquo; without any warranties of any kind, express or implied. We do not guarantee that the extension will be error-free, uninterrupted, or compatible with all versions of Infinite Campus.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Updates &amp; Modifications</h2>
          <p className="mt-3 leading-relaxed text-muted">
            We reserve the right to update, modify, or discontinue the Studently extension or website at any time without prior notice. Updates may be automatically applied through the Chrome Web Store.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Limitation of Liability</h2>
          <p className="mt-3 leading-relaxed text-muted">
            To the fullest extent permitted by law, Studently and its creators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of data, use, or profits, arising from your use of the extension or website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Changes to These Terms</h2>
          <p className="mt-3 leading-relaxed text-muted">
            We may update these Terms of Service from time to time. Continued use of Studently after any changes constitutes acceptance of the updated terms. We encourage you to review these terms periodically.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Contact Us</h2>
          <p className="mt-3 leading-relaxed text-muted">
            If you have any questions about these Terms of Service, please contact us at{" "}
            <a href="mailto:support@studently.app" className="text-accent hover:underline">
              support@studently.app
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
