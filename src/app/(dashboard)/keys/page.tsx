"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { BookOpen, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import CopyButton from "~/components/copy-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";

type KeyItem = {
  id: string;
  name: string;
  masked: string;
  createdAt: string;
  revoked: boolean;
};

export default function KeysPage() {
  const [name, setName] = useState("");
  const [justCreated, setJustCreated] = useState<{ key: string; id: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<KeyItem[]>([]);

  const router = useRouter();
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn) router.replace("/");
  }, [isSignedIn, router]);

  useEffect(() => {
    void load();
  }, []);

  async function createKey() {
    setLoading(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = (await res.json()) as { key: string; id: string; [k: string]: unknown };
      if (res.ok) {
        setJustCreated({ key: data.key, id: data.id });
        await load();
      } else {
        alert((data.error as string) ?? "Failed to create key");
      }
    } finally {
      setLoading(false);
    }
  }

  async function load() {
    const res = await fetch("/api/keys", { cache: "no-store" });
    const data = (await res.json()) as { items?: KeyItem[] };
    setItems(data.items ?? []);
  }

  async function revokeKey(id: string) {
    const res = await fetch(`/api/keys?keyId=${id}`, { method: "DELETE" });
    const data = (await res.json()) as { error?: string; success?: boolean };
    if (!res.ok) alert(data.error ?? "Failed to revoke key");
    await load();
  }

  if (!isSignedIn) return null;

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: "url('/bg1.jpg')" }}
      />
      <div className="fixed inset-0 bg-black/30 -z-5" />

      {/* Content */}
      <div className="relative z-10 p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            🔑 API Key Manager
          </h1>
          <Link href="/docs">
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-lg border-gray-300 bg-white/80 text-base text-gray-700 shadow-sm hover:bg-blue-600 hover:text-white transition"
            >
              <BookOpen className="h-5 w-5" />
              API Documentation
            </Button>
          </Link>
        </div>

        {/* Card Section: stacked vertically */}
        <div className="flex flex-col gap-6">
          {/* Just Created Key */}
          {justCreated && (
            <Card className="relative rounded-2xl overflow-hidden shadow-lg">
              <div
                className="absolute inset-0 bg-cover bg-center blur-sm"
                style={{ backgroundImage: "url('/bg1.jpg')" }}
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative p-6">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Your New API Key</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-200">Here is your API Key (visible once):</p>
                  <div className="mt-2 flex items-center gap-2 bg-white/90 p-2 rounded-md">
                    <code className="font-mono text-sm break-all text-gray-900">
                      {justCreated.key}
                    </code>
                    <CopyButton value={justCreated.key} />
                  </div>
                  <p className="mt-2 text-xs text-gray-300">
                    💡 Save this key securely. You won’t be able to see it again.
                  </p>
                </CardContent>
              </div>
            </Card>
          )}

          {/* Generate Key */}
          <Card className="relative rounded-2xl overflow-hidden shadow-lg">
            <div
              className="absolute inset-0 bg-cover bg-center blur-sm"
              style={{ backgroundImage: "url('/bg1.jpg')" }}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative p-6">
              <CardHeader className="text-xl text-white flex-1 truncate">
                <CardTitle className="text-xl text-white">Generate API Key</CardTitle>
                <Button
                  onClick={() => void createKey()}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 mt-4"
                >
                  <Plus className="h-5 w-5" />
                  Create
                </Button>
              </CardHeader> 
              <CardContent className="pt-4">
                <Input
                  placeholder="Key Name (e.g. production)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/90 text-gray-900 border-gray-300 rounded-lg"
                />
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Keys Table */}
        <Card className="rounded-2xl shadow-xl overflow-hidden mt-10">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
            <CardTitle className="text-xl text-white">Your API Keys</CardTitle>
          </CardHeader>
          <CardContent className="bg-white px-0 py-2">
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((row) => (
                    <TableRow key={row.id} className="hover:bg-gray-50 transition">
                      <TableCell>{row.name}</TableCell>
                      <TableCell className="font-mono text-xs text-gray-800 break-all">
                        {row.masked}
                      </TableCell>
                      <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {row.revoked ? (
                          <Badge variant="secondary">Revoked</Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="rounded"
                          disabled={row.revoked}
                          onClick={() => void revokeKey(row.id)}
                        >
                          Revoke
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-sm text-gray-500">
                        No API Keys found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <Separator className="my-6" />
        <p className="text-center text-white">
          💡 Tip: Call secured endpoints with the{" "}
          <code className="rounded bg-gray-200 px-1 py-0.5 font-mono text-sm">x-api-key</code>{" "}
          header. See{" "}
          <Link
            href="/docs"
            className="font-medium underline text-blue-400 hover:text-indigo-300"
          >
            Docs
          </Link>
        </p>
      </div>
    </div>
  );
}
