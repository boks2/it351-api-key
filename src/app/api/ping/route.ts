import { NextRequest, NextResponse } from "next/server";
import verifyKey from "~/server/key";

// Helper para sa Dynamic CORS
const getCorsHeaders = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin || "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-api-key",
});

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { 
    status: 200, 
    headers: getCorsHeaders(req.headers.get("origin")) 
  });
}

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? "";
  const result = await verifyKey(apiKey);
  const headers = getCorsHeaders(req.headers.get("origin"));

  if (!result.valid) {
    return NextResponse.json({ error: result.reason }, { status: 401, headers });
  }

  return NextResponse.json(
    { ok: true, message: "Hello Ping", keyId: result.keyId },
    { status: 200, headers }
  );
}