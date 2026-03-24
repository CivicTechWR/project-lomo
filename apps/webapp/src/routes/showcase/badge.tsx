import { Badge } from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";

import { DemoSection, PageHeader, PropTable } from "./-components";

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

			<PropTable data={PROPS} />

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
	);
}

export const Route = createFileRoute("/showcase/badge")({
	component: BadgePage,
});
