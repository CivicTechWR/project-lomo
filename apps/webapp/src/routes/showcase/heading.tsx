import { Heading, Text } from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";

import { DemoSection, PageHeader, Playground, PropTable } from "./-components";

const COLORS = ["terracotta", "sage", "yellow", "gray", "red", "amber"] as const;
const LEVELS = [1, 2, 3, 4, 5, 6] as const;
const WEIGHTS = ["light", "regular", "medium", "bold"] as const;
const TRIMS = ["normal", "start", "end", "both"] as const;

const LEVEL_TO_SIZE: Record<number, number> = { 1: 8, 2: 7, 3: 6, 4: 5, 5: 4, 6: 3 };

const PROPS = [
	{ name: "level", type: "1 | 2 | 3 | 4 | 5 | 6", default: "3" },
	{ name: "size", type: "1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9", default: "auto from level" },
	{ name: "weight", type: "\"light\" | \"regular\" | \"medium\" | \"bold\"", default: "\"bold\"" },
	{ name: "color", type: "\"terracotta\" | \"sage\" | \"yellow\" | \"gray\" | \"red\" | \"amber\"", default: "\"gray\"" },
	{ name: "highContrast", type: "boolean", default: "true" },
	{ name: "trim", type: "\"normal\" | \"start\" | \"end\" | \"both\"", default: "\"normal\"" },
];

function HeadingPage() {
	return (
		<div className="flex flex-col gap-10">
			<PageHeader
				title="Heading"
				description="Semantic heading element with automatic size mapping from HTML level. Supports size override, weight, color, and leading trim."
			/>

			<Playground
				componentName="Heading"
				childrenLabel="The quick brown fox jumps over the lazy dog"
				defaults={{ level: 3, weight: "bold", color: "gray", highContrast: true, trim: "normal" }}
				controls={[
					{ name: "level", type: "segment", options: LEVELS },
					{ name: "weight", type: "segment", options: WEIGHTS },
					{ name: "color", type: "segment", options: COLORS },
					{ name: "trim", type: "segment", options: TRIMS },
					{ name: "highContrast", type: "toggle" },
				]}
			>
				{props => (
					<Heading
						level={props.level as any}
						weight={props.weight as any}
						color={props.color as any}
						highContrast={props.highContrast as boolean}
						trim={props.trim as any}
					>
						The quick brown fox jumps over the lazy dog
					</Heading>
				)}
			</Playground>

			<PropTable data={PROPS} />

			<DemoSection
				title="Level"
				description="Each heading level maps to a default visual size: h1→8, h2→7, h3→6, h4→5, h5→4, h6→3."
			>
				<div className="flex flex-col gap-4">
					{LEVELS.map(level => (
						<div key={level} className="flex items-baseline gap-3">
							<Text size={1} color="gray" className="w-20 shrink-0 font-mono">
								h
								{level}
								{" "}
								→ size
								{" "}
								{LEVEL_TO_SIZE[level]}
							</Text>
							<Heading level={level}>
								Heading level
								{" "}
								{level}
							</Heading>
						</div>
					))}
				</div>
			</DemoSection>

			<DemoSection
				title="Size Override"
				description="The size prop overrides the default size derived from level."
			>
				<div className="flex flex-col gap-2">
					<Heading level={3} size={9}>
						h3 with size 9
					</Heading>
					<Heading level={3} size={2}>
						h3 with size 2
					</Heading>
				</div>
			</DemoSection>

			<DemoSection title="Weight" description="Four weights for different heading emphasis.">
				<div className="flex flex-col gap-3">
					{WEIGHTS.map(weight => (
						<Heading key={weight} level={3} weight={weight}>
							{weight.charAt(0).toUpperCase() + weight.slice(1)}
							{" "}
							weight
						</Heading>
					))}
				</div>
			</DemoSection>

			<DemoSection title="Color" description="Available color options at high contrast (default).">
				<div className="flex flex-col gap-3">
					{COLORS.map(color => (
						<Heading key={color} level={4} color={color}>
							{color.charAt(0).toUpperCase() + color.slice(1)}
						</Heading>
					))}
				</div>
			</DemoSection>

			<DemoSection title="High Contrast" description="Standard contrast (step 11) vs high contrast (step 12).">
				<div className="flex flex-col gap-4">
					{COLORS.map(color => (
						<div key={color} className="flex flex-wrap items-center gap-6">
							<Heading level={4} color={color} highContrast={false}>
								{color}
								{" "}
								standard
							</Heading>
							<Heading level={4} color={color}>
								{color}
								{" "}
								high contrast
							</Heading>
						</div>
					))}
				</div>
			</DemoSection>

			<DemoSection
				title="Trim"
				description="Leading trim removes whitespace above and below the heading. The background shows the container boundary."
			>
				<div className="flex flex-wrap items-start gap-6">
					{TRIMS.map(trim => (
						<div key={trim} className="flex flex-col items-center gap-2">
							<div className="bg-gray-a3 rounded-[var(--radius-2)] px-3">
								<Heading level={4} trim={trim}>
									{trim}
								</Heading>
							</div>
							<Text size={1} color="gray">{trim}</Text>
						</div>
					))}
				</div>
			</DemoSection>
		</div>
	);
}

export const Route = createFileRoute("/showcase/heading")({
	component: HeadingPage,
});
