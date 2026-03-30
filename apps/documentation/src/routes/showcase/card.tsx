import {
	ArrowTrendingUpIcon,
	CalendarDaysIcon,
	ChatBubbleLeftRightIcon,
	CheckCircleIcon,
	ClockIcon,
	HandRaisedIcon,
	MapPinIcon,
	UserGroupIcon,
	UsersIcon,
} from "@heroicons/react/24/solid";
import { Badge, Button, Card, Heading, Text } from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";

import { DemoSection, PageHeader, Playground, PropTable } from "./-components";
import { Anatomy, CodeExample, DocSection, FeatureList, UsageGuidelines } from "./-doc-components";

const COLORS = ["terracotta", "sage", "yellow", "gray", "red", "amber"] as const;
const VARIANTS = ["ghost", "surface", "classic"] as const;
const SIZES = [1, 2, 3, 4, 5] as const;

const PROPS = [
	{ name: "variant", type: "\"ghost\" | \"surface\" | \"classic\"", default: "\"surface\"" },
	{ name: "size", type: "1 | 2 | 3 | 4 | 5", default: "1" },
	{ name: "color", type: "\"terracotta\" | \"sage\" | \"yellow\" | \"gray\" | \"red\" | \"amber\"", default: "\"gray\"" },
];

function CardPage() {
	return (
		<div className="flex flex-col gap-10">
			<PageHeader
				title="Card"
				description="Tonal surface container for grouping content."
			/>

			{/* ── Playground ── */}

			<Playground
				componentName="Card"
				childrenLabel="Card content"
				defaults={{ variant: "surface", size: 1, color: "gray" }}
				controls={[
					{ name: "variant", type: "segment", options: VARIANTS },
					{ name: "size", type: "segment", options: SIZES },
					{ name: "color", type: "segment", options: COLORS },
				]}
			>
				{props => (
					<Card
						variant={props.variant as any}
						size={props.size as any}
						color={props.color as any}
					>
						<Heading level={3} size={3} weight="medium">Card title</Heading>
						<Text size={2} color="gray">Card description text goes here.</Text>
					</Card>
				)}
			</Playground>

			{/* ── Anatomy ── */}

			<Anatomy
				parts={[
					{ label: "Card", description: "Block container div. Provides padding, border, radius, and background. No interactivity or ARIA semantics." },
					{ label: "children", description: "Any content. Card is layout-agnostic — internal layout is the consumer's responsibility." },
				]}
			>
				<Card variant="surface" size={3} className="w-80">
					<div className="flex flex-col gap-3">
						<div className="flex items-start justify-between">
							<div className="flex items-center gap-2">
								<CalendarDaysIcon className="size-5 text-terracotta-11" />
								<Heading level={3} size={3} weight="medium">Team standup</Heading>
							</div>
							<Badge variant="soft" color="sage" size={1}>Live</Badge>
						</div>
						<div className="flex flex-col gap-1">
							<div className="flex items-center gap-1.5">
								<ClockIcon className="size-3.5 text-gray-9" />
								<Text size={1} color="gray">9:00 AM — Daily sync</Text>
							</div>
							<div className="flex items-center gap-1.5">
								<UsersIcon className="size-3.5 text-gray-9" />
								<Text size={1} color="gray">4 members joined</Text>
							</div>
						</div>
						<Button variant="soft" size={1}>Join meeting</Button>
					</div>
				</Card>
			</Anatomy>

			{/* ── Features ── */}

			<FeatureList
				features={[
					"Three visual variants (ghost, surface, classic) for different elevation levels.",
					"Five sizes controlling the padding scale.",
					"Six palette colors for accent tinting.",
					"No pill radius behavior — uses plain var(--radius-4).",
					"Pure container — no interactivity or ARIA semantics built in.",
				]}
			/>

			{/* ── Usage Guidelines ── */}

			<UsageGuidelines
				description="Card provides visual grouping — padding, border, radius, and background. All internal layout is yours."
				guidelines={[
					{ type: "do", text: "Use Card to visually group related content." },
					{ type: "do", text: "Use surface variant as the standard container (border + subtle shadow)." },
					{ type: "do", text: "Use ghost variant for borderless content grouping." },
					{ type: "dont", text: "Don't use Card as a button — if clickable, wrap content with an interactive element." },
					{ type: "dont", text: "Don't rely on Card for semantic grouping — use <section> or <article> for semantics, Card for visuals." },
					{ type: "dont", text: "Don't nest cards deeply — one level of nesting at most." },
				]}
			/>

			{/* ── Examples ── */}

			<DocSection title="Examples">
				<div className="flex flex-col gap-8">
					<CodeExample
						title="Content Card"
						description="A community event card composing Heading, Badge, Text, icons, and Button inside a Card container. The card provides the surface — you build the layout."
						code={`<Card size={3} variant="surface" className="w-80">
  <div className="flex flex-col gap-3">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-2">
        <CalendarDaysIcon className="size-5 text-terracotta-11" />
        <Heading level={3} size={3} weight="medium">
          Team standup
        </Heading>
      </div>
      <Badge variant="soft" color="sage" size={1}>Live</Badge>
    </div>
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <ClockIcon className="size-3.5 text-gray-9" />
        <Text size={1} color="gray">9:00 AM — Daily sync</Text>
      </div>
      <div className="flex items-center gap-1.5">
        <UsersIcon className="size-3.5 text-gray-9" />
        <Text size={1} color="gray">4 members joined</Text>
      </div>
    </div>
    <Button variant="soft" size={1}>Join meeting</Button>
  </div>
</Card>`}
					>
						<Card size={3} variant="surface" className="w-80">
							<div className="flex flex-col gap-3">
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-2">
										<CalendarDaysIcon className="size-5 text-terracotta-11" />
										<Heading level={3} size={3} weight="medium">Team standup</Heading>
									</div>
									<Badge variant="soft" color="sage" size={1}>Live</Badge>
								</div>
								<div className="flex flex-col gap-1">
									<div className="flex items-center gap-1.5">
										<ClockIcon className="size-3.5 text-gray-9" />
										<Text size={1} color="gray">9:00 AM — Daily sync</Text>
									</div>
									<div className="flex items-center gap-1.5">
										<UsersIcon className="size-3.5 text-gray-9" />
										<Text size={1} color="gray">4 members joined</Text>
									</div>
								</div>
								<Button variant="soft" size={1}>Join meeting</Button>
							</div>
						</Card>
					</CodeExample>

					<CodeExample
						title="Card Grid"
						description="A 2x2 dashboard layout using Cards as stat containers. Each card pairs an icon with a metric — Card provides the surface, you compose the content."
						code={`<div className="grid grid-cols-2 gap-4">
  <Card size={3} variant="surface">
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <UserGroupIcon className="size-4 text-sage-11" />
        <Text size={1} color="gray">Active volunteers</Text>
      </div>
      <Heading level={4} size={5}>1,234</Heading>
      <div className="flex items-center gap-1">
        <ArrowTrendingUpIcon className="size-3.5 text-sage-11" />
        <Text size={1} color="sage">+12% this month</Text>
      </div>
    </div>
  </Card>
  ...
</div>`}
					>
						<div className="grid grid-cols-2 gap-4">
							<Card size={3} variant="surface">
								<div className="flex flex-col gap-2">
									<div className="flex items-center gap-2">
										<UserGroupIcon className="size-4 text-sage-11" />
										<Text size={1} color="gray">Active volunteers</Text>
									</div>
									<Heading level={4} size={5}>1,234</Heading>
									<div className="flex items-center gap-1">
										<ArrowTrendingUpIcon className="size-3.5 text-sage-11" />
										<Text size={1} color="sage">+12% this month</Text>
									</div>
								</div>
							</Card>
							<Card size={3} variant="surface">
								<div className="flex flex-col gap-2">
									<div className="flex items-center gap-2">
										<HandRaisedIcon className="size-4 text-terracotta-11" />
										<Text size={1} color="gray">Open requests</Text>
									</div>
									<Heading level={4} size={5}>56</Heading>
									<div className="flex items-center gap-1">
										<ClockIcon className="size-3.5 text-yellow-11" />
										<Text size={1} color="yellow">8 awaiting match</Text>
									</div>
								</div>
							</Card>
							<Card size={3} variant="surface">
								<div className="flex flex-col gap-2">
									<div className="flex items-center gap-2">
										<CheckCircleIcon className="size-4 text-sage-11" />
										<Text size={1} color="gray">Completed</Text>
									</div>
									<Heading level={4} size={5}>892</Heading>
									<div className="flex items-center gap-1">
										<ArrowTrendingUpIcon className="size-3.5 text-sage-11" />
										<Text size={1} color="sage">+5% this week</Text>
									</div>
								</div>
							</Card>
							<Card size={3} variant="surface">
								<div className="flex flex-col gap-2">
									<div className="flex items-center gap-2">
										<ChatBubbleLeftRightIcon className="size-4 text-terracotta-11" />
										<Text size={1} color="gray">Avg. response</Text>
									</div>
									<Heading level={4} size={5}>2.4h</Heading>
									<div className="flex items-center gap-1">
										<ArrowTrendingUpIcon className="size-3.5 text-sage-11" />
										<Text size={1} color="sage">Faster than last week</Text>
									</div>
								</div>
							</Card>
						</div>
					</CodeExample>

					<CodeExample
						title="Ghost Grouping"
						description="Ghost variant provides background tinting without borders — use it for subtle content sections where surface chrome would be too heavy."
						code={`<div className="flex gap-4">
  <Card size={3} variant="ghost" className="flex-1">
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <MapPinIcon className="size-4 text-gray-9" />
        <Heading level={4} size={2} weight="medium">Nearby</Heading>
      </div>
      <Text size={2} color="gray">
        3 help requests within 2 km of you.
      </Text>
    </div>
  </Card>
  <Card size={3} variant="surface" className="flex-1">
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <MapPinIcon className="size-4 text-terracotta-11" />
        <Heading level={4} size={2} weight="medium">Nearby</Heading>
      </div>
      <Text size={2} color="gray">
        Same content, with border + shadow.
      </Text>
    </div>
  </Card>
</div>`}
					>
						<div className="flex gap-4">
							<Card size={3} variant="ghost" className="flex-1">
								<div className="flex flex-col gap-2">
									<div className="flex items-center gap-2">
										<MapPinIcon className="size-4 text-gray-9" />
										<Heading level={4} size={2} weight="medium">Nearby</Heading>
									</div>
									<Text size={2} color="gray">3 help requests within 2 km of you.</Text>
								</div>
							</Card>
							<Card size={3} variant="surface" className="flex-1">
								<div className="flex flex-col gap-2">
									<div className="flex items-center gap-2">
										<MapPinIcon className="size-4 text-terracotta-11" />
										<Heading level={4} size={2} weight="medium">Nearby</Heading>
									</div>
									<Text size={2} color="gray">Same content, with border + shadow.</Text>
								</div>
							</Card>
						</div>
					</CodeExample>

					<CodeExample
						title="Nested Card"
						description="One level of nesting — a classic inner card for a highlighted subsection. Don't go deeper than this."
						code={`<Card size={4} variant="surface" className="max-w-md">
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-1">
      <Heading level={3} size={3} weight="medium">
        Community garden project
      </Heading>
      <Text size={2} color="gray">
        Volunteer-run garden at Victoria Park.
        12 active members.
      </Text>
    </div>
    <Card size={2} variant="classic">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <Text size={1} weight="medium">Next session</Text>
          <div className="flex items-center gap-1.5">
            <CalendarDaysIcon className="size-3.5 text-gray-9" />
            <Text size={1} color="gray">
              Saturday, 10:00 AM
            </Text>
          </div>
        </div>
        <Badge variant="soft" color="yellow" size={1}>
          3 spots left
        </Badge>
      </div>
    </Card>
  </div>
</Card>`}
					>
						<Card size={4} variant="surface" className="max-w-md">
							<div className="flex flex-col gap-4">
								<div className="flex flex-col gap-1">
									<Heading level={3} size={3} weight="medium">Community garden project</Heading>
									<Text size={2} color="gray">Volunteer-run garden at Victoria Park. 12 active members.</Text>
								</div>
								<Card size={2} variant="classic">
									<div className="flex items-center justify-between">
										<div className="flex flex-col gap-0.5">
											<Text size={1} weight="medium">Next session</Text>
											<div className="flex items-center gap-1.5">
												<CalendarDaysIcon className="size-3.5 text-gray-9" />
												<Text size={1} color="gray">Saturday, 10:00 AM</Text>
											</div>
										</div>
										<Badge variant="soft" color="yellow" size={1}>3 spots left</Badge>
									</div>
								</Card>
							</div>
						</Card>
					</CodeExample>
				</div>
			</DocSection>

			{/* ── Visual Reference ── */}

			<DocSection title="Visual Reference">
				<div className="flex flex-col gap-8">
					<DemoSection title="Variant" description="Three container styles with different levels of visual chrome.">
						<div className="flex flex-wrap items-start gap-4">
							{VARIANTS.map(variant => (
								<Card key={variant} variant={variant} size={2} className="w-48">
									<Heading level={4} size={2} weight="medium">{variant.charAt(0).toUpperCase() + variant.slice(1)}</Heading>
									<Text size={1} color="gray">Variant preview</Text>
								</Card>
							))}
						</div>
					</DemoSection>

					<DemoSection title="Size" description="Five sizes controlling padding and border-radius.">
						<div className="flex flex-col gap-4">
							{SIZES.map(size => (
								<Card key={size} size={size} variant="surface">
									<Text size={2} weight="medium">
										Size
										{" "}
										{size}
									</Text>
								</Card>
							))}
						</div>
					</DemoSection>

					<DemoSection title="Color" description="Optional color tint shown in the surface variant.">
						<div className="flex flex-wrap items-start gap-4">
							{COLORS.map(color => (
								<Card key={color} variant="surface" color={color} size={2} className="w-36">
									<Text size={2} weight="medium">
										{color.charAt(0).toUpperCase() + color.slice(1)}
									</Text>
								</Card>
							))}
						</div>
					</DemoSection>

					<DemoSection title="Variant x Color" description="All variant and color combinations.">
						<div className="flex flex-col gap-6">
							{VARIANTS.map(variant => (
								<div key={variant} className="flex flex-col gap-2">
									<Text size={1} weight="medium" color="gray" className="uppercase tracking-wider">
										{variant}
									</Text>
									<div className="flex flex-wrap items-start gap-3">
										{COLORS.map(color => (
											<Card key={color} variant={variant} color={color} size={2} className="w-32">
												<Text size={1}>{color}</Text>
											</Card>
										))}
									</div>
								</div>
							))}
						</div>
					</DemoSection>
				</div>
			</DocSection>

			{/* ── Context & Composition ── */}

			<DocSection title="Context & Composition">
				<Text size={2} color="gray">
					Card is a pure visual container — it provides padding, border, radius, and background but has no ARIA semantics, no context provider, and no interactivity. All internal layout is the consumer's responsibility via className or Tailwind utilities. There is no CardGroup — if you need grouped card layouts, compose them with standard CSS grid or flex containers.
				</Text>
			</DocSection>

			{/* ── API Reference ── */}

			<DocSection title="API Reference">
				<PropTable data={PROPS} />
			</DocSection>
		</div>
	);
}

export const Route = createFileRoute("/showcase/card")({
	component: CardPage,
});
