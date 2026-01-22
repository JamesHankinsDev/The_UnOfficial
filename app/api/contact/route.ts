import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Set your email here
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "Hankins.JamesB@gmail.com";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "noreply@unofficial.com";
const RESEND_API_KEY = process.env.RESEND_JOIN_US_API_KEY;

export async function POST(req: NextRequest) {
  if (!RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Missing Resend API key" },
      { status: 500 },
    );
  }
  const resend = new Resend(RESEND_API_KEY);
  const { name, email, pitch } = await req.json();
  if (!name || !email || !pitch) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }
  if (!TO_EMAIL || !TO_EMAIL.includes("@")) {
    return NextResponse.json(
      {
        error:
          "Missing or invalid CONTACT_TO_EMAIL. Please set a valid email in your environment.",
      },
      { status: 500 },
    );
  }
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `New UnOfficial Contributor Inquiry from ${name}`,
      html: `<h2>New Contributor Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Pitch:</strong><br/>${pitch.replace(/\n/g, "<br/>")}</p>`,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 },
    );
  }
}
