import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3001";

    const forecastRes = await fetch(`${baseUrl}/api/forecast`);
    if (!forecastRes.ok) throw new Error("Failed to fetch forecast");
    const { forecast, market } = await forecastRes.json();

    // Get active subscribers from Supabase
    const { data: subscribers, error } = await getSupabase()
      .from("subscribers")
      .select("email")
      .eq("active", true);

    if (error) throw error;
    if (!subscribers?.length) {
      return NextResponse.json({ message: "No subscribers", sent: 0 });
    }

    const arrow = forecast.direction === "up" ? "↑" : forecast.direction === "down" ? "↓" : "→";
    const action =
      forecast.direction === "up"
        ? "Consider filling up this weekend before prices rise!"
        : forecast.direction === "down"
          ? "You may want to wait — prices are expected to drop."
          : "Prices are expected to stay about the same.";

    const subject = `${arrow} OhmyGas: Fuel prices expected to go ${forecast.direction} ₱${forecast.estimatedChange.toFixed(2)}/L`;
    const crudeInfo = market?.crude ? `Crude Oil: $${market.crude.price.toFixed(2)}/barrel` : "";
    const forexInfo = market?.forex ? `USD/PHP: ₱${market.forex.rate.toFixed(2)}` : "";

    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto">
        <div style="background:#1B7A3D;padding:16px 20px;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0;font-size:20px">OhmyGas</h1>
          <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:12px">Para sa drayber, hindi lang sa Metro.</p>
        </div>
        <div style="background:${forecast.direction === "up" ? "#fdecea" : forecast.direction === "down" ? "#e8f5ec" : "#fef9e7"};padding:20px;border:1px solid #e5e7eb;border-top:none">
          <p style="font-size:32px;margin:0">${arrow}</p>
          <h2 style="margin:8px 0 4px;font-size:18px;color:#2D2D2D">Prices expected to go ${forecast.direction}</h2>
          <p style="font-size:24px;font-weight:bold;margin:0;color:#2D2D2D">${forecast.direction === "steady" ? "" : forecast.direction === "up" ? "+" : "-"}₱${forecast.estimatedChange.toFixed(2)}/L</p>
          <p style="color:#6b7280;font-size:14px;margin:12px 0 0">Effective: ${new Date(forecast.effectiveDate).toLocaleDateString("en-PH", { weekday: "long", month: "short", day: "numeric" })}</p>
        </div>
        <div style="padding:16px 20px;background:white;border:1px solid #e5e7eb;border-top:none">
          <p style="font-size:14px;color:#374151;margin:0 0 12px"><strong>${action}</strong></p>
          ${crudeInfo || forexInfo ? `<p style="font-size:12px;color:#9ca3af;margin:0">${[crudeInfo, forexInfo].filter(Boolean).join(" · ")}</p>` : ""}
        </div>
        <div style="padding:12px 20px;background:#f9fafb;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <p style="font-size:11px;color:#9ca3af;margin:0;text-align:center"><a href="https://ohmygas.vercel.app" style="color:#1B7A3D">View all prices</a></p>
        </div>
      </div>`;

    let sent = 0;
    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey) {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);

      for (let i = 0; i < subscribers.length; i += 10) {
        const batch = subscribers.slice(i, i + 10);
        const results = await Promise.allSettled(
          batch.map((s) =>
            resend.emails.send({
              from: "OhmyGas <alerts@ohmygas.vercel.app>",
              to: s.email,
              subject,
              html,
            })
          )
        );
        sent += results.filter((r) => r.status === "fulfilled").length;
      }
    }

    return NextResponse.json({ sent, total: subscribers.length });
  } catch (error) {
    console.error("Alert error:", error);
    return NextResponse.json(
      { error: "Failed to send alerts" },
      { status: 500 }
    );
  }
}
