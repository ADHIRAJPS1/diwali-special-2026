import { NextRequest, NextResponse } from "next/server";
import { databaseReady, dbRequest } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  if (!databaseReady()) return NextResponse.json({ error: "The message form is temporarily unavailable." }, { status: 503 });
  try {
    const data = await request.json();
    const message = typeof data.message === "string" ? data.message.trim() : "";
    const consent = data.consent === true;
    if (!message || message.length > 500) return NextResponse.json({ error: "Add a message of up to 500 characters." }, { status: 400 });
    if (!consent) return NextResponse.json({ error: "Please agree to the privacy notice before submitting." }, { status: 400 });
    const participant = {
      name: typeof data.name === "string" ? data.name.trim().slice(0, 100) || null : null,
      phone: typeof data.phone === "string" ? data.phone.trim().slice(0, 30) || null : null,
      email: typeof data.email === "string" ? data.email.trim().slice(0, 254) || null : null,
      age: Number.isInteger(data.age) && data.age >= 18 && data.age <= 120 ? data.age : null,
      message,
      consent,
    };
    if (participant.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(participant.email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    if (participant.phone && !/^\+?[0-9 ()-]{7,30}$/.test(participant.phone)) return NextResponse.json({ error: "Enter a valid phone number." }, { status: 400 });
    if (data.age !== "" && data.age != null && participant.age == null) return NextResponse.json({ error: "Age must be between 18 and 120." }, { status: 400 });
    await dbRequest("participant_messages", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(participant) });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "We couldn't save your message. Please try again." }, { status: 503 });
  }
}
