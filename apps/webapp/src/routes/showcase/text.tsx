import { Text } from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";

import { DemoSection, PageHeader, PropTable } from "./-components";

const COLORS = ["terracotta", "sage", "yellow", "gray", "red", "amber"] as const;
const SIZES = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const WEIGHTS = ["light", "regular", "medium", "bold"] as const;
const TRIMS = ["normal", "start", "end", "both"] as const;

const PROPS = [
	{ name: "size", type: "1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9", default: "3" },
	{ name: "weight", type: "\"light\" | \"regular\" | \"medium\" | \"bold\"", default: "\"regular\"" },
	{ name: "color", type: "\"terracotta\" | \"sage\" | \"yellow\" | \"gray\" | \"red\" | \"amber\"", default: "\"gray\"" },
	{ name: "highContrast", type: "boolean", default: "false" },
	{ name: "trim", type: "\"normal\" | \"start\" | \"end\" | \"both\"", default: "\"normal\"" },
	{ name: "elementType", type: "\"span\" | \"p\" | \"div\" | \"label\"", default: "—" },
];

function TextPage() {
	return (
		<div className="flex flex-col gap-10">
			<PageHeader
				title="Text"
				description="Renders inline or block text with typographic controls for size, weight, color, and leading trim."
			/>

			<PropTable data={PROPS} />

			<DemoSection title="Size" description="Nine sizes from fine print to display text.">
				<div className="flex flex-col gap-3">
					{SIZES.map(size => (
						<Text key={size} size={size}>
							Size
							{" "}
							{size}
							{" "}
							— The quick brown fox jumps over the lazy dog
						</Text>
					))}
				</div>
			</DemoSection>

			<DemoSection title="Weight" description="Four weights for typographic emphasis.">
				<div className="flex flex-col gap-3">
					{WEIGHTS.map(weight => (
						<Text key={weight} size={4} weight={weight}>
							{weight.charAt(0).toUpperCase() + weight.slice(1)}
							{" "}
							— The quick brown fox
						</Text>
					))}
				</div>
			</DemoSection>

			<DemoSection title="Color" description="Text rendered in each available color at standard contrast.">
				<div className="flex flex-col gap-3">
					{COLORS.map(color => (
						<Text key={color} size={3} color={color}>
							{color.charAt(0).toUpperCase() + color.slice(1)}
							{" "}
							— The quick brown fox jumps over the lazy dog
						</Text>
					))}
				</div>
			</DemoSection>

			<DemoSection title="High Contrast" description="Standard contrast (step 11) vs high contrast (step 12).">
				<div className="flex flex-col gap-4">
					{COLORS.map(color => (
						<div key={color} className="flex flex-wrap items-center gap-6">
							<Text size={3} color={color}>
								{color}
								{" "}
								standard
							</Text>
							<Text size={3} color={color} highContrast>
								{color}
								{" "}
								high contrast
							</Text>
						</div>
					))}
				</div>
			</DemoSection>

			<DemoSection
				title="Trim"
				description="Leading trim removes whitespace above and below text. The background shows the container boundary."
			>
				<div className="flex flex-wrap items-start gap-6">
					{TRIMS.map(trim => (
						<div key={trim} className="flex flex-col items-center gap-2">
							<div className="bg-gray-a3 rounded-[var(--radius-2)] px-3">
								<Text size={5} trim={trim}>
									{trim}
								</Text>
							</div>
							<Text size={1} color="gray">{trim}</Text>
						</div>
					))}
				</div>
			</DemoSection>
		</div>
	);
}

export const Route = createFileRoute("/showcase/text")({
	component: TextPage,
});
