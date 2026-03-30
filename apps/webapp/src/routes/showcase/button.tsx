import {
	ArrowDownTrayIcon,
	Cog6ToothIcon,
	PencilIcon,
	PlusIcon,
	TrashIcon,
} from "@heroicons/react/24/solid";
import { Button, LoaderIcon } from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";

import { DemoSection, PageHeader, Playground, PropTable } from "./-components";
import { Anatomy, CodeExample, DocSection, FeatureList, UsageGuidelines } from "./-doc-components";

const COLORS = ["terracotta", "sage", "yellow", "gray", "red", "amber"] as const;
const VARIANTS = ["solid", "soft", "outline", "ghost"] as const;
const SIZES = [1, 2, 3, 4] as const;
const ICON_MODES = ["none", "leading", "only", "loading"] as const;
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

			{/* ── Playground ── */}

			<Playground
				componentName="Button"
				childrenLabel={(values) => {
					const iconSize = ICON_SIZES[values.size as number] ?? "size-5";
					switch (values.iconMode) {
						case "leading":
							return `<PlusIcon className="${iconSize}" />\n  Button`;
						case "only":
							return `<PencilIcon className="${iconSize}" />`;
						case "loading":
							return `<LoaderIcon className="${iconSize}" />\n  Saving...`;
						default:
							return "Button";
					}
				}}
				defaults={{ variant: "solid", size: 2, color: "terracotta", iconMode: "none", isDisabled: false }}
				controls={[
					{ name: "variant", type: "segment", options: VARIANTS },
					{ name: "size", type: "segment", options: SIZES },
					{ name: "color", type: "segment", options: COLORS },
					{ name: "iconMode", type: "segment", options: ICON_MODES },
					{ name: "isDisabled", type: "toggle" },
				]}
				snippetExclude={["iconMode"]}
				snippetExtraProps={(values) => {
					const extras: string[] = [];
					if (values.iconMode === "only")
						extras.push("icon", "aria-label=\"Edit\"");
					if (values.iconMode === "loading")
						extras.push("isDisabled");
					return extras;
				}}
			>
				{(props) => {
					const iconSize = ICON_SIZES[props.size as number] ?? "size-5";
					const shared = {
						variant: props.variant as any,
						size: props.size as any,
						color: props.color as any,
					};

					if (props.iconMode === "only") {
						return (
							<Button {...shared} icon aria-label="Edit" isDisabled={props.isDisabled as boolean}>
								<PencilIcon className={iconSize} />
							</Button>
						);
					}

					return (
						<Button {...shared} isDisabled={(props.isDisabled as boolean) || props.iconMode === "loading"}>
							{props.iconMode === "loading" && <LoaderIcon className={iconSize} />}
							{props.iconMode === "leading" && <PlusIcon className={iconSize} />}
							{props.iconMode === "loading" ? "Saving..." : "Button"}
						</Button>
					);
				}}
			</Playground>

			{/* ── Anatomy ── */}

			<Anatomy
				parts={[
					{ label: "Button", description: "The root interactive element. Wraps react-aria-components Button for keyboard, focus, and ARIA support." },
					{ label: "children", description: "Text label, icon, or both. When icon prop is true, children should be a single icon element." },
				]}
			>
				<Button>Save changes</Button>
			</Anatomy>

			{/* ── Features ── */}

			<FeatureList
				features={[
					"Four visual variants (solid, soft, outline, ghost) for different emphasis levels.",
					"Four sizes that match TextField input heights for seamless inline alignment.",
					"Six palette colors with automatic hover, press, and focus-visible states.",
					"Icon-only mode that enforces square dimensions and requires aria-label.",
					"Built on react-aria-components for full keyboard navigation and screen reader support.",
				]}
			/>

			{/* ── Usage Guidelines ── */}

			<UsageGuidelines
				description="Choose variants based on visual hierarchy. Use solid for the primary action in a section, then step down through soft, outline, and ghost for secondary and tertiary actions."
				guidelines={[
					{ type: "do", text: "Use one solid button per section as the primary call-to-action." },
					{ type: "do", text: "Pair solid + ghost for primary/cancel action pairs." },
					{ type: "do", text: "Always provide aria-label for icon-only buttons." },
					{ type: "do", text: "Use red color for destructive actions (delete, remove)." },
					{ type: "dont", text: "Don't place multiple solid buttons side-by-side — it creates competing focal points." },
					{ type: "dont", text: "Don't use ghost variant for primary actions — it lacks visual weight." },
					{ type: "dont", text: "Don't use Button for navigation — use the Link component instead." },
					{ type: "dont", text: "Don't disable buttons without explanation — prefer showing why the action is unavailable." },
				]}
			/>

			{/* ── Examples ── */}

			<DocSection title="Examples">
				<div className="flex flex-col gap-8">
					<CodeExample
						title="Primary + Secondary Pair"
						description="Use solid for the primary action and ghost for the secondary. This creates a clear visual hierarchy."
						code={`<div className="flex gap-3">
  <Button variant="solid">Save changes</Button>
  <Button variant="ghost">Cancel</Button>
</div>`}
					>
						<div className="flex gap-3">
							<Button variant="solid">Save changes</Button>
							<Button variant="ghost">Cancel</Button>
						</div>
					</CodeExample>

					<CodeExample
						title="Icon Buttons"
						description="Square icon-only buttons for toolbars and compact UI. Always provide aria-label for accessibility."
						code={`<div className="flex gap-2">
  <Button icon variant="soft" aria-label="Edit">
    <PencilIcon className="size-5" />
  </Button>
  <Button icon variant="soft" aria-label="Delete" color="red">
    <TrashIcon className="size-5" />
  </Button>
  <Button icon variant="soft" aria-label="Settings" color="gray">
    <Cog6ToothIcon className="size-5" />
  </Button>
</div>`}
					>
						<div className="flex gap-2">
							<Button icon variant="soft" aria-label="Edit">
								<PencilIcon className="size-5" />
							</Button>
							<Button icon variant="soft" aria-label="Delete" color="red">
								<TrashIcon className="size-5" />
							</Button>
							<Button icon variant="soft" aria-label="Settings" color="gray">
								<Cog6ToothIcon className="size-5" />
							</Button>
						</div>
					</CodeExample>

					<CodeExample
						title="Icon + Text"
						description="Combine an icon with a label for actions that benefit from both visual recognition and text clarity."
						code={`<div className="flex gap-3">
  <Button>
    <PlusIcon className="size-5" />
    Add item
  </Button>
  <Button variant="soft" color="sage">
    <ArrowDownTrayIcon className="size-5" />
    Export
  </Button>
</div>`}
					>
						<div className="flex gap-3">
							<Button>
								<PlusIcon className="size-5" />
								Add item
							</Button>
							<Button variant="soft" color="sage">
								<ArrowDownTrayIcon className="size-5" />
								Export
							</Button>
						</div>
					</CodeExample>

					<CodeExample
						title="Destructive Action"
						description="Use red color with solid variant for irreversible actions. Pair with a neutral cancel button."
						code={`<div className="flex gap-3">
  <Button color="red">Delete account</Button>
  <Button variant="ghost" color="gray">Cancel</Button>
</div>`}
					>
						<div className="flex gap-3">
							<Button color="red">Delete account</Button>
							<Button variant="ghost" color="gray">Cancel</Button>
						</div>
					</CodeExample>

					<CodeExample
						title="Loading State"
						description="Button doesn't have a built-in loading state. Combine LoaderIcon with isDisabled to prevent double-submission while showing progress."
						code={`<Button isDisabled>
  <LoaderIcon className="size-5" />
  Saving...
</Button>`}
					>
						<div className="flex gap-3">
							<Button isDisabled>
								<LoaderIcon className="size-5" />
								Saving...
							</Button>
							<Button variant="outline" isDisabled>
								<LoaderIcon className="size-5" />
								Loading
							</Button>
						</div>
					</CodeExample>

					<CodeExample
						title="Disabled State"
						description="Disabled buttons reduce opacity and prevent interaction. Consider showing why the action is unavailable instead of just disabling."
						code="<Button isDisabled>Submit</Button>"
					>
						<Button isDisabled>Submit</Button>
					</CodeExample>
				</div>
			</DocSection>

			{/* ── Visual Reference ── */}

			<DocSection title="Visual Reference">
				<div className="flex flex-col gap-8">
					<DemoSection title="Variant" description="Four visual styles for different levels of emphasis.">
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
			</DocSection>

			{/* ── API Reference ── */}

			<DocSection title="API Reference">
				<PropTable data={PROPS} />
			</DocSection>
		</div>
	);
}

export const Route = createFileRoute("/showcase/button")({
	component: ButtonPage,
});
