"use client";

import { Button } from "@repo/ui/button";

type RequestStepFooterProps =
	| {
			onBack: () => void;
			showNext?: true;
			onNext: () => void;
			nextLabel?: string;
			nextDisabled?: boolean;
			backLabel?: string;
	  }
	| {
			onBack: () => void;
			showNext: false;
			backLabel?: string;
	  };

export function RequestStepFooter(props: RequestStepFooterProps) {
	const { onBack, backLabel = "Back" } = props;

	if (props.showNext === false) {
		return (
			<div className="mt-auto flex w-full pt-6">
				<Button className="min-w-0 flex-1" variant="outline" onPress={onBack}>
					{backLabel}
				</Button>
			</div>
		);
	}

	const {
		onNext,
		nextLabel = "Next",
		nextDisabled = false,
	} = props;

	return (
		<div className="mt-auto flex w-full gap-3 pt-6">
			<Button
				className="min-w-0 flex-1"
				variant="outline"
				onPress={onBack}
			>
				{backLabel}
			</Button>
			<Button
				className="min-w-0 flex-1"
				variant="solid"
				color="sage"
				isDisabled={nextDisabled}
				onPress={onNext}
			>
				{nextLabel}
			</Button>
		</div>
	);
}
