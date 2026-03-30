import { Card, Text } from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";

import { DemoSection, PageHeader, Playground, PropTable } from "./-components";
import { Anatomy, CodeExample, DocSection, FeatureList, UsageGuidelines } from "./-doc-components";

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

			{/* ── Playground ── */}

			<Playground
				componentName="Text"
				childrenLabel="The quick brown fox jumps over the lazy dog"
				defaults={{ size: 3, weight: "regular", color: "gray", highContrast: false, trim: "normal" }}
				controls={[
					{ name: "size", type: "segment", options: SIZES },
					{ name: "weight", type: "segment", options: WEIGHTS },
					{ name: "color", type: "segment", options: COLORS },
					{ name: "trim", type: "segment", options: TRIMS },
					{ name: "highContrast", type: "toggle" },
				]}
			>
				{props => (
					<Text
						size={props.size as any}
						weight={props.weight as any}
						color={props.color as any}
						highContrast={props.highContrast as boolean}
						trim={props.trim as any}
					>
						The quick brown fox jumps over the lazy dog
					</Text>
				)}
			</Playground>

			{/* ── Anatomy ── */}

			<Anatomy
				parts={[
					{ label: "Text", description: "Typography component that renders as span by default. Configurable element type." },
					{ label: "elementType", description: "Can render as span, p, div, or label depending on semantic context." },
				]}
			>
				<Text>The quick brown fox jumps over the lazy dog</Text>
			</Anatomy>

			{/* ── Features ── */}

			<FeatureList
				features={[
					"Nine-step type scale (1-9) shared with Heading and Link.",
					"Four font weights (light, regular, medium, bold).",
					"Six palette colors with low-contrast (step 11) and high-contrast (step 12) modes.",
					"Four trim options for leading trim (normal, start, end, both) for precise vertical alignment.",
					"Configurable element type (span, p, div, label) for correct semantics.",
				]}
			/>

			{/* ── Usage Guidelines ── */}

			<UsageGuidelines
				description="Text is the foundational typography component. Use it for body copy, captions, labels, and any non-heading text content."
				guidelines={[
					{ type: "do", text: "Use elementType='p' for paragraphs and elementType='span' for inline text." },
					{ type: "do", text: "Use trim='both' when Text is inside containers needing precise vertical spacing (badges, buttons)." },
					{ type: "do", text: "Use highContrast sparingly — for key information that needs to stand out." },
					{ type: "do", text: "Use sizes 1-2 for captions, 3 for body text, 4-5 for large body or intros." },
					{ type: "dont", text: "Don't use Text for headings — use the Heading component for semantic heading elements." },
					{ type: "dont", text: "Don't use sizes 6-9 for body text — those are display sizes and should typically be Headings." },
					{ type: "dont", text: "Don't set highContrast on every Text — it loses its emphasis effect." },
				]}
			/>

			{/* ── Examples ── */}

			<DocSection title="Examples">
				<div className="flex flex-col gap-8">
					<CodeExample
						title="Body Paragraph"
						description="Use elementType=&quot;p&quot; for block-level paragraph text. Renders a semantic <p> element instead of the default <span>."
						code={`<Text elementType="p" size={3}>
  When a neighbour posts a request — a ride to a
  medical appointment, help moving a couch, someone
  to walk their dog after surgery — the people who
  respond aren't strangers. They're two streets over.
</Text>`}
					>
						<div className="max-w-lg">
							<Text elementType="p" size={3}>
								When a neighbour posts a request — a ride to a
								medical appointment, help moving a couch, someone
								to walk their dog after surgery — the people who
								respond aren't strangers. They're two streets over.
							</Text>
						</div>
					</CodeExample>

					<CodeExample
						title="Type Hierarchy"
						description="Combine different sizes and weights to build clear visual hierarchy without Heading."
						code={`<div className="flex flex-col gap-2">
  <Text size={5} weight="medium" color="gray" highContrast>
    Building stronger neighbourhoods
  </Text>
  <Text elementType="p" size={3} color="gray">
    Small acts of help build the trust that holds a
    community together. Every request answered is a
    connection made.
  </Text>
  <Text size={1} color="gray">
    Community Stories · March 2026 · 5 min read
  </Text>
</div>`}
					>
						<div className="flex max-w-lg flex-col gap-2">
							<Text size={5} weight="medium" color="gray" highContrast>
								Building stronger neighbourhoods
							</Text>
							<Text elementType="p" size={3} color="gray">
								Small acts of help build the trust that holds a
								community together. Every request answered is a
								connection made.
							</Text>
							<Text size={1} color="gray">
								Community Stories · March 2026 · 5 min read
							</Text>
						</div>
					</CodeExample>

					<CodeExample
						title="Caption Text"
						description="Small sizes with muted color for timestamps, metadata, and secondary information."
						code={`<div className="flex items-center gap-1.5">
  <Text size={1} color="gray">Posted 3 hours ago</Text>
  <Text size={1} color="gray">·</Text>
  <Text size={1} color="sage">4 neighbours responded</Text>
</div>`}
					>
						<div className="flex items-center gap-1.5">
							<Text size={1} color="gray">Posted 3 hours ago</Text>
							<Text size={1} color="gray">·</Text>
							<Text size={1} color="sage">4 neighbours responded</Text>
						</div>
					</CodeExample>

					<CodeExample
						title="High-Contrast Comparison"
						description="highContrast steps up from color step 11 to step 12, making key information stand out against standard text."
						code={`<div className="flex flex-col gap-3">
  <div className="flex items-baseline gap-2">
    <Text size={3} color="gray" highContrast>
      Sarah
    </Text>
    <Text size={2} color="gray">
      offered to help with your request
    </Text>
  </div>
  <div className="flex items-baseline gap-2">
    <Text size={3} color="gray" highContrast>
      Marcus
    </Text>
    <Text size={2} color="gray">
      completed the task · 2 hours ago
    </Text>
  </div>
</div>`}
					>
						<div className="flex flex-col gap-3">
							<div className="flex items-baseline gap-2">
								<Text size={3} color="gray" highContrast>
									Sarah
								</Text>
								<Text size={2} color="gray">
									offered to help with your request
								</Text>
							</div>
							<div className="flex items-baseline gap-2">
								<Text size={3} color="gray" highContrast>
									Marcus
								</Text>
								<Text size={2} color="gray">
									completed the task · 2 hours ago
								</Text>
							</div>
						</div>
					</CodeExample>

					<CodeExample
						title="Leading Trim"
						description="Trim removes extra leading space so text sits flush against container edges — critical for tight card layouts."
						code={`{/* Without trim — notice the extra space above the title */}
<Card size={1}>
  <Text size={5} weight="medium" trim="normal">
    Request posted
  </Text>
  <Text size={2} color="gray" trim="normal">
    Extra whitespace above and below the text
  </Text>
</Card>

{/* With trim — text sits flush to the card padding */}
<Card size={1}>
  <Text size={5} weight="medium" trim="start">
    Request posted
  </Text>
  <Text size={2} color="gray" trim="end">
    Text sits tight against the container edges
  </Text>
</Card>`}
					>
						<div className="flex gap-6">
							<Card size={1}>
								<div className="flex flex-col gap-1">
									<Text size={5} weight="medium" trim="normal">
										Request posted
									</Text>
									<Text size={2} color="gray" trim="normal">
										Extra whitespace above and below
									</Text>
								</div>
							</Card>
							<Card size={1}>
								<div className="flex flex-col gap-1">
									<Text size={5} weight="medium" trim="start">
										Request posted
									</Text>
									<Text size={2} color="gray" trim="end">
										Text sits tight to the edges
									</Text>
								</div>
							</Card>
						</div>
					</CodeExample>
				</div>
			</DocSection>

			{/* ── Visual Reference ── */}

			<DocSection title="Visual Reference">
				<div className="flex flex-col gap-8">
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
									<div className="rounded-[var(--radius-2)] bg-gray-a3 px-3">
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
			</DocSection>

			{/* ── API Reference ── */}

			<DocSection title="API Reference">
				<PropTable data={PROPS} />
			</DocSection>
		</div>
	);
}

export const Route = createFileRoute("/showcase/text")({
	component: TextPage,
});
