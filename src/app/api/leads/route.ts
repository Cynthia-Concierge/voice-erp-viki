import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isValidUSPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  // Accept +1XXXXXXXXXX or XXXXXXXXXX
  const d = digits.length === 11 && digits[0] === "1" ? digits.slice(1) : digits;
  if (d.length !== 10) return false;
  // Area code and exchange can't start with 0 or 1
  if (d[0] === "0" || d[0] === "1") return false;
  if (d[3] === "0" || d[3] === "1") return false;
  // All same digit
  if (/^(\d)\1{9}$/.test(d)) return false;
  // 555-01XX test range
  if (d.slice(3, 7) === "5501") return false;
  return true;
}

export async function POST(req: NextRequest) {
  const { name, email, phone } = await req.json();

  if (!name?.trim() || !email?.trim() || !phone?.trim()) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  if (!isValidUSPhone(phone)) {
    return NextResponse.json({ error: "Invalid US phone number" }, { status: 400 });
  }

  // Normalize to +1XXXXXXXXXX
  const rawDigits = phone.replace(/\D/g, "");
  const cleanPhone = rawDigits.length === 11 && rawDigits[0] === "1"
    ? `+${rawDigits}`
    : `+1${rawDigits}`;

  const pit = process.env.GHL_PIT;
  const locId = process.env.GHL_LOCATION_ID;

  if (!pit || !locId) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const [firstName, ...rest] = name.trim().split(" ");
  const lastName = rest.join(" ") || "";

  const res = await fetch("https://services.leadconnectorhq.com/contacts/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${pit}`,
      "Content-Type": "application/json",
      Version: "2021-07-28",
    },
    body: JSON.stringify({
      locationId: locId,
      firstName,
      lastName,
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      source: "VoiceERP Landing Page",
      tags: ["ad-funnel"],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("GHL create contact failed:", res.status, body);
    return NextResponse.json({ error: "Failed to create contact" }, { status: 502 });
  }

  const data = await res.json();
  return NextResponse.json({ id: data.contact?.id });
}
