import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    const sql = getDb();
    await sql`
      INSERT INTO subscribers (email, active)
      VALUES (${email.toLowerCase()}, true)
      ON CONFLICT (email) DO UPDATE SET active = true
    `;

    return NextResponse.json({
      message: "Subscribed! You'll get alerts before Tuesday price changes.",
    });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { email } = await request.json();

    const sql = getDb();
    await sql`
      UPDATE subscribers SET active = false
      WHERE email = ${email.toLowerCase()}
    `;

    return NextResponse.json({ message: "Unsubscribed." });
  } catch {
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}
