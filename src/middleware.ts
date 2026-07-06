import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// I-define ang mga routes na pwedeng puntahan ng hindi naka-login
const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/api/ping', 
  '/api/echo'
]);

export default clerkMiddleware(async (auth, req) => {
  // 1. I-await ang auth() dahil isa itong Promise
  const session = await auth();

  // 2. Gamitin ang session.userId para i-check ang authentication
  if (!isPublicRoute(req) && !session.userId) {
    // 3. Gamitin ang session.redirectToSignIn para i-redirect ang user
    return session.redirectToSignIn();
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};