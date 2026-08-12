import type { ReactNode } from "react";

interface ScrollAwareNavProps {
	children: ReactNode;
}

export function ScrollAwareNav({ children }: ScrollAwareNavProps) {
	return (
		<div className="sticky top-0 z-50 w-full py-3 px-3 sm:px-4 md:px-8">
			{children}
		</div>
	);
}
