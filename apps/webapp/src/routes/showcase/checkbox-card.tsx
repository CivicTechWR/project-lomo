import {
	CheckboxCard,
	CheckboxCardGroup,
	CheckboxIndicator,
	Label,
	Text,
} from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { DemoSection, PageHeader, Playground, PropTable } from "./-components";

const COLORS = ["terracotta", "sage", "yellow", "gray", "red", "amber"] as const;
const VARIANTS = ["surface", "classic"] as const;
const SIZES = [1, 2, 3] as const;

const CHECKBOX_CARD_PROPS = [
	{ name: "variant", type: "\"surface\" | \"classic\"", default: "\"surface\"" },
	{ name: "size", type: "1 | 2 | 3", default: "2" },
	{ name: "color", type: "\"terracotta\" | \"sage\" | ... | \"amber\"", default: "\"terracotta\"" },
	{ name: "isDisabled", type: "boolean", default: "false" },
	{ name: "isSelected", type: "boolean", default: "undefined" },
	{ name: "value", type: "string", default: "undefined" },
];

const HELP_CATEGORIES = [
	{
		value: "housing",
		label: "Housing",
		description: "Shelter, rent assistance, or finding a place to stay",
		icon: "\u{1F3E0}",
	},
	{
		value: "food",
		label: "Food & Meals",
		description: "Food banks, community kitchens, and meal programs",
		icon: "\u{1F96A}",
	},
	{
		value: "transport",
		label: "Getting Around",
		description: "Bus passes, rides to appointments, or route planning",
		icon: "\u{1F68C}",
	},
	{
		value: "legal",
		label: "Legal Aid",
		description: "Free consultations, tenant rights, and immigration help",
		icon: "\u{2696}\u{FE0F}",
	},
	{
		value: "health",
		label: "Health & Wellness",
		description: "Clinics, mental health support, and harm reduction",
		icon: "\u{1FA7A}",
	},
	{
		value: "employment",
		label: "Employment",
		description: "Job search, resume help, and skills training",
		icon: "\u{1F4BC}",
	},
];

function CheckboxCardPage() {
	const [singleChecked, setSingleChecked] = useState(true);
	const [groupSelected, setGroupSelected] = useState<string[]>(["housing", "food"]);

	return (
		<div className="flex flex-col gap-10">
			<PageHeader
				title="Checkbox Card"
				description="Card-style selection control for multi-option grids."
			/>

			<Playground
				componentName={values => values.grouped ? "CheckboxCardGroup" : "CheckboxCard"}
				childrenLabel={(values) => {
					if (values.grouped) {
						return [
							"<Label>What kind of support are you looking for?</Label>",
							"<div className=\"mt-2 grid grid-cols-3 gap-3\">",
							"  <CheckboxCard value=\"housing\">",
							"    <section className=\"flex flex-col gap-1\">",
							"      <Text weight=\"medium\">Housing</Text>",
							"      <Text size={1} color=\"gray\">Shelter, rent assistance, ...</Text>",
							"    </section>",
							"  </CheckboxCard>",
							"  {/* ... more cards */}",
							"</div>",
						].join("\n  ");
					}
					return [
						"<section className=\"flex items-start gap-3\">",
						"  <CheckboxIndicator />",
						"  <div className=\"flex flex-col gap-1\">",
						"    <Text weight=\"medium\">Housing</Text>",
						"    <Text size={1} color=\"gray\">Shelter, rent assistance, ...</Text>",
						"  </div>",
						"</section>",
					].join("\n  ");
				}}
				snippetExclude={["grouped"]}
				defaults={{ variant: "surface", size: 2, color: "terracotta", isDisabled: false, grouped: false }}
				controls={[
					{ name: "variant", type: "segment", options: VARIANTS },
					{ name: "size", type: "segment", options: SIZES },
					{ name: "color", type: "segment", options: COLORS },
					{ name: "isDisabled", type: "toggle" },
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
						return "const [selected, setSelected] = useState([\"housing\", \"food\"]);";
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

					if (props.grouped) {
						return (
							<div className="w-full">
								<CheckboxCardGroup variant={v} size={s} color={c} value={groupSelected} onChange={setGroupSelected}>
									<Label>What kind of support are you looking for?</Label>
									<div className="mt-2 grid grid-cols-3 gap-3">
										{HELP_CATEGORIES.slice(0, 6).map(cat => (
											<CheckboxCard
												key={cat.value}
												value={cat.value}
												isDisabled={disabled}
											>
												<section className="flex flex-col gap-1">
													<div className="flex items-center gap-2">
														<span className="text-[length:var(--text-3)]">{cat.icon}</span>
														<Text weight="medium">{cat.label}</Text>
													</div>
													<Text size={1} color="gray">{cat.description}</Text>
												</section>
											</CheckboxCard>
										))}
									</div>
								</CheckboxCardGroup>
							</div>
						);
					}

					return (
						<CheckboxCard
							variant={v}
							size={s}
							color={c}
							isDisabled={disabled}
							isSelected={singleChecked}
							onChange={setSingleChecked}
							value="housing"
							className="w-full max-w-xs"
						>
							<section className="flex items-start gap-3">
								<CheckboxIndicator />
								<div className="flex flex-col gap-1">
									<Text weight="medium">Housing</Text>
									<Text size={1} color="gray">Shelter, rent assistance, or finding a place to stay</Text>
								</div>
							</section>
						</CheckboxCard>
					);
				}}
			</Playground>

			<PropTable data={CHECKBOX_CARD_PROPS} />

			{/* ── Variants ── */}
			<DemoSection title="Variant" description="Two visual styles for the card container.">
				<div className="grid grid-cols-2 gap-3">
					{VARIANTS.map(variant => (
						<CheckboxCard key={variant} variant={variant} defaultSelected value={variant}>
							<section className="flex flex-col gap-1">
								<Text weight="medium">{variant.charAt(0).toUpperCase() + variant.slice(1)}</Text>
								<Text size={1} color="gray">Card variant style</Text>
							</section>
						</CheckboxCard>
					))}
				</div>
			</DemoSection>

			{/* ── Sizes ── */}
			<DemoSection title="Size" description="Three sizes for different density requirements.">
				<div className="grid grid-cols-3 gap-3">
					{SIZES.map(size => (
						<CheckboxCard key={size} size={size} defaultSelected value={String(size)}>
							<Text weight="medium">
								Size
								{" "}
								{size}
							</Text>
						</CheckboxCard>
					))}
				</div>
			</DemoSection>

			{/* ── Colors ── */}
			<DemoSection title="Color" description="All palette colors in selected state.">
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
					{COLORS.map(color => (
						<CheckboxCard key={color} color={color} defaultSelected value={color}>
							<Text weight="medium">{color.charAt(0).toUpperCase() + color.slice(1)}</Text>
						</CheckboxCard>
					))}
				</div>
			</DemoSection>

			{/* ── Disabled ── */}
			<DemoSection title="Disabled" description="Disabled state with reduced opacity.">
				<div className="grid grid-cols-2 gap-3">
					<CheckboxCard isDisabled value="unchecked">
						<Text weight="medium">Unchecked disabled</Text>
					</CheckboxCard>
					<CheckboxCard isDisabled defaultSelected value="checked">
						<Text weight="medium">Checked disabled</Text>
					</CheckboxCard>
				</div>
			</DemoSection>

			{/* ── CheckboxCardGroup ── */}
			<DemoSection title="CheckboxCardGroup" description="Semantic group with consumer-owned grid layout.">
				<div className="flex flex-col gap-6">
					<CheckboxCardGroup color="sage">
						<Label>What kind of support are you looking for?</Label>
						<div className="mt-2 grid grid-cols-3 gap-3">
							{HELP_CATEGORIES.map(cat => (
								<CheckboxCard key={cat.value} value={cat.value}>
									<section className="flex flex-col gap-1">
										<div className="flex items-center gap-2">
											<span className="text-[length:var(--text-3)]">{cat.icon}</span>
											<Text weight="medium">{cat.label}</Text>
										</div>
										<Text size={1} color="gray">{cat.description}</Text>
									</section>
								</CheckboxCard>
							))}
						</div>
					</CheckboxCardGroup>

					<Text size={2} weight="medium" color="gray">Card variants:</Text>
					{VARIANTS.map(variant => (
						<CheckboxCardGroup key={variant} variant={variant} color="terracotta" className="grid grid-cols-3 gap-3">
							{HELP_CATEGORIES.slice(0, 3).map((cat, i) => (
								<CheckboxCard key={cat.value} value={cat.value} defaultSelected={i === 0}>
									<div className="flex items-center gap-2">
										<span>{cat.icon}</span>
										<Text weight="medium">{cat.label}</Text>
									</div>
								</CheckboxCard>
							))}
						</CheckboxCardGroup>
					))}
				</div>
			</DemoSection>
		</div>
	);
}

export const Route = createFileRoute("/showcase/checkbox-card")({
	component: CheckboxCardPage,
});
