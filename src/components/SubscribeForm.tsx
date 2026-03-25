"use client";

import { useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error);
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  }

  return (
    <div className="rounded-xl bg-brand-green p-4 text-white">
      <h3 className="text-sm font-bold">Get Price Alerts</h3>
      <p className="mt-1 text-xs text-white/70">
        We&apos;ll email you every Friday before Tuesday price changes.
      </p>

      {status === "success" ? (
        <p className="mt-3 text-sm font-medium text-white/90">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 rounded-lg px-3 py-2 text-sm text-brand-charcoal placeholder-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg bg-brand-yellow px-4 py-2 text-sm font-bold text-brand-charcoal transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === "loading" ? "..." : "Alert Me"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-2 text-xs text-red-200">{message}</p>
      )}
    </div>
  );
}
