"use client";

import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { FOOD_KIND_OPTIONS } from "@/lib/request-flow/food";
import { useRouter } from "next/navigation";
import { useRequestDraft } from "../../request-draft-context";
import { RequestStepFooter } from "../../request-step-footer";
import { SelectionCard } from "../../selection-card";

export default function FoodKindPage() {
	const router = useRouter();
	const { draft, setFoodKind } = useRequestDraft();

	return (
		<>
			<div className="flex flex-1 flex-col gap-4">
				<Heading size={7} className="text-center">
					What kind of food?
				</Heading>
				<Text size={3} color="gray" className="text-center">
					Pick the type that fits best.
				</Text>

				<div className="mt-2 flex flex-col gap-3">
					{FOOD_KIND_OPTIONS.map(opt => (
						<SelectionCard
							key={opt.id}
							title={opt.title}
							description={opt.description}
							selected={draft.foodKind === opt.id}
							onClick={() => {
								setFoodKind(opt.id);
								router.push("/app/request/food/details");
							}}
						/>
					))}
				</div>

				<Text size={2} color="gray" className="mt-2 text-center">
					You don&apos;t need to explain your choice.
				</Text>
			</div>

			<RequestStepFooter
				showNext={false}
				onBack={() => router.push("/app/request")}
			/>
		</>
	);
}
