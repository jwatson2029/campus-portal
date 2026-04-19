import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Studently web dashboard — coming soon.",
};

export default async function DashboardPage() {
  const user = await currentUser();
  const name =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.username ?? user?.primaryEmailAddress?.emailAddress ?? "there";

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="text-sm font-medium text-accent">Signed in as {name}</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        Web dashboard{" "}
        <span className="bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
          coming soon
        </span>
      </h1>
      <p className="mx-auto mt-6 max-w-lg text-muted leading-relaxed">
        You&apos;re all set with your account. We&apos;re building the Studently web experience here —
        for now, keep using the{" "}
        <Link href="/" className="font-medium text-accent underline-offset-4 hover:underline">
          Chrome extension
        </Link>{" "}
        with Infinite Campus.
      </p>
      <div className="mt-10 rounded-2xl border border-border bg-accent/[0.03] px-6 py-8">
        <p className="text-sm text-muted">
          We&apos;ll use this space for grades, assignments, and sync when the dashboard launches.
        </p>
      </div>
    </div>
  );
}
