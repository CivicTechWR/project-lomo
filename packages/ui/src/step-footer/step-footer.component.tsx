"use client";

import { Button } from "../button/index.ts";
import { cn } from "../utils/cn.ts";
import { stepFooterVariants } from "./step-footer.variants.ts";

export type StepFooterProps
	= | {
		onBack: () => void;
		backLabel?: string;
		showNext?: true;
		onNext: () => void;
		nextLabel?: string;
		nextDisabled?: boolean;
		nextColor?: "sage" | "yellow" | "terracotta" | "gray";
		variant?: "default" | "onboarding";
		className?: string;
	}
	| {
		onBack: () => void;
		backLabel?: string;
		showNext: false;
		variant?: "default" | "onboarding";
		className?: string;
	};

export function StepFooter(props: StepFooterProps) {
	const {
		onBack,
		backLabel = "Back",
		variant = "default",
		className,
	} = props;

	const { root, backButton: backBtnClass, nextButton: nextBtnClass } = stepFooterVariants({ variant });

	const isOnboarding = variant === "onboarding";

	const renderBackButton = () => (
		<Button
			className={cn(backBtnClass(), isOnboarding ? "" : "")}
			variant={isOnboarding ? "ghost" : "outline"}
			color={isOnboarding ? "terracotta" : undefined}
			size={isOnboarding ? 3 : undefined}
			border={isOnboarding ? "large" : "small"}
			borderColor={isOnboarding ? "terracotta" : undefined}
			onPress={onBack}
		>
			{backLabel}
		</Button>
	);

	if (props.showNext === false) {
		return (
			<div className={cn(root(), className)}>
				{renderBackButton()}
			</div>
		);
	}

	const {
		onNext,
		nextLabel = isOnboarding ? "Continue" : "Next",
		nextDisabled = false,
		nextColor = isOnboarding ? "yellow" : "sage",
	} = props;

	return (
		<div className={cn(root(), className)}>
			{renderBackButton()}
			<Button
				className={cn(nextBtnClass())}
				variant="solid"
				color={nextColor}
				size={isOnboarding ? 3 : undefined}
				border={isOnboarding ? "large" : "small"}
				borderColor={isOnboarding ? "terracotta" : undefined}
				isDisabled={nextDisabled}
				onPress={onNext}
			>
				{nextLabel}
			</Button>
		</div>
	);
}
