"use client";

import { Button } from "@repo/ui/button";
import { stepButtonPrimary, stepButtonSecondary } from "./styles";

type OnboardingStepFooterProps
	= | {
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

export function OnboardingStepFooter(props: OnboardingStepFooterProps) {
	const { onBack, backLabel = "Back" } = props;

	// `variant="ghost"`, not `"outline"`: the outline variant emits its own 1px
	// `border`, which tailwind-merge resolves *over* `border="large"` and would
	// silently flatten the 4px ink outline the Figma controls use.
	const backButton = (
		<Button
			className={stepButtonSecondary}
			variant="ghost"
			color="terracotta"
			size={3}
			border="large"
			borderColor="terracotta"
			onPress={onBack}
		>
			{backLabel}
		</Button>
	);

	if (props.showNext === false) {
		return <div className="mt-auto flex w-full pt-8">{backButton}</div>;
	}

	const {
		onNext,
		nextLabel = "Continue",
		nextDisabled = false,
	} = props;

	return (
		<div className="mt-auto flex w-full gap-3 pt-8">
			{backButton}
			<Button
				className={stepButtonPrimary}
				variant="solid"
				color="yellow"
				size={3}
				border="large"
				borderColor="terracotta"
				isDisabled={nextDisabled}
				onPress={onNext}
			>
				{nextLabel}
			</Button>
		</div>
	);
}
