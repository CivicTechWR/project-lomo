import { Badge } from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";

import { DemoSection, PageHeader, Playground, PropTable } from "./-components";
import { Anatomy, CodeExample, DocSection, FeatureList, UsageGuidelines } from "./-doc-components";

const COLORS = ["terracotta", "sage", "yellow", "gray", "red", "amber"] as const;
const VARIANTS = ["solid", "soft", "surface", "outline"] as const;
const SIZES = [1, 2, 3] as const;

const PROPS = [
	{ name: "variant", type: "\"solid\" | \"soft\" | \"surface\" | \"outline\"", default: "\"soft\"" },
	{ name: "size", type: "1 | 2 | 3", default: "2" },
	{ name: "color", type: "\"terracotta\" | \"sage\" | \"yellow\" | \"gray\" | \"red\" | \"amber\"", default: "\"gray\"" },
	{ name: "highContrast", type: "boolean", default: "false" },
];

function BadgePage() {
	return (
		<div className="flex flex-col gap-10">
			<PageHeader
				title="Badge"
				description="Displays a short status indicator, count, or label."
			/>

			{/* ── Playground ── */}

			<Playground
				componentName="Badge"
				childrenLabel="Badge"
				defaults={{ variant: "soft", size: 2, color: "gray", highContrast: false }}
				controls={[
					{ name: "variant", type: "segment", options: VARIANTS },
					{ name: "size", type: "segment", options: SIZES },
					{ name: "color", type: "segment", options: COLORS },
					{ name: "highContrast", type: "toggle" },
				]}
			>
				{props => (
					<Badge
						variant={props.variant as any}
						size={props.size as any}
						color={props.color as any}
						highContrast={props.highContrast as boolean}
					>
						Badge
					</Badge>
				)}
			</Playground>

			{/* ── Anatomy ── */}

			<Anatomy
				parts={[
					{ label: "Badge", description: "Inline-flex span container. Uses pill radius for automatic rounding." },
					{ label: "children", description: "Text content. Keep short — 1-3 words." },
				]}
			>
				<Badge>Label</Badge>
			</Anatomy>

			{/* ── Features ── */}

			<FeatureList
				features={[
					"Four visual variants (solid, soft, surface, outline) for different weight levels.",
					"Three sizes for density control.",
					"Six palette colors for semantic meaning.",
					"High-contrast mode for stronger visual emphasis and accessibility.",
					"Pill radius behavior — always rounds fully regardless of radius preset.",
				]}
			/>

			{/* ── Usage Guidelines ── */}

			<UsageGuidelines
				description="Select variants by visual weight. Solid for critical statuses, soft as the default label style, surface for subtle annotations, outline for tag-like labels."
				guidelines={[
					{ type: "do", text: "Keep badge text short — 1-3 words maximum." },
					{ type: "do", text: "Use highContrast for important statuses that need to stand out." },
					{ type: "do", text: "Use semantic colors — red for errors, yellow for warnings, sage for success, gray for neutral." },
					{ type: "do", text: "Use Badge for categorical labels, counts, or status indicators." },
					{ type: "dont", text: "Don't use badges for sentences or long text." },
					{ type: "dont", text: "Don't put interactive elements inside a badge — it's a display component." },
					{ type: "dont", text: "Don't mix badge variants in the same context — pick one style and be consistent." },
				]}
			/>

			{/* ── Examples ── */}

			<DocSection title="Examples">
				<div className="flex flex-col gap-8">
					<CodeExample
						title="Status Indicators"
						description="Use color and variant to convey status at a glance."
						code={`<div className="flex gap-2">
  <Badge color="sage" variant="soft">Active</Badge>
  <Badge color="yellow" variant="soft">Pending</Badge>
  <Badge color="red" variant="solid">Error</Badge>
</div>`}
					>
						<div className="flex gap-2">
							<Badge color="sage" variant="soft">Active</Badge>
							<Badge color="yellow" variant="soft">Pending</Badge>
							<Badge color="red" variant="solid">Error</Badge>
						</div>
					</CodeExample>

					<CodeExample
						title="Notification Count"
						description="Small solid badge for unread counts or numeric indicators."
						code={`<Badge variant="solid" size={1} color="red">3</Badge>`}
					>
						<Badge variant="solid" size={1} color="red">3</Badge>
					</CodeExample>

					<CodeExample
						title="Tag List"
						description="Outline badges work well as lightweight category tags."
						code={`<div className="flex gap-2">
  <Badge variant="outline">React</Badge>
  <Badge variant="outline">TypeScript</Badge>
  <Badge variant="outline">Tailwind</Badge>
</div>`}
					>
						<div className="flex gap-2">
							<Badge variant="outline">React</Badge>
							<Badge variant="outline">TypeScript</Badge>
							<Badge variant="outline">Tailwind</Badge>
						</div>
					</CodeExample>

					<CodeExample
						title="High-Contrast Comparison"
						description="High-contrast mode increases text contrast for better readability and emphasis."
						code={`<div className="flex gap-2">
  <Badge color="terracotta">Standard</Badge>
  <Badge color="terracotta" highContrast>High contrast</Badge>
</div>`}
					>
						<div className="flex gap-2">
							<Badge color="terracotta">Standard</Badge>
							<Badge color="terracotta" highContrast>High contrast</Badge>
						</div>
					</CodeExample>
				</div>
			</DocSection>

			{/* ── Visual Reference ── */}

			<DocSection title="Visual Reference">
				<div className="flex flex-col gap-8">
					<DemoSection title="Variant" description="Four visual styles for different contexts.">
						<div className="flex flex-wrap items-center gap-3">
							{VARIANTS.map(variant => (
								<Badge key={variant} variant={variant}>
									{variant.charAt(0).toUpperCase() + variant.slice(1)}
								</Badge>
							))}
						</div>
					</DemoSection>

					<DemoSection title="Size" description="Three sizes to fit different information densities.">
						<div className="flex flex-wrap items-center gap-3">
							{SIZES.map(size => (
								<Badge key={size} size={size}>
									Size
									{" "}
									{size}
								</Badge>
							))}
						</div>
					</DemoSection>

					<DemoSection title="Color" description="Available color options shown in the soft variant.">
						<div className="flex flex-wrap items-center gap-3">
							{COLORS.map(color => (
								<Badge key={color} color={color}>
									{color.charAt(0).toUpperCase() + color.slice(1)}
								</Badge>
							))}
						</div>
					</DemoSection>

					<DemoSection title="Variant × Color" description="All variant and color combinations.">
						<div className="flex flex-col gap-4">
							{VARIANTS.map(variant => (
								<div key={variant} className="flex flex-wrap items-center gap-3">
									{COLORS.map(color => (
										<Badge key={color} variant={variant} color={color}>
											{color.charAt(0).toUpperCase() + color.slice(1)}
										</Badge>
									))}
								</div>
							))}
						</div>
					</DemoSection>

					<DemoSection title="High Contrast" description="Standard vs high-contrast text for each variant.">
						<div className="flex flex-col gap-4">
							{VARIANTS.map(variant => (
								<div key={variant} className="flex flex-wrap items-center gap-3">
									<Badge variant={variant} color="terracotta">
										Standard
									</Badge>
									<Badge variant={variant} color="terracotta" highContrast>
										High contrast
									</Badge>
								</div>
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

export const Route = createFileRoute("/showcase/badge")({
	component: BadgePage,
});
