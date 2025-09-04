"use client";

import { Separator } from "@radix-ui/react-separator";
import { KeyRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

export default function DocPage() {
  const [key, setKey] = useState("");
  const [out, setOut] = useState("");
  const [postBody, setPostBody] = useState("Hello World");

  async function runGet() {
    const res = await fetch(`${baseUrl}/api/ping`, {
      headers: { "x-api-key": key },
    });
    setOut(JSON.stringify(await res.json(), null, 2));
  }

  async function runPost() {
    const res = await fetch(`${baseUrl}/api/echo`, {
      method: "POST",
      headers: { "x-api-key": key, "content-type": "application/json" },
      body: JSON.stringify({ postBody }),
    });
    setOut(JSON.stringify(await res.json(), null, 2));
  }

  return (
    <div className="relative min-h-screen font-sans text-white">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: "url('/bg1.jpg')" }}
      />
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm -z-5" />

      <div className="mx-auto max-w-5xl px-6 py-12 relative z-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-cyan-400 drop-shadow-lg flex items-center gap-2">
            📘 API Guide
          </h1>

          <Link href="/keys">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black transition rounded-lg"
            >
              <KeyRound className="w-5 h-5" />
              Keys Dashboard
            </Button>
          </Link>
        </div>

        {/* Card 1: How Authentication Works */}
        <Card className="bg-black/50 border border-cyan-600 shadow-xl backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-cyan-300">How Authentication Works</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-cyan-200">
              All endpoints require an API key sent via the{" "}
              <code className="font-mono bg-black/50 px-1 py-0.5 rounded">x-api-key</code> header.
              Keep your keys secure. Revoked keys will no longer have access.
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Base URL */}
        <Card className="bg-black/50 border border-cyan-600 shadow-xl backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-cyan-300">Base URL</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-black/70 p-3 text-cyan-400 text-sm shadow-inner">
              <code>{baseUrl + "/api"}</code>
            </pre>
          </CardContent>
        </Card>

        {/* Card 3 & 4: GET and POST Endpoints side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 3: GET /api/ping */}
          <Card className="bg-black/50 border border-cyan-600 shadow-xl backdrop-blur-md w-full">
            <CardHeader>
              <CardTitle className="text-cyan-300">GET /api/ping</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-lg bg-black/70 p-3 text-cyan-400 text-sm shadow-inner">
                <code>{`curl -H 'x-api-key: <YOUR_KEY>' \\ 
${baseUrl}/api/ping`}</code>
              </pre>
              <pre className="overflow-x-auto rounded-lg bg-black/70 p-3 text-cyan-400 text-sm shadow-inner mt-2">
                <code>{`const r = await fetch('${baseUrl}/api/ping', { headers: { 'x-api-key': process.env.MY_KEY! } });`}</code>
              </pre>
            </CardContent>
          </Card>

          {/* Card 4: POST /api/echo */}
          <Card className="bg-black/50 border border-cyan-600 shadow-xl backdrop-blur-md w-full">
            <CardHeader>
              <CardTitle className="text-cyan-300">POST /api/echo</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-lg bg-black/70 p-3 text-cyan-400 text-sm shadow-inner">
                <code>{`curl -X POST \\ 
-H 'x-api-key: <YOUR_KEY>' \\ 
-H 'content-type: application/json' \\ 
-d '{"hello":"world"}' \\ 
${baseUrl}/api/echo`}</code>
              </pre>
              <pre className="overflow-x-auto rounded-lg bg-black/70 p-3 text-cyan-400 text-sm shadow-inner mt-2">
                <code>{`const r = await fetch('${baseUrl}/api/echo', { method: 'POST', headers: { 'x-api-key': process.env.MY_KEY!, 'content-type': 'application/json' }, body: JSON.stringify({ hello: 'world' }) });`}</code>
              </pre>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Tester */}
        <Card className="bg-black/50 border border-cyan-600 shadow-xl backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-cyan-300">Interactive Tester</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Paste your Api Key (sk ....)"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="bg-black/70 text-cyan-300 placeholder-cyan-500 border-cyan-500 rounded-lg"
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={runGet} className="bg-cyan-500 hover:bg-cyan-400 text-black">
                Test GET /ping
              </Button>
              <Button onClick={runPost} className="bg-green-500 hover:bg-green-400 text-black">
                Test POST /echo
              </Button>
            </div>
            <Label className="text-cyan-400 text-sm font-medium">Post Body (JSON)</Label>
            <Textarea
              rows={5}
              value={postBody}
              onChange={(e) => setPostBody(e.target.value)}
              className="bg-black/70 text-cyan-300 border-cyan-500 rounded-lg"
            />
            <Label className="text-cyan-400 text-sm font-medium">Response</Label>
            <Textarea
              rows={10}
              readOnly
              value={out}
              className="bg-black/70 text-cyan-400 border-cyan-500 rounded-lg"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
