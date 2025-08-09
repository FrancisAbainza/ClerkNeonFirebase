import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  // Redirect signed-in users visiting the home page to the dashboard
  if (req.nextUrl.pathname === '/' && userId) {
    const url = req.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  if (isPublicRoute(req)) {
    return
  }
})

export const config = {
  matcher: [
    // Run middleware on all routes except static files and Next internals
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}