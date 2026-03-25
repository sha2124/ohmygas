import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const SUBSCRIBERS_FILE = path.join(process.cwd(), "subscribers.json");

async function getSubscribers(): Promise<string[]> {
  try {
    const data = await readFile(SUBSCRIBERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveSubscribers(emails: string[]): Promise<void> {
  await writeFile(SUBSCRIBERS_FILE, JSON.stringify(emails, null, 2));
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    const subscribers = await getSubscribers();

    if (subscribers.includes(email.toLowerCase())) {
      return NextResponse.json({ message: "Already subscribed!" });
    }

    subscribers.push(email.toLowerCase());
    await saveSubscribers(subscribers);

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
    const subscribers = await getSubscribers();
    const filtered = subscribers.filter((e) => e !== email.toLowerCase());
    await saveSubscribers(filtered);
    return NextResponse.json({ message: "Unsubscribed." });
  } catch {
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}
