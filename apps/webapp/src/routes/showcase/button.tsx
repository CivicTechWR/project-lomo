import { PencilIcon } from "@heroicons/react/24/solid";
import { Button } from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";

import { DemoSection, PageHeader, Playground, PropTable } from "./-components";

const COLORS = ["terracotta", "sage", "yellow", "gray", "red", "amber"] as const;
const VARIANTS = ["solid", "soft", "outline", "ghost"] as const;
const SIZES = [1, 2, 3, 4] as const;
const ICON_SIZES: Record<number, string> = { 1: "size-4", 2: "size-5", 3: "size-5", 4: "size-6" };

const PROPS = [
	{ name: "variant", type: "\"solid\" | \"soft\" | \"outline\" | \"ghost\"", default: "\"solid\"" },
	{ name: "size", type: "1 | 2 | 3 | 4", default: "2" },
	{ name: "color", type: "\"terracotta\" | \"sage\" | \"yellow\" | \"gray\" | \"red\" | \"amber\"", default: "\"terracotta\"" },
	{ name: "icon", type: "boolean", default: "false" },
	{ name: "isDisabled", type: "boolean", default: "false" },
];

function ButtonPage() {
	return (
		<div className="flex flex-col gap-10">
			<PageHeader
				title="Button"
				description="Triggers an action or event, such as submitting a form or opening a dialog."
			/>

			<Playground
				componentName="Button"
				childrenLabel={values => values.icon ? "<PencilIcon className=\"size-5\" />" : "Button"}
				defaults={{ variant: "solid", size: 2, color: "terracotta", icon: false, isDisabled: false }}
				controls={[
					{ name: "variant", type: "segment", options: VARIANTS },
					{ name: "size", type: "segment", options: SIZES },
					{ name: "color", type: "segment", options: COLORS },
					{ name: "icon", type: "toggle" },
					{ name: "isDisabled", type: "toggle" },
				]}
			>
				{props => (
					<Button
						variant={props.variant as any}
						size={props.size as any}
						color={props.color as any}
						icon={props.icon as any}
						isDisabled={props.isDisabled as boolean}
						aria-label={props.icon ? "Edit" : undefined}
					>
						{props.icon
							? <PencilIcon className={ICON_SIZES[props.size as number] ?? "size-5"} />
							: "Button"}
					</Button>
				)}
			</Playground>

			<PropTable data={PROPS} />

			<DemoSection title="Variant" description="Four visual treatments for different levels of emphasis.">
				<div className="flex flex-wrap items-center gap-3">
					{VARIANTS.map(variant => (
						<Button key={variant} variant={variant}>
							{variant.charAt(0).toUpperCase() + variant.slice(1)}
						</Button>
					))}
				</div>
			</DemoSection>

			<DemoSection title="Size" description="Four sizes for different contexts and density requirements.">
				<div className="flex flex-wrap items-end gap-3">
					{SIZES.map(size => (
						<Button key={size} size={size}>
							Size
							{" "}
							{size}
						</Button>
					))}
				</div>
			</DemoSection>

			<DemoSection title="Color" description="Available color options shown in the solid variant.">
				<div className="flex flex-wrap items-center gap-3">
					{COLORS.map(color => (
						<Button key={color} color={color}>
							{color.charAt(0).toUpperCase() + color.slice(1)}
						</Button>
					))}
				</div>
			</DemoSection>

			<DemoSection title="Icon" description="Square icon-only buttons across all sizes. Requires aria-label for accessibility.">
				<div className="flex flex-wrap items-end gap-3">
					{SIZES.map(size => (
						<Button key={size} size={size} icon aria-label="Edit">
							<PencilIcon className={ICON_SIZES[size]} />
						</Button>
					))}
				</div>
			</DemoSection>

			<DemoSection title="Variant × Color" description="All variant and color combinations.">
				<div className="flex flex-col gap-4">
					{VARIANTS.map(variant => (
						<div key={variant} className="flex flex-wrap items-center gap-3">
							{COLORS.map(color => (
								<Button key={color} variant={variant} color={color}>
									{color.charAt(0).toUpperCase() + color.slice(1)}
								</Button>
							))}
						</div>
					))}
				</div>
			</DemoSection>

			<DemoSection title="Icon × Variant" description="Icon buttons across all variants.">
				<div className="flex flex-wrap items-center gap-3">
					{VARIANTS.map(variant => (
						<Button key={variant} variant={variant} icon aria-label="Edit">
							<PencilIcon className="size-5" />
						</Button>
					))}
				</div>
			</DemoSection>

			<DemoSection title="Disabled" description="Disabled state across all variants.">
				<div className="flex flex-wrap items-center gap-3">
					{VARIANTS.map(variant => (
						<Button key={variant} variant={variant} isDisabled>
							{variant.charAt(0).toUpperCase() + variant.slice(1)}
						</Button>
					))}
				</div>
			</DemoSection>
		</div>
	);
}

export const Route = createFileRoute("/showcase/button")({
	component: ButtonPage,
});
