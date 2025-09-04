import "~/styles/globals.css";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider, SignedOut, SignedIn } from "@clerk/nextjs";
import { TopNav } from "./_components/topnav";
import { SignOutButton } from "@clerk/nextjs";

<SignOutButton redirectUrl="/">
  <button>Sign Out</button>
</SignOutButton>


export const metadata: Metadata = {
  title: "API Hub | Create T3 App",
  description: "A simple homepage for API testing and integration",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{}}
      afterSignOutUrl="/"   // 👈 add this line
    >
      <html lang="en" className={geist.variable}>
        <body
          className="min-h-screen bg-cover bg-center text-yellow-100"
          style={{ backgroundImage: "url('/bg1.jpg')" }}
        >
          <TopNav />

          {/* Homepage visible only when SignedOut */}
          <SignedOut>
            <main className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 py-12 space-y-10 bg-black/40 backdrop-blur-md text-center">
              <section className="text-center max-w-3xl">
                <h1 className="text-5xl font-bold mb-4">
                  Welcome to <span className="text-yellow-300">API Hub</span>
                </h1>
                <p className="text-lg text-yellow-100 leading-relaxed">
                  Your one-stop solution to explore, test, and integrate APIs.  
                  Sign in to unlock features like API request testing,
                  documentation, and personalized tools.
                </p>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
                <div className="bg-white/10 p-6 rounded-xl shadow-lg hover:bg-white/20 transition">
                  <h2 className="text-xl font-semibold mb-2">📖 Documentation</h2>
                  <p className="text-sm text-yellow-200">
                    Read guides, explore endpoints, and learn how to connect with
                    our APIs in minutes.
                  </p>
                </div>
                <div className="bg-white/10 p-6 rounded-xl shadow-lg hover:bg-white/20 transition">
                  <h2 className="text-xl font-semibold mb-2">⚡ API Playground</h2>
                  <p className="text-sm text-yellow-200">
                    Test APIs directly in your browser and get real-time results
                    with sample requests.
                  </p>
                </div>
                <div className="bg-white/10 p-6 rounded-xl shadow-lg hover:bg-white/20 transition">
                  <h2 className="text-xl font-semibold mb-2">🔑 Authentication</h2>
                  <p className="text-sm text-yellow-200">
                    Secure access to endpoints with API keys and Clerk-powered
                    user management.
                  </p>
                </div>
              </section>

              <footer className="text-sm text-yellow-300 opacity-80 mt-6">
                © {new Date().getFullYear()} API Hub. All rights reserved.
              </footer>
            </main>
          </SignedOut>

          {/* Children content visible only when SignedIn */}
          <SignedIn>
            {children}
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
