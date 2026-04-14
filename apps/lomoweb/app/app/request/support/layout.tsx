"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useRequestDraft } from "../request-draft-context";

export default function SupportRequestLayout({ children }: { children: ReactNode }) {
	const { draft } = useRequestDraft();
	const router = useRouter();

	useEffect(() => {
		if (draft.category !== null && draft.category !== "support") {
			router.replace("/app/request");
		}
	}, [draft.category, router]);

	if (draft.category !== null && draft.category !== "support") {
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
