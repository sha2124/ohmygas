import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    const { error } = await getSupabase()
      .from("subscribers")
      .upsert(
        { email: email.toLowerCase(), active: true },
        { onConflict: "email" }
      );

    if (error) throw error;

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

    const { error } = await getSupabase()
      .from("subscribers")
      .update({ active: false })
      .eq("email", email.toLowerCase());

    if (error) throw error;

    return NextResponse.json({ message: "Unsubscribed." });
  } catch {
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}
