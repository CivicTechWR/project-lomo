"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useRequestDraft } from "../request-draft-context";

export default function FoodRequestLayout({ children }: { children: ReactNode }) {
	const { draft } = useRequestDraft();
	const router = useRouter();

	useEffect(() => {
		// Only bounce when a *different* category is set — not when `null` after
		// `resetDraft()` on successful submit (that would override navigation to /app).
		if (draft.category !== null && draft.category !== "food") {
			router.replace("/app/request");
		}
	}, [draft.category, router]);

	if (draft.category !== null && draft.category !== "food") {
		return (
			<div className="flex flex-1 items-center justify-center py-16">
				<p className="text-[length:var(--text-2)] text-gray-11">
					Redirecting…
				</p>
			</div>
		);
	}

	return children;
}
