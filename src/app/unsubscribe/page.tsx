"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleUnsubscribe() {
    if (!email) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("done");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-xl bg-white p-6 text-center shadow-sm">
      {status === "done" ? (
        <>
          <p className="text-lg font-bold text-brand-charcoal">Unsubscribed</p>
          <p className="mt-2 text-sm text-gray-500">
            You won&apos;t receive any more price alerts.
          </p>
          <a
            href="/"
            className="mt-4 inline-block text-sm font-medium text-brand-green hover:underline"
          >
            Back to OhmyGas
          </a>
        </>
      ) : (
        <>
          <p className="text-lg font-bold text-brand-charcoal">Unsubscribe from Alerts</p>
          {email ? (
            <>
              <p className="mt-2 text-sm text-gray-500">
                Remove <strong>{email}</strong> from weekly price alerts?
              </p>
              <button
                onClick={handleUnsubscribe}
                disabled={status === "loading"}
                className="mt-4 rounded-lg bg-brand-red px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {status === "loading" ? "Unsubscribing..." : "Yes, Unsubscribe"}
              </button>
            </>
          ) : (
            <p className="mt-2 text-sm text-gray-500">
              No email provided. Check the link in your alert email.
            </p>
          )}
          {status === "error" && (
            <p className="mt-3 text-sm text-brand-red">
              Something went wrong. Please try again.
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-12">
        <Suspense
          fallback={
            <div className="rounded-xl bg-white p-6 text-center shadow-sm text-gray-400">
              Loading...
            </div>
          }
        >
          <UnsubscribeContent />
        </Suspense>
      </main>
    </div>
  );
}
