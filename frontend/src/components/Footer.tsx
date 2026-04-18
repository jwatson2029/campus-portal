import Link from "next/link";

const CHROME_STORE_URL =
  "https://chromewebstore.google.com/detail/Studently/mbojfndockcpgcdlbpmcheiimdhndbho";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">Studently</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              A better way to use Infinite Campus. Track grades, assignments, and progress with a modern dashboard.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Product</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <a href={CHROME_STORE_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-foreground transition-colors">
                  Chrome Extension
                </a>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Legal</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Contact</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="mailto:support@studently.app" className="text-sm text-muted hover:text-foreground transition-colors">
                  support@studently.app
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Studently. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
