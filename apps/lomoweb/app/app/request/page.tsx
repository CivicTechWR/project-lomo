import { Suspense } from "react";
import { CategoryStep } from "./category-step";

export default function RequestCategoryPage() {
	return (
		<Suspense
			fallback={
				<div
					className="min-h-[min(40vh,320px)] animate-pulse rounded-lg bg-gray-3"
					aria-hidden
				/>
			}
		>
			<CategoryStep />
		</Suspense>
	);
}
