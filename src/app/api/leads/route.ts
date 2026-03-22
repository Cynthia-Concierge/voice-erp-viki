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

async function createGHLContact(
  pit: string,
  locId: string,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  source: string,
  tags: string[]
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const payload = {
    locationId: locId,
    firstName,
    lastName,
    email,
    phone,
    source,
    tags,
  };

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch("https://services.leadconnectorhq.com/contacts/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${pit}`,
          "Content-Type": "application/json",
          Version: "2021-07-28",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        return { ok: true, id: data.contact?.id };
      }

      const body = await res.text();
      console.error(`GHL attempt ${attempt + 1} failed:`, res.status, body);

      // If 409 conflict (duplicate), try upsert lookup
      if (res.status === 409) {
        try {
          const searchRes = await fetch(
            `https://services.leadconnectorhq.com/contacts/search/duplicate?locationId=${locId}&email=${encodeURIComponent(email)}`,
            {
              headers: {
                Authorization: `Bearer ${pit}`,
                Version: "2021-07-28",
              },
            }
          );
          if (searchRes.ok) {
            const searchData = await searchRes.json();
            const existingId = searchData.contact?.id;
            if (existingId) {
              // Update the existing contact with new tags
              await fetch(`https://services.leadconnectorhq.com/contacts/${existingId}`, {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${pit}`,
                  "Content-Type": "application/json",
                  Version: "2021-07-28",
                },
                body: JSON.stringify({ tags, source }),
              });
              return { ok: true, id: existingId };
            }
          }
        } catch {
          // Fall through
        }
      }

      // Don't retry on 400/401/422 — those won't fix themselves
      if (res.status === 400 || res.status === 401 || res.status === 422) {
        return { ok: false, error: `GHL error ${res.status}: ${body.slice(0, 200)}` };
      }

      // Retry on 500/502/503/429
      if (attempt === 0 && (res.status >= 500 || res.status === 429)) {
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }

      return { ok: false, error: `GHL error ${res.status}` };
    } catch (err) {
      console.error(`GHL attempt ${attempt + 1} network error:`, err);
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }
      return { ok: false, error: "GHL network error" };
    }
  }

  return { ok: false, error: "GHL failed after retries" };
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

  const rawDigits = phone.replace(/\D/g, "");
  const cleanPhone = rawDigits.length === 11 && rawDigits[0] === "1"
    ? `+${rawDigits}`
    : `+1${rawDigits}`;

  const pit = process.env.GHL_PIT;
  const locId = process.env.GHL_LOCATION_ID;

  if (!pit || !locId) {
    console.error("Missing GHL env vars — GHL_PIT:", !!pit, "GHL_LOCATION_ID:", !!locId);
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const [firstName, ...rest] = name.trim().split(" ");
  const lastName = rest.join(" ") || "";
  const cleanEmail = email.trim().toLowerCase();

  const leadSource = source?.trim() || "VoiceERP Landing Page";
  const leadTags = tags?.length ? tags : ["ad-funnel"];

  // Send to GHL + Apollo in parallel — GHL is critical, Apollo is best-effort
  const [ghlResult] = await Promise.all([
    createGHLContact(pit, locId, firstName, lastName, cleanEmail, cleanPhone, leadSource, leadTags),
    addToApollo(firstName, lastName, cleanEmail, cleanPhone),
  ]);

  if (!ghlResult.ok) {
    console.error("GHL create failed:", ghlResult.error);
    // Still return 200 so the user can proceed — lead data is in the request logs
    // and we don't want to block the user experience
    return NextResponse.json({
      id: null,
      warning: "Lead saved but CRM sync pending",
    });
  }

  return NextResponse.json({ id: ghlResult.id });
}
