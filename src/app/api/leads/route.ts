import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isValidUSPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  const d = digits.length === 11 && digits[0] === "1" ? digits.slice(1) : digits;
  if (d.length !== 10) return false;
  if (d[0] === "0" || d[0] === "1") return false;
  if (d[3] === "0" || d[3] === "1") return false;
  if (/^(\d)\1{9}$/.test(d)) return false;
  if (d.slice(3, 7) === "5501") return false;
  return true;
}

const APOLLO_SEQUENCE_ID = "69bc97f18b87ad000d1fe320";

async function addToApollo(firstName: string, lastName: string, emailAddr: string, phone: string) {
  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) return;

  try {
    // 1. Create or find the contact in Apollo
    const createRes = await fetch("https://api.apollo.io/v1/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Api-Key": apiKey },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: emailAddr,
        phone_numbers: [{ raw_number: phone, type: "mobile" }],
        label_names: ["Ad Funnel"],
      }),
    });

    if (!createRes.ok) {
      console.error("Apollo create contact failed:", createRes.status, await createRes.text());
      return;
    }

    const created = await createRes.json();
    const contactId = created.contact?.id;
    if (!contactId) return;

    // 2. Add the contact to the sequence
    const seqRes = await fetch(
      `https://api.apollo.io/v1/emailer_campaigns/${APOLLO_SEQUENCE_ID}/add_contact_ids`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Api-Key": apiKey },
        body: JSON.stringify({
          contact_ids: [contactId],
          emailer_campaign_id: APOLLO_SEQUENCE_ID,
          send_email_from_email_account_id: "6967edc67e7a770011beafe6",
        }),
      }
    );

    if (!seqRes.ok) {
      console.error("Apollo add to sequence failed:", seqRes.status, await seqRes.text());
    }
  } catch (err) {
    console.error("Apollo integration error:", err);
  }
}

export async function POST(req: NextRequest) {
  const { name, email, phone, source, tags } = await req.json();

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
  const cleanEmail = email.trim().toLowerCase();

  // Allow callers to specify source & tags for different funnels
  const leadSource = source?.trim() || "VoiceERP Landing Page";
  const leadTags = tags?.length ? tags : ["ad-funnel"];

  // Send to GHL + Apollo in parallel
  const [ghlRes] = await Promise.all([
    fetch("https://services.leadconnectorhq.com/contacts/", {
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
        email: cleanEmail,
        phone: cleanPhone,
        source: leadSource,
        tags: leadTags,
      }),
    }),
    addToApollo(firstName, lastName, cleanEmail, cleanPhone),
  ]);

  if (!ghlRes.ok) {
    const body = await ghlRes.text();
    console.error("GHL create contact failed:", ghlRes.status, body);
    return NextResponse.json({ error: "Failed to create contact" }, { status: 502 });
  }

  const data = await ghlRes.json();
  return NextResponse.json({ id: data.contact?.id });
}
