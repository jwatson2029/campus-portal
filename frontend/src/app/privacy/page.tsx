import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Studently's privacy policy — learn how we handle your data and protect your privacy.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-4 text-muted">Last updated: April 2026</p>
      </div>

      <div className="animate-fade-in-delay mt-12 space-y-10">
        <section>
          <h2 className="text-xl font-semibold">Overview</h2>
          <p className="mt-3 leading-relaxed text-muted">
            Studently (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we handle information when you use the Studently Chrome extension and website. We believe in transparency and keeping things simple.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Data Collection</h2>
          <p className="mt-3 leading-relaxed text-muted">
            Studently does not collect, store, or transmit any personal data. We do not gather your grades, assignments, login credentials, or any information from your Infinite Campus portal. The extension operates entirely within your browser.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">No Data Selling</h2>
          <p className="mt-3 leading-relaxed text-muted">
            We do not sell, trade, or share any user data with third parties. Since we don&apos;t collect data in the first place, there is nothing to sell.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Chrome Extension Permissions</h2>
          <p className="mt-3 leading-relaxed text-muted">
            The Studently Chrome extension only requests the minimum permissions required to function. These permissions are used solely to enhance the Infinite Campus interface within your browser. We do not use any permissions to access data beyond what is necessary for the extension&apos;s core functionality.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Local Data</h2>
          <p className="mt-3 leading-relaxed text-muted">
            Any data used by Studently stays local to your browser. We do not send any information to external servers. Your academic data remains on your device and within your Infinite Campus session.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Cookies &amp; Analytics</h2>
          <p className="mt-3 leading-relaxed text-muted">
            The Studently website may use basic analytics (such as page views) to understand how visitors interact with our site. The Chrome extension itself does not use cookies or any tracking mechanisms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Changes to This Policy</h2>
          <p className="mt-3 leading-relaxed text-muted">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Contact Us</h2>
          <p className="mt-3 leading-relaxed text-muted">
            If you have any questions or concerns about this Privacy Policy, please contact us at{" "}
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
