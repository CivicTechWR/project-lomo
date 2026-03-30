import {
	ArchiveBoxIcon,
	BriefcaseIcon,
	CakeIcon,
	FunnelIcon,
	HeartIcon,
	HomeIcon,
	MapPinIcon,
	ScaleIcon,
	SparklesIcon,
	TruckIcon,
} from "@heroicons/react/24/solid";
import {
	Badge,
	Button,
	Card,
	Checkbox,
	CheckboxCard,
	CheckboxCardGroup,
	CheckboxGroup,
	CheckboxIndicator,
	Description,
	FieldError,
	Heading,
	Label,
	Text,
} from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { DemoSection, PageHeader, Playground, PropTable } from "./-components";
import { Anatomy, CodeExample, DocSection, FeatureList, UsageGuidelines } from "./-doc-components";

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

const CHECKBOX_CARD_GROUP_PROPS = [
	{ name: "value", type: "string[]", default: "undefined" },
	{ name: "onChange", type: "(value: string[]) => void", default: "undefined" },
	{ name: "isRequired", type: "boolean", default: "false" },
	{ name: "isInvalid", type: "boolean", default: "false" },
	{ name: "variant", type: "\"surface\" | \"classic\"", default: "\"surface\"" },
	{ name: "size", type: "1 | 2 | 3", default: "2" },
	{ name: "color", type: "\"terracotta\" | \"sage\" | ... | \"amber\"", default: "\"terracotta\"" },
];

const CHECKBOX_INDICATOR_PROPS = [
	{ name: "variant", type: "\"surface\" | \"classic\"", default: "\"surface\"" },
	{ name: "size", type: "1 | 2 | 3", default: "2" },
	{ name: "color", type: "\"terracotta\" | \"sage\" | ... | \"amber\"", default: "\"terracotta\"" },
	{ name: "className", type: "string", default: "undefined" },
];

const HELP_CATEGORIES = [
	{
		value: "housing",
		label: "Housing",
		description: "Shelter, rent assistance, or finding a place to stay",
		icon: HomeIcon,
	},
	{
		value: "food",
		label: "Food & Meals",
		description: "Food banks, community kitchens, and meal programs",
		icon: CakeIcon,
	},
	{
		value: "transport",
		label: "Getting Around",
		description: "Bus passes, rides to appointments, or route planning",
		icon: TruckIcon,
	},
	{
		value: "legal",
		label: "Legal Aid",
		description: "Free consultations, tenant rights, and immigration help",
		icon: ScaleIcon,
	},
	{
		value: "health",
		label: "Health & Wellness",
		description: "Clinics, mental health support, and harm reduction",
		icon: HeartIcon,
	},
	{
		value: "employment",
		label: "Employment",
		description: "Job search, resume help, and skills training",
		icon: BriefcaseIcon,
	},
];

const PREFERENCE_CATEGORIES = [
	{
		value: "meals",
		label: "Meals",
		description: "Cook or deliver meals to neighbors",
		icon: CakeIcon,
	},
	{
		value: "items",
		label: "Items",
		description: "Share household items or supplies",
		icon: ArchiveBoxIcon,
	},
	{
		value: "rides",
		label: "Rides",
		description: "Drive neighbors to appointments",
		icon: TruckIcon,
	},
	{
		value: "care",
		label: "Care",
		description: "Provide companionship or check-ins",
		icon: HeartIcon,
	},
];

const QUICK_FILTERS = [
	{ value: "urgent", label: "Urgent", icon: SparklesIcon },
	{ value: "nearby", label: "Nearby", icon: MapPinIcon },
	{ value: "new", label: "New", icon: FunnelIcon },
];

function CheckboxCardPage() {
	const [singleChecked, setSingleChecked] = useState(true);
	const [groupSelected, setGroupSelected] = useState<string[]>(["housing", "food"]);

	// Example state
	const [helpSelected, setHelpSelected] = useState<string[]>(["housing", "food"]);
	const [prefSelected, setPrefSelected] = useState<string[]>(["meals"]);
	const [filterSelected, setFilterSelected] = useState<string[]>(["nearby"]);
	const [comparisonSelected, setComparisonSelected] = useState<string[]>(["email"]);

	return (
		<div className="flex flex-col gap-10">
			<PageHeader
				title="Checkbox Card"
				description="Card-style selection control for multi-option grids."
			/>

			{/* ── Playground ── */}

			<Playground
				componentName={values => values.grouped ? "CheckboxCardGroup" : "CheckboxCard"}
				childrenLabel={(values) => {
					if (values.grouped) {
						return [
							"<Label>What kind of support are you looking for?</Label>",
							"<div className=\"mt-2 grid grid-cols-3 gap-3\">",
							"  <CheckboxCard value=\"housing\">",
							"    <section className=\"flex flex-col gap-1\">",
							"      <div className=\"flex items-center gap-2\">",
							"        <HomeIcon className=\"size-5\" />",
							"        <Text weight=\"medium\">Housing</Text>",
							"      </div>",
							"      <Text size={1} color=\"gray\">Shelter, rent assistance, ...</Text>",
							"    </section>",
							"  </CheckboxCard>",
							"  {/* ... more cards */}",
							"</div>",
						].join("\n  ");
					}
					return [
						"<section className=\"flex items-start gap-3\">",
						"  <CheckboxIndicator />",
						"  <div className=\"flex flex-col gap-1\">",
						"    <div className=\"flex items-center gap-2\">",
						"      <HomeIcon className=\"size-5\" />",
						"      <Text weight=\"medium\">Housing</Text>",
						"    </div>",
						"    <Text size={1} color=\"gray\">Shelter, rent assistance, ...</Text>",
						"  </div>",
						"</section>",
					].join("\n  ");
				}}
				snippetExclude={["grouped"]}
				defaults={{ variant: "surface", size: 2, color: "terracotta", isDisabled: false, grouped: false }}
				controls={[
					{ name: "variant", type: "segment", options: VARIANTS },
					{ name: "size", type: "segment", options: SIZES },
					{ name: "color", type: "segment", options: COLORS },
					{ name: "isDisabled", type: "toggle" },
					{ name: "grouped", type: "toggle" },
				]}
				footer={values => (
					<Text size={1} color="gray">
						<code className="font-mono">
							{values.grouped
								? `Selected: ${JSON.stringify(groupSelected)}`
								: `State: ${singleChecked}`}
						</code>
					</Text>
				)}
				snippetPrefix={(values) => {
					if (values.grouped) {
						return "const [selected, setSelected] = useState([\"housing\", \"food\"]);";
					}
					return "const [checked, setChecked] = useState(true);";
				}}
				snippetExtraProps={(values) => {
					if (values.grouped) {
						return ["value={selected}", "onChange={setSelected}"];
					}
					return ["isSelected={checked}", "onChange={setChecked}"];
				}}
			>
				{(props) => {
					const v = props.variant as "surface" | "classic";
					const s = props.size as 1 | 2 | 3;
					const c = props.color as any;
					const disabled = props.isDisabled as boolean;

					if (props.grouped) {
						return (
							<div className="w-full">
								<CheckboxCardGroup variant={v} size={s} color={c} value={groupSelected} onChange={setGroupSelected}>
									<Label>What kind of support are you looking for?</Label>
									<div className="mt-2 grid grid-cols-3 gap-3">
										{HELP_CATEGORIES.map((cat) => {
											const Icon = cat.icon;
											return (
												<CheckboxCard
													key={cat.value}
													value={cat.value}
													isDisabled={disabled}
												>
													<section className="flex flex-col gap-1">
														<div className="flex items-center gap-2">
															<Icon className="size-5 text-gray-11" />
															<Text weight="medium">{cat.label}</Text>
														</div>
														<Text size={1} color="gray">{cat.description}</Text>
													</section>
												</CheckboxCard>
											);
										})}
									</div>
								</CheckboxCardGroup>
							</div>
						);
					}

					return (
						<CheckboxCard
							variant={v}
							size={s}
							color={c}
							isDisabled={disabled}
							isSelected={singleChecked}
							onChange={setSingleChecked}
							value="housing"
							className="w-full max-w-xs"
						>
							<section className="flex items-start gap-3">
								<CheckboxIndicator />
								<div className="flex flex-col gap-1">
									<div className="flex items-center gap-2">
										<HomeIcon className="size-5 text-gray-11" />
										<Text weight="medium">Housing</Text>
									</div>
									<Text size={1} color="gray">Shelter, rent assistance, or finding a place to stay</Text>
								</div>
							</section>
						</CheckboxCard>
					);
				}}
			</Playground>

			{/* ── Anatomy ── */}

			<Anatomy
				parts={[
					{ label: "CheckboxCard", description: "Card-style checkbox with border highlight on selection. Wraps CheckboxIndicator + content." },
					{ label: "CheckboxIndicator", description: "The tick/dash box rendered inside the card." },
					{ label: "children", description: "Card content: typically a title, description, and optional icon." },
					{ label: "CheckboxCardGroup", description: "Context provider for card-style checkboxes. Forces \"surface\" FieldContext." },
				]}
			>
				<CheckboxCardGroup color="sage">
					<div className="grid grid-cols-3 gap-3">
						<CheckboxCard value="one" defaultSelected>
							<section className="flex items-start gap-3">
								<CheckboxIndicator />
								<Text weight="medium">First option</Text>
							</section>
						</CheckboxCard>
						<CheckboxCard value="two">
							<section className="flex items-start gap-3">
								<CheckboxIndicator />
								<Text weight="medium">Second option</Text>
							</section>
						</CheckboxCard>
						<CheckboxCard value="three">
							<section className="flex items-start gap-3">
								<CheckboxIndicator />
								<Text weight="medium">Third option</Text>
							</section>
						</CheckboxCard>
					</div>
				</CheckboxCardGroup>
			</Anatomy>

			{/* ── Features ── */}

			<FeatureList
				features={[
					"Card-style selection with inset border shadow on select.",
					"Two visual variants inherited from Checkbox (surface, classic).",
					"Three sizes.",
					"Six palette colors with selected-state styling.",
					"CheckboxCardGroup provides shared styling context to all children.",
					"Built on react-aria-components for full keyboard and screen reader support.",
					"Flexible card content — icons, descriptions, any layout.",
				]}
			/>

			{/* ── Usage Guidelines ── */}

			<UsageGuidelines
				description="Use CheckboxCard for multi-select scenarios where each option has a title, description, or icon — like selecting help categories or plan features."
				guidelines={[
					{ type: "do", text: "Give each card a clear title and optional description." },
					{ type: "do", text: "Use consistent card sizes within a group." },
					{ type: "do", text: "Use CheckboxCardGroup for ARIA group semantics and shared styling." },
					{ type: "dont", text: "Don't use for simple yes/no lists — use regular Checkbox instead." },
					{ type: "dont", text: "Don't mix CheckboxCard and regular Checkbox in the same group." },
					{ type: "dont", text: "Don't make cards too small for their content — size 2 or 3 for cards with descriptions." },
				]}
			/>

			{/* ── Examples ── */}

			<DocSection title="Examples">
				<div className="flex flex-col gap-8">
					<CodeExample
						title="Help Category Selection"
						description="A controlled card group for selecting help categories. The badge counter changes style as selections grow — soft when partial, solid when all are selected. Wrapping in a Card creates a focused intake panel."
						code={`const [selected, setSelected] = useState(["housing", "food"]);

<Card variant="surface" size={3}>
  <div className="flex items-center justify-between">
    <Heading level={3} size={3}>Support Categories</Heading>
    <Badge
      variant={selected.length === categories.length
        ? "solid" : "soft"}
      color="sage"
      size={1}
    >
      {selected.length}/{categories.length}
    </Badge>
  </div>
  <Text size={2} color="gray">
    Select all that apply to your situation.
  </Text>
  <CheckboxCardGroup color="sage" value={selected}
    onChange={setSelected}>
    <Label>What kind of support do you need?</Label>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
      <CheckboxCard value="housing">
        <section className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <HomeIcon className="size-5" />
            <Text weight="medium">Housing</Text>
          </div>
          <Text size={1} color="gray">
            Shelter, rent assistance, ...
          </Text>
        </section>
      </CheckboxCard>
      {/* ... more cards */}
    </div>
  </CheckboxCardGroup>
</Card>`}
					>
						<Card variant="surface" size={3} className="w-full">
							<div className="flex flex-col gap-4">
								<div className="flex items-center justify-between">
									<div className="flex flex-col gap-1">
										<Heading level={3} size={3}>Support Categories</Heading>
										<Text size={2} color="gray">Select all that apply to your situation.</Text>
									</div>
									<Badge
										variant={helpSelected.length === HELP_CATEGORIES.length ? "solid" : "soft"}
										color="sage"
										size={1}
									>
										{helpSelected.length}
										/
										{HELP_CATEGORIES.length}
									</Badge>
								</div>
								<CheckboxCardGroup color="sage" value={helpSelected} onChange={setHelpSelected}>
									<Label>What kind of support do you need?</Label>
									<div className="mt-1 grid grid-cols-2 gap-3 lg:grid-cols-3">
										{HELP_CATEGORIES.map((cat) => {
											const Icon = cat.icon;
											return (
												<CheckboxCard key={cat.value} value={cat.value}>
													<section className="flex flex-col gap-1">
														<div className="flex items-center gap-2">
															<Icon className="size-5 text-gray-11" />
															<Text weight="medium">{cat.label}</Text>
														</div>
														<Text size={1} color="gray">{cat.description}</Text>
													</section>
												</CheckboxCard>
											);
										})}
									</div>
								</CheckboxCardGroup>
							</div>
						</Card>
					</CodeExample>

					<CodeExample
						title="Volunteer Onboarding"
						description="Form validation with isRequired ensures at least one category is selected before continuing. Heading and Text live outside the CheckboxCardGroup to avoid the RAC slot boundary — only Label, Description, FieldError, and CheckboxCard belong inside."
						code={`<Card variant="classic" size={3}>
  <Badge variant="outline" color="terracotta" size={1}>
    Step 2 of 3
  </Badge>
  <Heading level={3} size={3}>
    What can you help with?
  </Heading>
  <Text size={2} color="gray">
    Select at least one — you can always update later.
  </Text>
  <form>
    <CheckboxCardGroup isRequired color="terracotta">
      <Label>Help categories</Label>
      <div className="grid grid-cols-2 gap-3">
        <CheckboxCard value="housing">
          <section className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <HomeIcon className="size-5" />
              <Text weight="medium">Housing</Text>
            </div>
            <Text size={1} color="gray">...</Text>
          </section>
        </CheckboxCard>
        {/* ... more cards */}
      </div>
      <FieldError />
    </CheckboxCardGroup>
    <Button type="submit" variant="solid"
      color="terracotta">Continue</Button>
  </form>
</Card>`}
					>
						<Card variant="classic" size={3} className="w-full max-w-lg">
							<div className="flex flex-col gap-4">
								<Badge variant="outline" color="terracotta" size={1} className="w-fit">Step 2 of 3</Badge>
								<div className="flex flex-col gap-1">
									<Heading level={3} size={3}>What can you help with?</Heading>
									<Text size={2} color="gray">Select at least one — you can always update later.</Text>
								</div>
								<form className="flex flex-col gap-4">
									<CheckboxCardGroup isRequired color="terracotta">
										<Label>Help categories</Label>
										<div className="mt-1 grid grid-cols-2 gap-3">
											{HELP_CATEGORIES.slice(0, 4).map((cat) => {
												const Icon = cat.icon;
												return (
													<CheckboxCard key={cat.value} value={cat.value}>
														<section className="flex flex-col gap-1">
															<div className="flex items-center gap-2">
																<Icon className="size-5 text-gray-11" />
																<Text weight="medium">{cat.label}</Text>
															</div>
															<Text size={1} color="gray">{cat.description}</Text>
														</section>
													</CheckboxCard>
												);
											})}
										</div>
										<FieldError />
									</CheckboxCardGroup>
									<div className="flex gap-3">
										<Button type="submit" variant="solid" color="terracotta" size={2}>Continue</Button>
										<Button variant="ghost" color="gray" size={2}>Skip for now</Button>
									</div>
								</form>
							</div>
						</Card>
					</CodeExample>

					<CodeExample
						title="Set Your Preference"
						description="A clean onboarding pattern inspired by LoMo's signup flow. Icon-centered cards let users scan options at a glance. Each card shows a short description underneath — the card format earns its visual weight by communicating more than a label alone."
						code={`const [selected, setSelected] = useState(["meals"]);

<Card variant="surface" size={3}>
  <Heading level={3} size={3}>
    Set Your Preference
  </Heading>
  <Text size={2} color="gray">
    How would you like to help your neighbors today?
  </Text>
  <CheckboxCardGroup color="terracotta"
    value={selected} onChange={setSelected}>
    <Label>Type of help</Label>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <CheckboxCard value="meals">
        <section className="flex flex-col items-center
          gap-1.5 py-3 text-center">
          <CakeIcon className="size-7" />
          <Text weight="medium">Meals</Text>
          <Text size={1} color="gray">
            Cook or deliver
          </Text>
        </section>
      </CheckboxCard>
      {/* Items, Rides, Care ... */}
    </div>
  </CheckboxCardGroup>
</Card>`}
					>
						<Card variant="surface" size={3} className="w-full max-w-xl">
							<div className="flex flex-col gap-4">
								<div className="flex flex-col gap-1">
									<Heading level={3} size={3}>Set Your Preference</Heading>
									<Text size={2} color="gray">How would you like to help your neighbors today?</Text>
								</div>
								<CheckboxCardGroup color="terracotta" value={prefSelected} onChange={setPrefSelected}>
									<Label>Type of help</Label>
									<div className="mt-1 grid grid-cols-2 gap-3 sm:grid-cols-4">
										{PREFERENCE_CATEGORIES.map((cat) => {
											const Icon = cat.icon;
											return (
												<CheckboxCard key={cat.value} value={cat.value}>
													<section className="flex flex-col items-center gap-1.5 py-3 text-center">
														<Icon className="size-7 text-gray-11" />
														<Text weight="medium">{cat.label}</Text>
														<Text size={1} color="gray">{cat.description}</Text>
													</section>
												</CheckboxCard>
											);
										})}
									</div>
								</CheckboxCardGroup>
							</div>
						</Card>
					</CodeExample>

					<CodeExample
						title="Quick Filters"
						description="Size 1 compact cards in a horizontal row for toolbar-style filters. Shown in context as part of a feed header — cards don't always need a grid. The selected count badge updates as filters are toggled."
						code={`const [filters, setFilters] = useState(["nearby"]);

<Card variant="surface" size={2}>
  <div className="flex items-center justify-between">
    <Heading level={3} size={2}>
      Help Requests
    </Heading>
    <Badge variant="soft" color="gray" size={1}>
      {filters.length} active
    </Badge>
  </div>
  <div className="border-t border-gray-6" />
  <CheckboxCardGroup size={1} color="gray"
    value={filters} onChange={setFilters}
    aria-label="Filter requests">
    <div className="flex flex-row gap-2">
      <CheckboxCard value="urgent">
        <div className="flex items-center gap-1.5">
          <SparklesIcon className="size-3.5" />
          <Text weight="medium" size={1}>Urgent</Text>
        </div>
      </CheckboxCard>
      {/* Nearby, New ... */}
    </div>
  </CheckboxCardGroup>
</Card>`}
					>
						<Card variant="surface" size={2} className="w-full max-w-sm">
							<div className="flex flex-col gap-3">
								<div className="flex items-center justify-between">
									<Heading level={3} size={2}>Help Requests</Heading>
									<Badge variant="soft" color="gray" size={1}>
										{filterSelected.length}
										{" "}
										active
									</Badge>
								</div>
								<div className="border-t border-gray-6" />
								<CheckboxCardGroup size={1} color="gray" value={filterSelected} onChange={setFilterSelected} aria-label="Filter requests">
									<div className="flex flex-row gap-2">
										{QUICK_FILTERS.map((filter) => {
											const Icon = filter.icon;
											return (
												<CheckboxCard key={filter.value} value={filter.value}>
													<div className="flex items-center gap-1.5">
														<Icon className="size-3.5 text-gray-11" />
														<Text weight="medium" size={1}>{filter.label}</Text>
													</div>
												</CheckboxCard>
											);
										})}
									</div>
								</CheckboxCardGroup>
							</div>
						</Card>
					</CodeExample>

					<CodeExample
						title="Card vs Checkbox"
						description="The same three options rendered as Checkbox (left) and CheckboxCard (right). State is synced — toggling either side updates the other. This makes the density difference immediately obvious: Checkbox for compact lists, CheckboxCard when each option needs context."
						code={`const [selected, setSelected] = useState(["email"]);

{/* State is shared — toggling one updates both */}
<div className="grid grid-cols-2 gap-6">
  <CheckboxGroup color="sage" value={selected}
    onChange={setSelected}>
    <Label>Notifications</Label>
    <Checkbox value="email">Email updates</Checkbox>
    <Checkbox value="sms">SMS alerts</Checkbox>
    <Checkbox value="push">Push notifications</Checkbox>
  </CheckboxGroup>

  <CheckboxCardGroup color="sage" value={selected}
    onChange={setSelected}>
    <Label>Notifications</Label>
    <div className="flex flex-col gap-2">
      <CheckboxCard value="email">
        <section className="flex items-start gap-3">
          <CheckboxIndicator />
          <div className="flex flex-col gap-0.5">
            <Text weight="medium">Email updates</Text>
            <Text size={1} color="gray">
              Daily digest of activity
            </Text>
          </div>
        </section>
      </CheckboxCard>
      {/* ... more cards */}
    </div>
  </CheckboxCardGroup>
</div>`}
					>
						<Card variant="surface" size={3} className="w-full">
							<div className="flex flex-col gap-4">
								<div className="flex flex-col gap-1">
									<Heading level={3} size={3}>When to use which?</Heading>
									<Text size={2} color="gray">Toggle either side — state is synced between both.</Text>
								</div>
								<div className="grid grid-cols-1 gap-6 sm:grid-cols-[1fr_auto_1fr]">
									<div className="flex flex-col gap-3">
										<div className="flex flex-col gap-1">
											<Badge variant="outline" color="sage" size={1} className="w-fit">Checkbox</Badge>
											<Text size={1} color="gray">Compact, inline, space-efficient</Text>
										</div>
										<CheckboxGroup color="sage" value={comparisonSelected} onChange={setComparisonSelected}>
											<Label>Notifications</Label>
											<Checkbox value="email">Email updates</Checkbox>
											<Checkbox value="sms">SMS alerts</Checkbox>
											<Checkbox value="push">Push notifications</Checkbox>
										</CheckboxGroup>
									</div>
									<div className="hidden border-l border-gray-6 sm:block" />
									<div className="flex flex-col gap-3">
										<div className="flex flex-col gap-1">
											<Badge variant="outline" color="terracotta" size={1} className="w-fit">CheckboxCard</Badge>
											<Text size={1} color="gray">Rich content, descriptions, visual weight</Text>
										</div>
										<CheckboxCardGroup color="sage" value={comparisonSelected} onChange={setComparisonSelected}>
											<Label>Notifications</Label>
											<div className="mt-1 flex flex-col gap-2">
												<CheckboxCard value="email">
													<section className="flex items-start gap-3">
														<CheckboxIndicator />
														<div className="flex flex-col gap-0.5">
															<Text weight="medium">Email updates</Text>
															<Text size={1} color="gray">Daily digest of activity</Text>
														</div>
													</section>
												</CheckboxCard>
												<CheckboxCard value="sms">
													<section className="flex items-start gap-3">
														<CheckboxIndicator />
														<div className="flex flex-col gap-0.5">
															<Text weight="medium">SMS alerts</Text>
															<Text size={1} color="gray">Instant notifications for matches</Text>
														</div>
													</section>
												</CheckboxCard>
												<CheckboxCard value="push">
													<section className="flex items-start gap-3">
														<CheckboxIndicator />
														<div className="flex flex-col gap-0.5">
															<Text weight="medium">Push notifications</Text>
															<Text size={1} color="gray">Browser alerts when nearby</Text>
														</div>
													</section>
												</CheckboxCard>
											</div>
										</CheckboxCardGroup>
									</div>
								</div>
							</div>
						</Card>
					</CodeExample>
				</div>
			</DocSection>

			{/* ── Visual Reference ── */}

			<DocSection title="Visual Reference">
				<div className="flex flex-col gap-8">
					<DemoSection title="Variant" description="Two visual styles for the card container.">
						<div className="grid grid-cols-2 gap-3">
							{VARIANTS.map(variant => (
								<CheckboxCard key={variant} variant={variant} defaultSelected value={variant}>
									<section className="flex flex-col gap-1">
										<Text weight="medium">{variant.charAt(0).toUpperCase() + variant.slice(1)}</Text>
										<Text size={1} color="gray">Card variant style</Text>
									</section>
								</CheckboxCard>
							))}
						</div>
					</DemoSection>

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

					<DemoSection title="Color" description="All palette colors in selected state.">
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
							{COLORS.map(color => (
								<CheckboxCard key={color} color={color} defaultSelected value={color}>
									<Text weight="medium">{color.charAt(0).toUpperCase() + color.slice(1)}</Text>
								</CheckboxCard>
							))}
						</div>
					</DemoSection>

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

					<DemoSection title="CheckboxCardGroup" description="Semantic group with consumer-owned grid layout.">
						<div className="flex flex-col gap-6">
							<CheckboxCardGroup color="sage">
								<Label>What kind of support are you looking for?</Label>
								<div className="mt-2 grid grid-cols-3 gap-3">
									{HELP_CATEGORIES.map((cat) => {
										const Icon = cat.icon;
										return (
											<CheckboxCard key={cat.value} value={cat.value}>
												<section className="flex flex-col gap-1">
													<div className="flex items-center gap-2">
														<Icon className="size-5 text-gray-11" />
														<Text weight="medium">{cat.label}</Text>
													</div>
													<Text size={1} color="gray">{cat.description}</Text>
												</section>
											</CheckboxCard>
										);
									})}
								</div>
							</CheckboxCardGroup>

							<Text size={2} weight="medium" color="gray">Card variants:</Text>
							{VARIANTS.map(variant => (
								<CheckboxCardGroup key={variant} variant={variant} color="terracotta" className="grid grid-cols-3 gap-3">
									{HELP_CATEGORIES.slice(0, 3).map((cat, i) => {
										const Icon = cat.icon;
										return (
											<CheckboxCard key={cat.value} value={cat.value} defaultSelected={i === 0}>
												<div className="flex items-center gap-2">
													<Icon className="size-5 text-gray-11" />
													<Text weight="medium">{cat.label}</Text>
												</div>
											</CheckboxCard>
										);
									})}
								</CheckboxCardGroup>
							))}
						</div>
					</DemoSection>
				</div>
			</DocSection>

			{/* ── Context & Composition ── */}

			<DocSection title="Context & Composition">
				<div className="flex flex-col gap-8">
					<CodeExample
						title="Group Context Propagation"
						description="CheckboxCardGroup sets variant, size, and color via CheckboxGroupStyleContext. All child CheckboxCards inherit these values automatically without passing props individually."
						code={`<CheckboxCardGroup color="sage" size={3}>
  <Label>Options</Label>
  <div className="grid grid-cols-3 gap-3">
    <CheckboxCard value="a" defaultSelected>
      <Text weight="medium">Option A</Text>
    </CheckboxCard>
    <CheckboxCard value="b">
      <Text weight="medium">Option B</Text>
    </CheckboxCard>
    <CheckboxCard value="c">
      <Text weight="medium">Option C</Text>
    </CheckboxCard>
  </div>
</CheckboxCardGroup>`}
					>
						<div className="w-full max-w-md">
							<CheckboxCardGroup color="sage" size={3}>
								<Label>Options</Label>
								<div className="mt-2 grid grid-cols-3 gap-3">
									<CheckboxCard value="a" defaultSelected>
										<Text weight="medium">Option A</Text>
									</CheckboxCard>
									<CheckboxCard value="b">
										<Text weight="medium">Option B</Text>
									</CheckboxCard>
									<CheckboxCard value="c">
										<Text weight="medium">Option C</Text>
									</CheckboxCard>
								</div>
							</CheckboxCardGroup>
						</div>
					</CodeExample>

					<CodeExample
						title="Forced Surface FieldContext"
						description="CheckboxCard always provides variant=&quot;surface&quot; to FieldContext, regardless of the card's own variant. This means CheckboxIndicator inside a classic card still renders with surface styling — ensuring visual consistency across card variants."
						code={`{/* Both indicators render identically despite different card variants */}
<div className="grid grid-cols-2 gap-3">
  <CheckboxCard variant="classic" defaultSelected value="a">
    <section className="flex items-start gap-3">
      <CheckboxIndicator />
      <Text weight="medium">Classic card</Text>
    </section>
  </CheckboxCard>
  <CheckboxCard variant="surface" defaultSelected value="b">
    <section className="flex items-start gap-3">
      <CheckboxIndicator />
      <Text weight="medium">Surface card</Text>
    </section>
  </CheckboxCard>
</div>`}
					>
						<div className="grid w-full max-w-md grid-cols-2 gap-3">
							<CheckboxCard variant="classic" defaultSelected value="a">
								<section className="flex items-start gap-3">
									<CheckboxIndicator />
									<Text weight="medium">Classic card</Text>
								</section>
							</CheckboxCard>
							<CheckboxCard variant="surface" defaultSelected value="b">
								<section className="flex items-start gap-3">
									<CheckboxIndicator />
									<Text weight="medium">Surface card</Text>
								</section>
							</CheckboxCard>
						</div>
					</CodeExample>

					<CodeExample
						title="Overriding Group Context"
						description="Individual CheckboxCards can override any style prop from the group. Here the last card uses color=&quot;red&quot; while siblings inherit sage from the group."
						code={`<CheckboxCardGroup color="sage" size={2}>
  <Label>Settings</Label>
  <div className="grid grid-cols-3 gap-3">
    <CheckboxCard value="updates" defaultSelected>
      <Text weight="medium">Receive updates</Text>
    </CheckboxCard>
    <CheckboxCard value="marketing" defaultSelected>
      <Text weight="medium">Marketing emails</Text>
    </CheckboxCard>
    <CheckboxCard value="delete" color="red">
      <Text weight="medium">Delete my data</Text>
    </CheckboxCard>
  </div>
</CheckboxCardGroup>`}
					>
						<div className="w-full max-w-md">
							<CheckboxCardGroup color="sage" size={2}>
								<Label>Settings</Label>
								<div className="mt-2 grid grid-cols-3 gap-3">
									<CheckboxCard value="updates" defaultSelected>
										<Text weight="medium">Receive updates</Text>
									</CheckboxCard>
									<CheckboxCard value="marketing" defaultSelected>
										<Text weight="medium">Marketing emails</Text>
									</CheckboxCard>
									<CheckboxCard value="delete" color="red">
										<Text weight="medium">Delete my data</Text>
									</CheckboxCard>
								</div>
							</CheckboxCardGroup>
						</div>
					</CodeExample>

					<CodeExample
						title="RAC Slot Boundary"
						description="CheckboxCardGroup uses React Aria's slot system — it provides TextContext with two slots: description and errorMessage. Only Label, Description, FieldError, and CheckboxCard can be direct children. Placing Text or other RAC-based components inside the group throws a slot error. Keep decorative content outside the group boundary."
						code={`{/* ✗ Text inside CheckboxCardGroup — throws slot error */}
<CheckboxCardGroup>
  <Text size={2}>Choose your preferences</Text>
  <div className="grid grid-cols-2 gap-3">
    <CheckboxCard value="a">...</CheckboxCard>
  </div>
</CheckboxCardGroup>

{/* ✓ Text outside, group stays lean */}
<div>
  <Text size={2} color="gray">
    Choose your preferences.
  </Text>
  <CheckboxCardGroup>
    <Label>Preferences</Label>
    <div className="grid grid-cols-2 gap-3">
      <CheckboxCard value="a">
        <Text weight="medium">Option A</Text>
      </CheckboxCard>
      <CheckboxCard value="b">
        <Text weight="medium">Option B</Text>
      </CheckboxCard>
    </div>
    <Description>
      You can change these anytime.
    </Description>
  </CheckboxCardGroup>
</div>`}
					>
						<div className="flex w-full max-w-md flex-col gap-3">
							<Text size={2} color="gray">Choose your preferences.</Text>
							<CheckboxCardGroup color="sage">
								<Label>Preferences</Label>
								<div className="mt-1 grid grid-cols-2 gap-3">
									<CheckboxCard value="a" defaultSelected>
										<Text weight="medium">Option A</Text>
									</CheckboxCard>
									<CheckboxCard value="b">
										<Text weight="medium">Option B</Text>
									</CheckboxCard>
								</div>
								<Description>You can change these anytime.</Description>
							</CheckboxCardGroup>
						</div>
					</CodeExample>
				</div>
			</DocSection>

			{/* ── API Reference ── */}

			<DocSection title="API Reference">
				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-3">
						<Text size={3} weight="medium">CheckboxCard</Text>
						<PropTable data={CHECKBOX_CARD_PROPS} />
					</div>
					<div className="flex flex-col gap-3">
						<Text size={3} weight="medium">CheckboxCardGroup</Text>
						<PropTable data={CHECKBOX_CARD_GROUP_PROPS} />
					</div>
					<div className="flex flex-col gap-3">
						<Text size={3} weight="medium">CheckboxIndicator</Text>
						<PropTable data={CHECKBOX_INDICATOR_PROPS} />
					</div>
				</div>
			</DocSection>
		</div>
	);
}

export const Route = createFileRoute("/showcase/checkbox-card")({
	component: CheckboxCardPage,
});
