import {
	Checkbox,
	CheckboxGroup,
	CheckboxIndicator,
	Description,
	FieldError,
	Label,
} from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { DemoSection, PageHeader, Playground, PropTable } from "./-components";

const COLORS = ["terracotta", "sage", "yellow", "gray", "red", "amber"] as const;
const VARIANTS = ["surface", "classic"] as const;
const SIZES = [1, 2, 3] as const;

const CHECKBOX_PROPS = [
	{ name: "variant", type: "\"surface\" | \"classic\"", default: "\"surface\"" },
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

			<Playground
				componentName="Checkbox"
				childrenLabel={"<CheckboxIndicator />\n  Checkbox"}
				defaults={{ variant: "surface", size: 2, color: "terracotta", isDisabled: false, isIndeterminate: false, grouped: false }}
				controls={[
					{ name: "variant", type: "segment", options: VARIANTS },
					{ name: "size", type: "segment", options: SIZES },
					{ name: "color", type: "segment", options: COLORS },
					{ name: "isDisabled", type: "toggle" },
					{ name: "isIndeterminate", type: "toggle" },
					{ name: "grouped", type: "toggle" },
				]}
			>
				{(props) => {
					const checkbox = (label: string, value?: string) => (
						<Checkbox
							variant={props.variant as "surface" | "classic"}
							size={props.size as 1 | 2 | 3}
							color={props.color as any}
							isDisabled={props.isDisabled as boolean}
							isIndeterminate={props.isIndeterminate as boolean}
							defaultSelected
							value={value}
						>
							<CheckboxIndicator />
							{label}
						</Checkbox>
					);

					if (props.grouped) {
						return (
							<CheckboxGroup
								variant={props.variant as "surface" | "classic"}
								size={props.size as 1 | 2 | 3}
								color={props.color as any}
							>
								<Label>Group label</Label>
								{checkbox("Option A", "a")}
								{checkbox("Option B", "b")}
								{checkbox("Option C", "c")}
							</CheckboxGroup>
						);
					}

					return checkbox("Checkbox");
				}}
			</Playground>

			<PropTable data={CHECKBOX_PROPS} />

			{/* ── Variants ── */}
			<DemoSection title="Variant" description="Two visual styles for the indicator box.">
				<div className="flex flex-col gap-3">
					{VARIANTS.map(variant => (
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
					{VARIANTS.map(variant => (
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
		</div>
	);
}

export const Route = createFileRoute("/showcase/checkbox")({
	component: CheckboxPage,
});
