import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
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

    const sql = getDb();

    // Check if this IP already submitted for this brand/location/fuel in the last hour
    const existing = await sql`
      SELECT id FROM crowd_prices
      WHERE ip_hash = ${ipHash}
        AND brand = ${brand}
        AND fuel_type = ${fuelType}
        AND region = ${region}
        AND province = ${province}
        AND created_at > now() - interval '1 hour'
      LIMIT 1
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "You already submitted a price for this station recently. Try again later." },
        { status: 429 }
      );
    }

    // Insert the submission
    await sql`
      INSERT INTO crowd_prices (brand, station, region, province, city, fuel_type, price, reported_by, ip_hash)
      VALUES (${brand}, ${station || null}, ${region}, ${province}, ${city || null}, ${fuelType}, ${numPrice}, ${reportedBy?.slice(0, 30) || null}, ${ipHash})
    `;

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

    const sql = getDb();
    await sql`
      UPDATE crowd_prices SET votes = votes + 1
      WHERE id = ${id}
    `;

    return NextResponse.json({ message: "Vote recorded" });
  } catch {
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}

async function hashIP(ip: string): Promise<string> {
  const salt = process.env.IP_HASH_SALT || "ohmygas-default";
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
