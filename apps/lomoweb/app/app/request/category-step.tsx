"use client";

import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { REQUEST_CATEGORIES } from "@/lib/request-flow/categories";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useRequestDraft } from "./request-draft-context";
import { RequestStepFooter } from "./request-step-footer";
import { SelectionCard } from "./selection-card";

export function CategoryStep() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { draft, setCategory, resetDraft } = useRequestDraft();

	useEffect(() => {
		if (searchParams.get("fresh") === "1") {
			resetDraft();
			router.replace("/app/request");
		}
	}, [searchParams, resetDraft, router]);

	function selectCategory(cat: (typeof REQUEST_CATEGORIES)[number]) {
		if (!cat.implemented) {
			return;
		}
		setCategory(cat.id);
		if (cat.id === "food") {
			router.push("/app/request/food/kind");
		}
		if (cat.id === "items") {
			router.push("/app/request/items/details");
		}
		if (cat.id === "other") {
			router.push("/app/request/other/details");
		}
		if (cat.id === "support") {
			router.push("/app/request/support/details");
		}
		if (cat.id === "paperwork") {
			router.push("/app/request/paperwork/details");
		}
		if (cat.id === "ceremony") {
			router.push("/app/request/ceremony/role");
		}
	}

	return (
		<>
			<div className="flex flex-1 flex-col gap-4">
				<Heading size={7} className="text-center">
					How do you want to connect today?
				</Heading>
				<Text size={3} color="gray" className="text-center">
					Choose what feels most supportive right now.
				</Text>

				<div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
					{REQUEST_CATEGORIES.map(cat => (
						<SelectionCard
							key={cat.id}
							title={cat.title}
							description={cat.description}
							disabled={!cat.implemented}
							selected={draft.category === cat.id}
							onClick={() => selectCategory(cat)}
						/>
					))}
				</div>
			</div>

			<RequestStepFooter
				showNext={false}
				onBack={() => router.push("/app")}
			/>
		</>
	);
}
