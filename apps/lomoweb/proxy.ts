/**
 * Example edge guard — not active unless re-exported from `middleware.ts`.
 * Convex Better Auth typically uses the `convex_jwt` cookie; `getSessionCookie()` from
 * `better-auth/cookies` targets Better Auth’s default session cookie. Using this as-is
 * often yields false “no session” and causes /app ↔ /signin redirect loops.
 */
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
	const { pathname } = request.nextUrl;

	if (pathname.startsWith("/app")) {
		if (!sessionCookie) {
			const signinUrl = new URL("/signin", request.url);
			signinUrl.searchParams.set("redirect", pathname);
			return NextResponse.redirect(signinUrl);
		}
	}

	if (pathname === "/signin" || pathname === "/signup") {
		if (sessionCookie) {
			return NextResponse.redirect(new URL("/app", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/app/:path*", "/signin", "/signup"],
};
