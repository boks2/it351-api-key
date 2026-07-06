import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth(); // I-await ang auth()
  const { pathname } = req.nextUrl;

  // 1. Bypass Clerk para sa API routes
  if (pathname.startsWith('/api/ping') || pathname.startsWith('/api/echo')) {
    return;
  }

  // 2. I-check kung authenticated ang user
  if (!userId) {
    // Imbes na redirectToSignIn, gamitin ang NextResponse.redirect
    const signInUrl = new URL('/sign-in', req.url);
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};