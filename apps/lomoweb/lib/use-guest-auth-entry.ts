"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { alreadySignedInPath } from "@/lib/already-signed-in";
import { authClient } from "@/lib/auth-client";

function sessionHasUser(data: unknown): boolean {
	return Boolean(
		data
		&& typeof data === "object"
		&& "user" in data
		&& (data as { user?: unknown }).user,
	);
}

/**
 * If this browser still has a session, leave the auth form for home.
 * Returns true when navigation was requested.
 */
export async function leaveAuthFormIfSignedIn(
	replace: (href: string) => void,
): Promise<boolean> {
	try {
		const existing = await authClient.getSession();
		if (sessionHasUser(existing.data)) {
			replace(alreadySignedInPath());
			return true;
		}
	}
	catch {
		// Sign-in and sign-up report their own connection errors.
	}
	return false;
}

/**
 * Auth forms are only for signed-out visitors. Clears field state once the
 * session is confirmed gone, and again if the browser restores a previous form.
 */
export function useGuestAuthEntry(resetFields: () => void) {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();
	const signedIn = !isPending && sessionHasUser(session);
	const editedRef = useRef(false);
	const didClearRef = useRef(false);
	const [formKey, setFormKey] = useState(0);

	const markEdited = useCallback(() => {
		editedRef.current = true;
	}, []);

	useEffect(() => {
		if (isPending)
			return;
		if (signedIn) {
			router.replace(alreadySignedInPath());
			return;
		}
		if (didClearRef.current || editedRef.current)
			return;
		didClearRef.current = true;
		resetFields();
	}, [isPending, resetFields, router, signedIn]);

	useEffect(() => {
		function handlePageShow(event: PageTransitionEvent) {
			if (!event.persisted)
				return;
			editedRef.current = false;
			didClearRef.current = true;
			resetFields();
			setFormKey(key => key + 1);
			if (signedIn) {
				router.replace(alreadySignedInPath());
			}
		}

		window.addEventListener("pageshow", handlePageShow);
		return () => window.removeEventListener("pageshow", handlePageShow);
	}, [resetFields, router, signedIn]);

	return { formKey, markEdited, signedIn };
}
