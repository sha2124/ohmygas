import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { FUEL_TYPES } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brand, station, region, province, city, fuelType, price, reportedBy } = body;

    // Validate required fields
    if (!brand || !region || !province || !fuelType || !price) {
      return NextResponse.json(
        { error: "Missing required fields: brand, region, province, fuelType, price" },
        { status: 400 }
      );
    }

    // Validate fuel type
    if (!FUEL_TYPES.includes(fuelType)) {
      return NextResponse.json(
        { error: `Invalid fuel type. Must be one of: ${FUEL_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate price range (reasonable PH fuel prices: ₱30–₱200/L)
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 30 || numPrice > 200) {
      return NextResponse.json(
        { error: "Price must be between ₱30 and ₱200 per liter" },
        { status: 400 }
      );
    }

    // Simple rate limiting via IP hash
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    const ipHash = await hashIP(ip);

    // Check if this IP already submitted for this brand/location/fuel in the last hour
    const supabase = getSupabase();
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { data: existing } = await supabase
      .from("crowd_prices")
      .select("id")
      .eq("ip_hash", ipHash)
      .eq("brand", brand)
      .eq("fuel_type", fuelType)
      .eq("region", region)
      .eq("province", province)
      .gte("created_at", oneHourAgo)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "You already submitted a price for this station recently. Try again later." },
        { status: 429 }
      );
    }

    // Insert the submission
    const { error } = await supabase.from("crowd_prices").insert({
      brand,
      station: station || null,
      region,
      province,
      city: city || null,
      fuel_type: fuelType,
      price: numPrice,
      reported_by: reportedBy?.slice(0, 30) || null,
      ip_hash: ipHash,
    });

    if (error) throw error;

    return NextResponse.json({
      message: "Salamat! Your price report has been submitted.",
    });
  } catch (error) {
    console.error("Submit price error:", error);
    return NextResponse.json(
      { error: "Failed to submit price" },
      { status: 500 }
    );
  }
}

// Upvote a community price
export async function PATCH(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing price ID" }, { status: 400 });
    }

    const supabase = getSupabase();
    const { error } = await supabase.rpc("increment_votes", { price_id: id });

    if (error) {
      // Fallback: manual increment if RPC not set up
      const { data } = await supabase
        .from("crowd_prices")
        .select("votes")
        .eq("id", id)
        .single();

      if (data) {
        await supabase
          .from("crowd_prices")
          .update({ votes: (data.votes || 1) + 1 })
          .eq("id", id);
      }
    }

    return NextResponse.json({ message: "Vote recorded" });
  } catch {
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}

async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + "ohmygas-salt-2026");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
