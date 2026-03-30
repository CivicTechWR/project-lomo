import {
	CheckboxCard,
	CheckboxCardGroup,
	Label,
	Text,
} from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";

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

function CheckboxCardPage() {
	return (
		<div className="flex flex-col gap-10">
			<PageHeader
				title="Checkbox Card"
				description="Card-style selection control for multi-option grids."
			/>

			<Playground
				componentName="CheckboxCard"
				childrenLabel={"<Text weight=\"medium\">Option</Text>"}
				defaults={{ variant: "surface", size: 2, color: "terracotta", isDisabled: false, grouped: false }}
				controls={[
					{ name: "variant", type: "segment", options: VARIANTS },
					{ name: "size", type: "segment", options: SIZES },
					{ name: "color", type: "segment", options: COLORS },
					{ name: "isDisabled", type: "toggle" },
					{ name: "grouped", type: "toggle" },
				]}
			>
				{(props) => {
					const card = (label: string, value: string, selected?: boolean) => (
						<CheckboxCard
							variant={props.variant as "surface" | "classic"}
							size={props.size as 1 | 2 | 3}
							color={props.color as any}
							isDisabled={props.isDisabled as boolean}
							defaultSelected={selected}
							value={value}
						>
							<Text weight="medium">{label}</Text>
						</CheckboxCard>
					);

					if (props.grouped) {
						return (
							<CheckboxCardGroup
								variant={props.variant as "surface" | "classic"}
								size={props.size as 1 | 2 | 3}
								color={props.color as any}
								columns="repeat(3, 1fr)"
							>
								<Label>Choose categories</Label>
								{card("Housing", "housing", true)}
								{card("Food", "food")}
								{card("Transport", "transport")}
							</CheckboxCardGroup>
						);
					}

					return card("Option", "demo", true);
				}}
			</Playground>

			<PropTable data={CHECKBOX_CARD_PROPS} />

			{/* ── Variants ── */}
			<DemoSection title="Variant" description="Two visual styles for the card container.">
				<div className="grid grid-cols-2 gap-3">
					{VARIANTS.map(variant => (
						<CheckboxCard key={variant} variant={variant} defaultSelected value={variant}>
							<Text weight="medium">{variant.charAt(0).toUpperCase() + variant.slice(1)}</Text>
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
			<DemoSection title="CheckboxCardGroup" description="Grid layout group with label and responsive columns.">
				<div className="flex flex-col gap-6">
					<CheckboxCardGroup variant="surface" color="terracotta" columns="repeat(3, 1fr)">
						<Label>What kind of help are you looking for?</Label>
						<CheckboxCard value="housing">
							<section className="flex flex-col gap-2">
								<Text weight="medium">Housing</Text>
								<Text size={1} color="gray">Find housing support</Text>
							</section>
						</CheckboxCard>
						<CheckboxCard value="food">
							<section className="flex flex-col gap-2">
								<Text weight="medium">Food</Text>
								<Text size={1} color="gray">Food bank access</Text>
							</section>
						</CheckboxCard>
						<CheckboxCard value="transport">
							<section className="flex flex-col gap-2">
								<Text weight="medium">Transport</Text>
								<Text size={1} color="gray">Transit assistance</Text>
							</section>
						</CheckboxCard>
					</CheckboxCardGroup>

					<Text size={2} weight="medium" color="gray">Card variants:</Text>
					{VARIANTS.map(variant => (
						<CheckboxCardGroup key={variant} variant={variant} color="sage" columns="repeat(3, 1fr)">
							<CheckboxCard value="a">
								<Text weight="medium">{variant.charAt(0).toUpperCase() + variant.slice(1)}</Text>
							</CheckboxCard>
							<CheckboxCard value="b" defaultSelected>
								<Text weight="medium">Selected</Text>
							</CheckboxCard>
							<CheckboxCard value="c">
								<Text weight="medium">Option C</Text>
							</CheckboxCard>
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
