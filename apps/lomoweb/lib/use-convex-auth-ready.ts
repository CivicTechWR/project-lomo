"use client";

import { useConvexAuth } from "convex/react";
import { useCallback, useEffect, useRef } from "react";

const DEFAULT_TIMEOUT_MS = 10_000;
const POLL_INTERVAL_MS = 50;

/**
 * Returns a function that resolves once the Convex client is actually
 * authenticated (backend-confirmed), not just once Better Auth has set its
 * session cookie.
 *
 * Needed after `authClient.signUp.email()` / `signIn.email()`: those resolve as
 * soon as the cookie exists, but `ConvexBetterAuthProvider` still has to fetch a
 * JWT and call `client.setAuth()`. Mutations fired in that window reach Convex
 * with no identity and throw `Unauthenticated`.
 *
 * Resolves `true` when authenticated, `false` if the timeout elapses first.
 */
export function useConvexAuthReady(): (timeoutMs?: number) => Promise<boolean> {
	const { isAuthenticated } = useConvexAuth();
	const isAuthenticatedRef = useRef(isAuthenticated);

	useEffect(() => {
		isAuthenticatedRef.current = isAuthenticated;
	}, [isAuthenticated]);

	return useCallback(async (timeoutMs = DEFAULT_TIMEOUT_MS) => {
		const deadline = Date.now() + timeoutMs;
		while (!isAuthenticatedRef.current) {
			if (Date.now() >= deadline) {
				return false;
			}
			await new Promise((resolve) => {
				setTimeout(resolve, POLL_INTERVAL_MS);
			});
		}
		return true;
	}, []);
}
