import {
	Checkbox,
	CheckboxCard,
	CheckboxCards,
	CheckboxGroup,
	CheckboxIndicator,
	Description,
	FieldError,
	Label,
	Text,
} from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { DemoSection, PageHeader, PropTable } from "./-components";

const COLORS = ["terracotta", "sage", "yellow", "gray", "red", "amber"] as const;
const INDICATOR_VARIANTS = ["surface", "classic", "soft"] as const;
const CARD_VARIANTS = ["ghost", "surface", "classic"] as const;
const SIZES = [1, 2, 3] as const;

const CHECKBOX_PROPS = [
	{ name: "variant", type: "\"surface\" | \"classic\" | \"soft\"", default: "\"surface\"" },
	{ name: "size", type: "1 | 2 | 3", default: "2" },
	{ name: "color", type: "\"terracotta\" | \"sage\" | ... | \"amber\"", default: "\"terracotta\"" },
	{ name: "isDisabled", type: "boolean", default: "false" },
	{ name: "isIndeterminate", type: "boolean", default: "false" },
	{ name: "isSelected", type: "boolean", default: "undefined" },
	{ name: "value", type: "string", default: "undefined" },
];

function CheckboxPage() {
	const [groupValue, setGroupValue] = useState<string[]>([]);

	return (
		<div className="flex flex-col gap-10">
			<PageHeader
				title="Checkbox"
				description="Allows a user to select one or more items, or toggle a single option."
			/>

			<PropTable data={CHECKBOX_PROPS} />

			{/* ── Variants ── */}
			<DemoSection title="Variant" description="Three visual styles for the indicator box.">
				<div className="flex flex-col gap-3">
					{INDICATOR_VARIANTS.map(variant => (
						<Checkbox key={variant} variant={variant} defaultSelected>
							<CheckboxIndicator />
							{variant.charAt(0).toUpperCase() + variant.slice(1)}
						</Checkbox>
					))}
				</div>
			</DemoSection>

			{/* ── Sizes ── */}
			<DemoSection title="Size" description="Three sizes for different density requirements.">
				<div className="flex flex-col gap-3">
					{SIZES.map(size => (
						<Checkbox key={size} size={size} defaultSelected>
							<CheckboxIndicator />
							Size
							{" "}
							{size}
						</Checkbox>
					))}
				</div>
			</DemoSection>

			{/* ── Colors ── */}
			<DemoSection title="Color" description="All palette colors, shown in checked and unchecked states.">
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
					{COLORS.map(color => (
						<Checkbox key={color} color={color} defaultSelected>
							<CheckboxIndicator />
							{color.charAt(0).toUpperCase() + color.slice(1)}
						</Checkbox>
					))}
				</div>
				<div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
					{COLORS.map(color => (
						<Checkbox key={color} color={color}>
							<CheckboxIndicator />
							{color.charAt(0).toUpperCase() + color.slice(1)}
						</Checkbox>
					))}
				</div>
			</DemoSection>

			{/* ── Indeterminate ── */}
			<DemoSection title="Indeterminate" description="Dash indicator for partially selected state.">
				<div className="flex flex-col gap-3">
					{INDICATOR_VARIANTS.map(variant => (
						<Checkbox key={variant} variant={variant} isIndeterminate>
							<CheckboxIndicator />
							{`Indeterminate (${variant})`}
						</Checkbox>
					))}
				</div>
			</DemoSection>

			{/* ── Disabled ── */}
			<DemoSection title="Disabled" description="Disabled state with reduced opacity.">
				<div className="flex flex-col gap-3">
					<Checkbox isDisabled>
						<CheckboxIndicator />
						Unchecked disabled
					</Checkbox>
					<Checkbox isDisabled defaultSelected>
						<CheckboxIndicator />
						Checked disabled
					</Checkbox>
				</div>
			</DemoSection>

			{/* ── CheckboxGroup ── */}
			<DemoSection title="CheckboxGroup" description="Group with label, description, and field error integration.">
				<div className="flex flex-col gap-6">
					<CheckboxGroup
						color="sage"
						value={groupValue}
						onChange={setGroupValue}
					>
						<Label>Notification preferences</Label>
						<Checkbox value="email">
							<CheckboxIndicator />
							Email notifications
						</Checkbox>
						<Checkbox value="sms">
							<CheckboxIndicator />
							SMS notifications
						</Checkbox>
						<Checkbox value="push">
							<CheckboxIndicator />
							Push notifications
						</Checkbox>
						<Description>Choose how you'd like to be contacted.</Description>
					</CheckboxGroup>

					<CheckboxGroup color="red" isInvalid isRequired>
						<Label>Terms</Label>
						<Checkbox value="terms">
							<CheckboxIndicator />
							I agree to the terms and conditions
						</Checkbox>
						<FieldError>You must agree to continue.</FieldError>
					</CheckboxGroup>
				</div>
			</DemoSection>

			{/* ── CheckboxCards ── */}
			<DemoSection title="CheckboxCards" description="Card-style selection with optional indicator.">
				<div className="flex flex-col gap-6">
					<CheckboxCards variant="surface" color="terracotta" columns="repeat(3, 1fr)">
						<CheckboxCard value="housing">
							<CheckboxIndicator />
							<Text weight="medium">Housing</Text>
							<Text size={1} color="gray">Find housing support</Text>
						</CheckboxCard>
						<CheckboxCard value="food">
							<CheckboxIndicator />
							<Text weight="medium">Food</Text>
							<Text size={1} color="gray">Food bank access</Text>
						</CheckboxCard>
						<CheckboxCard value="transport">
							<CheckboxIndicator />
							<Text weight="medium">Transport</Text>
							<Text size={1} color="gray">Transit assistance</Text>
						</CheckboxCard>
					</CheckboxCards>

					<Text size={2} weight="medium" color="gray">Card variants:</Text>
					{CARD_VARIANTS.map(variant => (
						<CheckboxCards key={variant} variant={variant} color="sage" columns="repeat(3, 1fr)">
							<CheckboxCard value="a">
								<Text weight="medium">{variant.charAt(0).toUpperCase() + variant.slice(1)}</Text>
							</CheckboxCard>
							<CheckboxCard value="b" defaultSelected>
								<Text weight="medium">Selected</Text>
							</CheckboxCard>
							<CheckboxCard value="c">
								<Text weight="medium">Option C</Text>
							</CheckboxCard>
						</CheckboxCards>
					))}
				</div>
			</DemoSection>
		</div>
	);
}

export const Route = createFileRoute("/showcase/checkbox")({
	component: CheckboxPage,
});
