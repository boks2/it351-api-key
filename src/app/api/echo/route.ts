import type { NextRequest } from "next/server";
import verifyKey from "~/server/key";

// Naka-set sa "*" para tanggapin ang request kahit saan galing kapag naka-deploy na sa Vercel
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-api-key",
};

// 1. OPTIONS Handler: Sumasalo sa CORS Preflight request ng browser para iwas 404
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// 2. POST Handler: Sumasalo sa totoong request mula sa Tester App
export async function POST(req: NextRequest) {
  try {
    // Kuhanin ang API key mula sa headers
    const apiKey = req.headers.get("x-api-key") ?? "";
    
    // I-verify ang key gamit ang iyong internal server function
    const result = await verifyKey(apiKey);

    // Kung hindi valid ang key, magbalik agad ng 401 Unauthorized
    if (!result.valid) {
      return Response.json(
        { error: result.reason },
        { status: 401, headers: corsHeaders }
      );
    }

    // Basahin ang kahit anong JSON body na ipinasa sa textbox ng tester
    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return Response.json(
        { error: "Invalid JSON format payload." },
        { status: 400, headers: corsHeaders }
      );
    }

    // Ibalik ang eksaktong response structure na inaasahan ng sir-dave interface
    return Response.json(
      {
        ok: true,
        received: body,
        keyId: result.keyId,
      },
      { 
        status: 200, 
        headers: corsHeaders 
      }
    );

  } catch (error) {
    console.error("Echo route internal error:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}