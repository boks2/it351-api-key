import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// I-define ang mga public routes (routes na hindi kailangan ng login)
const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/api/ping', 
  '/api/echo' // Siguraduhin na ang API routes ay accessible kung kailangan
]);

export default clerkMiddleware(async (auth, req) => {
  const session = await auth();

  // Protektahan ang lahat ng routes maliban sa public routes
  if (!isPublicRoute(req) && !session.userId) {
    return session.redirectToSignIn();
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};