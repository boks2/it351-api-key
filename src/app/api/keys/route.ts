import type { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { insertKey, listKeys, revokeKey } from "~/server/key";
import { CreateKeySchema, DeleteKeySchema } from "~/server/validation";

type KeyRow = {
  id: string;
  name: string;
  last4: string;
  createdAt: string;
  revoked: boolean;
};

// ✅ POST: Paggawa ng bagong API Key
export async function POST(req: NextRequest) {
  try {
    // 1. I-verify muna kung may active session ang user gamit ang Clerk
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });
    }

    const body = (await req.json()) as { name: string };
    const { name } = CreateKeySchema.parse(body);

    // 2. Patakbuhin ang iyong core server script module function
    const created = await insertKey(name);
    
    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Invalid request";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

// ✅ GET: Pag-load ng lahat ng API Keys sa Table Layout
export async function GET() {
  try {
    // 1. Security Check gamit ang Clerk Auth
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized", items: [] }, { status: 401 });
    }

    // 2. Kunin ang raw array mula sa backend module mo
    const result = await listKeys();
    
    // Map safely to KeyRow[] array profile blocks
    const rows: KeyRow[] = Array.isArray(result)
      ? result.map((r) => ({
          id: String(r.id),
          name: String(r.name),
          last4: String(r.last4),
          createdAt: String(r.createdAt),
          revoked: Boolean(r.revoked),
        }))
      : [];

    const items = rows.map((row) => ({
      id: row.id,
      name: row.name,
      masked: `sk_live_...${row.last4}`,
      createdAt: row.createdAt,
      revoked: row.revoked,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Failed to fetch keys layout:", error);
    return NextResponse.json({ items: [] });
  }
}

// ✅ DELETE: Pag-revoke o pag-bura ng token key
export async function DELETE(req: NextRequest) {
  try {
    // 1. Security validation check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const keyId = new URL(req.url).searchParams.get("keyId") ?? "";
    const { keyId: parsedId } = DeleteKeySchema.parse({ keyId });
    
    const ok = await revokeKey(parsedId);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Invalid request";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}