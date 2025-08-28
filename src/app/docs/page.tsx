import { KeyRound } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function DocsPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: "url('/bg1.jpg')" }}
      />

      {/* Light white overlay for contrast */}
      <div className="fixed inset-0 bg-white/60 backdrop-blur-sm -z-5" />

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-10 relative z-10">
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-8 space-y-8 border border-gray-300">
          {/* Top Toolbar */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">📘 API Guide</h1>

            <Link href="/keys">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-300 bg-white text-gray-800 hover:bg-blue-600 hover:text-white transition"
                aria-label="Open Keys Dashboard"
              >
                <KeyRound className="w-5 h-5" />
                Keys Dashboard
              </Button>
            </Link>
          </div>

          {/* Introduction */}
          <p className="text-lg text-gray-800 leading-relaxed">
            Welcome to the API documentation. Below you’ll find how to authenticate requests and interact with endpoints using your API key.
          </p>

          {/* 🔐 Authentication Section */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">🔐 Authentication</h2>
            <p className="text-gray-700">
              Every request must include your API key:
            </p>
            <pre className="bg-gray-100 rounded p-4 text-sm font-mono text-gray-800 shadow-inner">
              <code>
                GET /api/protected/resource{`\n`}
                x-api-key: YOUR_API_KEY
              </code>
            </pre>
          </section>

          {/* 📦 Endpoints Section */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">📦 Endpoints</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-800">
              <li>
                <code className="font-mono text-sm">GET /api/health</code> – Check server status.
              </li>
              <li>
                <code className="font-mono text-sm">GET /api/user/data</code> – Fetch your user-specific data.
              </li>
            </ul>
          </section>

          {/* Footer Tip */}
          <div className="pt-6 border-t border-gray-300 text-sm text-gray-600">
            💡 Tip: Include your key in the{" "}
            <code className="">x-api-key</code>{" "}
            header when making requests.
          </div>
        </div>
      </div>
    </div>
  );
}
