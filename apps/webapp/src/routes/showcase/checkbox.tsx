import {
	Checkbox,
	CheckboxGroup,
	CheckboxIndicator,
	Description,
	FieldError,
	Label,
	Text,
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
	const [singleChecked, setSingleChecked] = useState(true);
	const [groupSelected, setGroupSelected] = useState<string[]>(["email", "digest"]);

	return (
		<div className="flex flex-col gap-10">
			<PageHeader
				title="Checkbox"
				description="Allows a user to select one or more items, or toggle a single option."
			/>

			<Playground
				componentName={values => values.grouped ? "CheckboxGroup" : "Checkbox"}
				childrenLabel={(values) => {
					if (values.grouped) {
						return [
							"<Label>How would you like to be notified?</Label>",
							"<Checkbox value=\"email\">",
							"  <CheckboxIndicator />",
							"  Email when someone responds to my request",
							"</Checkbox>",
							"<Checkbox value=\"sms\">",
							"  <CheckboxIndicator />",
							"  SMS for urgent matches nearby",
							"</Checkbox>",
							"<Checkbox value=\"digest\">",
							"  <CheckboxIndicator />",
							"  Weekly digest of community activity",
							"</Checkbox>",
							"<Description>You can change these anytime in your settings.</Description>",
						].join("\n  ");
					}
					return "<CheckboxIndicator />\n  Remember my preferences";
				}}
				snippetExclude={["grouped"]}
				defaults={{ variant: "surface", size: 2, color: "terracotta", isDisabled: false, isIndeterminate: false, grouped: false }}
				controls={[
					{ name: "variant", type: "segment", options: VARIANTS },
					{ name: "size", type: "segment", options: SIZES },
					{ name: "color", type: "segment", options: COLORS },
					{ name: "isDisabled", type: "toggle" },
					{ name: "isIndeterminate", type: "toggle" },
					{ name: "grouped", type: "toggle" },
				]}
				footer={values => (
					<Text size={1} color="gray">
						<code className="font-mono">
							{values.grouped
								? `Selected: ${JSON.stringify(groupSelected)}`
								: `State: ${singleChecked}`}
						</code>
					</Text>
				)}
				snippetPrefix={(values) => {
					if (values.grouped) {
						return "const [selected, setSelected] = useState([\"email\", \"digest\"]);";
					}
					return "const [checked, setChecked] = useState(true);";
				}}
				snippetExtraProps={(values) => {
					if (values.grouped) {
						return ["value={selected}", "onChange={setSelected}"];
					}
					return ["isSelected={checked}", "onChange={setChecked}"];
				}}
			>
				{(props) => {
					const v = props.variant as "surface" | "classic";
					const s = props.size as 1 | 2 | 3;
					const c = props.color as any;
					const disabled = props.isDisabled as boolean;
					const indeterminate = props.isIndeterminate as boolean;

					if (props.grouped) {
						return (
							<div className="w-full max-w-sm">
								<CheckboxGroup variant={v} size={s} color={c} value={groupSelected} onChange={setGroupSelected}>
									<Label>How would you like to be notified?</Label>
									<Checkbox value="email" isDisabled={disabled} isIndeterminate={indeterminate}>
										<CheckboxIndicator />
										Email when someone responds to my request
									</Checkbox>
									<Checkbox value="sms" isDisabled={disabled} isIndeterminate={indeterminate}>
										<CheckboxIndicator />
										SMS for urgent matches nearby
									</Checkbox>
									<Checkbox value="digest" isDisabled={disabled} isIndeterminate={indeterminate}>
										<CheckboxIndicator />
										Weekly digest of community activity
									</Checkbox>
									<Description>You can change these anytime in your settings.</Description>
								</CheckboxGroup>
							</div>
						);
					}

					return (
						<Checkbox
							variant={v}
							size={s}
							color={c}
							isDisabled={disabled}
							isIndeterminate={indeterminate}
							isSelected={singleChecked}
							onChange={setSingleChecked}
						>
							<CheckboxIndicator />
							Remember my preferences
						</Checkbox>
					);
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
