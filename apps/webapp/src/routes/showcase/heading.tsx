import { Card, Heading, Text } from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { DemoSection, PageHeader, Playground, PropTable } from "./-components";
import { Anatomy, CodeExample, DocSection, FeatureList, UsageGuidelines } from "./-doc-components";

const COLORS = ["terracotta", "sage", "yellow", "gray", "red", "amber"] as const;
const LEVELS = [1, 2, 3, 4, 5, 6] as const;
const SIZES = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const WEIGHTS = ["light", "regular", "medium", "bold"] as const;
const TRIMS = ["normal", "start", "end", "both"] as const;

const LEVEL_TO_SIZE: Record<number, number> = { 1: 9, 2: 8, 3: 7, 4: 6, 5: 5, 6: 4 };

const INDENT_CLASSES = ["pl-0", "pl-4", "pl-8", "pl-12", "pl-16", "pl-20"] as const;

const EXPLORER_HEADINGS: Record<number, string> = {
	1: "Community Help Board",
	2: "Active Requests",
	3: "Transportation",
	4: "Medical Appointments",
	5: "Ride Details",
	6: "Pickup Location",
};

const PROPS = [
	{ name: "level", type: "1 | 2 | 3 | 4 | 5 | 6", default: "3" },
	{ name: "size", type: "1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9", default: "auto from level" },
	{ name: "weight", type: "\"light\" | \"regular\" | \"medium\" | \"bold\"", default: "\"bold\"" },
	{ name: "color", type: "\"terracotta\" | \"sage\" | \"yellow\" | \"gray\" | \"red\" | \"amber\"", default: "\"gray\"" },
	{ name: "highContrast", type: "boolean", default: "true" },
	{ name: "trim", type: "\"normal\" | \"start\" | \"end\" | \"both\"", default: "\"normal\"" },
];

function HeadingPage() {
	const [sizes, setSizes] = useState<Record<number, number>>({ ...LEVEL_TO_SIZE });
	const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
	const hasAnyOverride = LEVELS.some(l => sizes[l] !== LEVEL_TO_SIZE[l]);

	function setSize(level: number, size: number) {
		setSizes(prev => ({ ...prev, [level]: size }));
	}

	function resetToDefaults() {
		setSizes({ ...LEVEL_TO_SIZE });
	}

	return (
		<div className="flex flex-col gap-10">
			<PageHeader
				title="Heading"
				description="Semantic heading element with automatic size mapping from HTML level. Supports size override, weight, color, and leading trim."
			/>

			{/* ── Playground ── */}

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

			{/* ── Anatomy ── */}

			<Anatomy
				parts={[
					{ label: "Heading", description: "Renders semantic heading elements (h1-h6). Wraps react-aria-components Heading for accessible document structure." },
					{ label: "level", description: "Sets the HTML element (h1-h6). Determines document outline hierarchy and default visual size." },
					{ label: "size", description: "Overrides visual size (1-9) independent of semantic level. When omitted, auto-maps from level." },
				]}
			>
				<Heading level={2}>Active Requests</Heading>
			</Anatomy>

			{/* ── Features ── */}

			<FeatureList
				features={[
					"Semantic heading levels (h1-h6) with automatic size mapping (h1→9, h2→8, h3→7, h4→6, h5→5, h6→4).",
					"Size override independent of semantic level — have an h2 that looks like an h4.",
					"Nine-step type scale shared with Text and Link.",
					"Three font weights (default: bold, unlike Text which defaults to regular).",
					"Six palette colors with high-contrast on by default (unlike Text which defaults to standard contrast).",
					"Four trim options for leading trim.",
				]}
			/>

			{/* ── Usage Guidelines ── */}

			<UsageGuidelines
				description="Heading sets both visual and semantic hierarchy. Level controls the HTML element, size controls the appearance. They can differ."
				guidelines={[
					{ type: "do", text: "Maintain logical heading order in the DOM (h1 → h2 → h3) for accessibility." },
					{ type: "do", text: "Use size override when visual hierarchy differs from document hierarchy." },
					{ type: "do", text: "Use Heading for section titles, page titles, and content structure." },
					{ type: "do", text: "Use weight='regular' or 'medium' for subheadings that need less visual dominance." },
					{ type: "dont", text: "Don't skip heading levels in the DOM hierarchy (e.g., h1 → h3 without h2)." },
					{ type: "dont", text: "Don't use Heading for decorative or non-heading text — use large Text instead." },
					{ type: "dont", text: "Don't use multiple h1 elements per page." },
				]}
			/>

			{/* ── Examples ── */}

			<DocSection title="Examples">
				<div className="flex flex-col gap-8">
					<CodeExample
						title="Page Title"
						description="Level 1 auto-maps to size 9. Use one h1 per page as the top-level content title."
						code="<Heading level={1}>Community Help Board</Heading>"
					>
						<Heading level={1}>Community Help Board</Heading>
					</CodeExample>

					<CodeExample
						title="Section Heading with Override"
						description="An h2 at size 5 — keeps the correct document outline while fitting a compact settings layout."
						code="<Heading level={2} size={5}>Notification preferences</Heading>"
					>
						<Heading level={2} size={5}>Notification preferences</Heading>
					</CodeExample>

					<CodeExample
						title="Page Composition"
						description="Headings create document structure. Screen readers and assistive tools use the h1→h2→h3 hierarchy to navigate the page — visual size is secondary."
						code={`<div className="flex flex-col gap-6">
  <Heading level={1}>Community Help Board</Heading>

  <div className="flex flex-col gap-3">
    <Heading level={2} size={5}>
      Active Requests
    </Heading>
    <Heading level={3} size={3} weight="medium">
      Transportation
    </Heading>
    <Text size={2} color="gray">
      3 neighbours need rides this week
    </Text>
  </div>

  <div className="flex flex-col gap-3">
    <Heading level={2} size={5}>
      Completed This Month
    </Heading>
    <Text size={2} color="sage">
      12 requests fulfilled by your community
    </Text>
  </div>
</div>`}
					>
						<div className="flex max-w-lg flex-col gap-6">
							<Heading level={1}>Community Help Board</Heading>

							<div className="flex flex-col gap-3">
								<Heading level={2} size={5}>
									Active Requests
								</Heading>
								<Heading level={3} size={3} weight="medium">
									Transportation
								</Heading>
								<Text size={2} color="gray">
									3 neighbours need rides this week
								</Text>
							</div>

							<div className="flex flex-col gap-3">
								<Heading level={2} size={5}>
									Completed This Month
								</Heading>
								<Text size={2} color="sage">
									12 requests fulfilled by your community
								</Text>
							</div>
						</div>
					</CodeExample>

					<CodeExample
						title="Card Title with Trim"
						description="Use trim to remove leading whitespace so the heading sits flush against card padding — no extra gap above the text."
						code={`<Card size={2}>
  <div className="flex flex-col gap-1">
    <Heading level={3} size={4} trim="start">
      Ride to medical appointment
    </Heading>
    <Text size={2} color="gray" trim="end">
      Downtown clinic · Tuesday 2:30 PM
    </Text>
  </div>
</Card>`}
					>
						<Card size={2}>
							<div className="flex flex-col gap-1">
								<Heading level={3} size={4} trim="start">
									Ride to medical appointment
								</Heading>
								<Text size={2} color="gray" trim="end">
									Downtown clinic · Tuesday 2:30 PM
								</Text>
							</div>
						</Card>
					</CodeExample>

					{/* ── Document Outline Explorer ── */}

					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between gap-4">
							<div className="flex flex-col gap-1">
								<Heading level={4} size={2} weight="medium">
									Level vs Size Explorer
								</Heading>
								<Text size={2} color="gray">
									Semantic level is fixed in the DOM — visual size is yours to control. Override any heading below to see the decoupling in action.
								</Text>
							</div>
							{hasAnyOverride && (
								<button
									type="button"
									onClick={resetToDefaults}
									className="shrink-0 rounded-[var(--radius-2)] bg-gray-3 px-3 py-1.5 text-[length:var(--text-1)] font-medium text-gray-11 transition-colors hover:bg-gray-4 hover:text-gray-12"
								>
									Reset to defaults
								</button>
							)}
						</div>

						<div className="grid grid-cols-1 gap-0 overflow-hidden rounded-lg border border-gray-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
							{/* Left panel — Document Outline */}
							<div className="border-b border-gray-6 bg-gray-2 p-4 lg:border-b-0 lg:border-r">
								<Text size={1} weight="medium" color="gray" className="mb-3 block uppercase tracking-widest">
									Document Outline
								</Text>
								<div className="flex flex-col gap-2.5">
									{LEVELS.map((level) => {
										const isOverridden = sizes[level] !== LEVEL_TO_SIZE[level];
										const isHovered = hoveredLevel === level;

										return (
											<div
												key={level}
												className={`flex flex-col gap-1.5 rounded-md p-2 transition-colors ${INDENT_CLASSES[level - 1]} ${isOverridden ? "bg-terracotta-a2" : isHovered ? "bg-gray-a3" : ""}`}
												onMouseEnter={() => setHoveredLevel(level)}
												onMouseLeave={() => setHoveredLevel(null)}
											>
												<div className="flex items-center gap-2">
													<code className="shrink-0 rounded bg-gray-a3 px-1.5 py-0.5 font-mono text-[length:var(--text-1)] text-gray-12">
														{`<h${level}>`}
													</code>
													<Text size={1} color="gray" className="shrink-0">
														→
													</Text>
													<Text
														size={1}
														weight={isOverridden ? "medium" : "regular"}
														color={isOverridden ? "terracotta" : "gray"}
														className="shrink-0 font-mono"
													>
														{`size ${sizes[level]}`}
													</Text>
													{isOverridden && (
														<span className="rounded-full bg-terracotta-a3 px-1.5 py-0 font-mono text-[length:var(--text-1)] text-terracotta-11">
															{`was ${LEVEL_TO_SIZE[level]}`}
														</span>
													)}
												</div>
												<div className="inline-flex gap-px rounded-md bg-gray-3 p-px">
													{SIZES.map((size) => {
														const isActive = sizes[level] === size;
														const isDefault = LEVEL_TO_SIZE[level] === size;
														return (
															<button
																key={size}
																type="button"
																onClick={() => setSize(level, size)}
																className={`min-w-6 rounded-[4px] px-1 py-0.5 text-[length:var(--text-1)] transition-colors ${
																	isActive
																		? isOverridden
																			? "bg-terracotta-3 font-medium text-terracotta-11 shadow-sm"
																			: "bg-white font-medium text-gray-12 shadow-sm"
																		: isDefault
																			? "text-gray-11 underline decoration-gray-8 underline-offset-2 hover:text-gray-12"
																			: "text-gray-11 hover:text-gray-12"
																}`}
															>
																{size}
															</button>
														);
													})}
												</div>
											</div>
										);
									})}
								</div>
							</div>

							{/* Right panel — Live Preview */}
							<div className="bg-gray-1 p-6">
								<Text size={1} weight="medium" color="gray" className="mb-4 block uppercase tracking-widest">
									Live Preview
								</Text>
								<div className="flex flex-col gap-3">
									{LEVELS.map((level) => {
										const isOverridden = sizes[level] !== LEVEL_TO_SIZE[level];
										const isHovered = hoveredLevel === level;

										return (
											<div
												key={level}
												className={`flex flex-col gap-1 rounded-lg p-3 transition-colors ${isOverridden ? "bg-terracotta-a2" : isHovered ? "bg-gray-a3" : ""}`}
												onMouseEnter={() => setHoveredLevel(level)}
												onMouseLeave={() => setHoveredLevel(null)}
											>
												<Text size={1} color="gray" className="font-mono">
													{`<h${level}>`}
													{" · "}
													{`size ${sizes[level]}`}
													{isOverridden ? ` (default: ${LEVEL_TO_SIZE[level]})` : ""}
												</Text>
												<Heading level={level} size={sizes[level] as any}>
													{EXPLORER_HEADINGS[level]}
												</Heading>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</div>
			</DocSection>

			{/* ── Visual Reference ── */}

			<DocSection title="Visual Reference">
				<div className="flex flex-col gap-8">
					<DemoSection
						title="Level"
						description="Each heading level maps to a default visual size: h1→9, h2→8, h3→7, h4→6, h5→5, h6→4."
					>
						<div className="flex flex-col gap-4">
							{LEVELS.map(level => (
								<div key={level} className="flex items-baseline gap-3">
									<Text size={1} color="gray" className="w-20 shrink-0 font-mono">
										{`h${level} → size ${LEVEL_TO_SIZE[level]}`}
									</Text>
									<Heading level={level}>
										{EXPLORER_HEADINGS[level]}
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
								h3 at size 9
							</Heading>
							<Heading level={3} size={2}>
								h3 at size 2
							</Heading>
						</div>
					</DemoSection>

					<DemoSection title="Weight" description="Four weights for different heading emphasis. Default is bold.">
						<div className="flex flex-col gap-3">
							{WEIGHTS.map(weight => (
								<Heading key={weight} level={3} weight={weight}>
									{`${weight.charAt(0).toUpperCase() + weight.slice(1)} weight`}
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

					<DemoSection title="High Contrast" description="Standard contrast (step 11) vs high contrast (step 12, default).">
						<div className="flex flex-col gap-4">
							{COLORS.map(color => (
								<div key={color} className="flex flex-wrap items-center gap-6">
									<Heading level={4} color={color} highContrast={false}>
										{`${color} standard`}
									</Heading>
									<Heading level={4} color={color}>
										{`${color} high contrast`}
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
									<div className="rounded-[var(--radius-2)] bg-gray-a3 px-3">
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
			</DocSection>

			{/* ── API Reference ── */}

			<DocSection title="API Reference">
				<PropTable data={PROPS} />
			</DocSection>
		</div>
	);
}

export const Route = createFileRoute("/showcase/heading")({
	component: HeadingPage,
});
