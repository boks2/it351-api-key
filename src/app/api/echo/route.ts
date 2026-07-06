import { NextRequest, NextResponse } from "next/server";
import verifyKey from "~/server/key";

const getCorsHeaders = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin || "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-api-key",
});

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { 
    status: 200, 
    headers: getCorsHeaders(req.headers.get("origin")) 
  });
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key") ?? "";
    const result = await verifyKey(apiKey);
    const headers = getCorsHeaders(req.headers.get("origin"));

    if (!result.valid) {
      return NextResponse.json({ error: result.reason }, { status: 401, headers });
    }

    const body = await req.json();

    return NextResponse.json(
      { ok: true, received: body, keyId: result.keyId },
      { status: 200, headers }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400, headers: getCorsHeaders(req.headers.get("origin")) }
    );
  }
}