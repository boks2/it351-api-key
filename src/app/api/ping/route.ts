import type { NextRequest } from "next/server";
import verifyKey from "~/server/key";

// ✅ 1. Handle Preflight (CORS) Request ng Browser
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3001", // Or "*" kung gusto mong kahit saan
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-api-key",
    },
  });
}

// ✅ 2. Handle GET Request
export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? "";
  const result = await verifyKey(apiKey);

  const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:3001",
  };

  if (!result.valid) {
    return Response.json(
      { error: result.reason }, 
      { status: 401, headers: corsHeaders }
    );
  }

  return Response.json(
    { ok: true, message: "Hello Get", keyId: result.keyId },
    { status: 200, headers: corsHeaders }
  );
}