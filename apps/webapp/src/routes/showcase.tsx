import { Badge, Button, Heading, Text } from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/showcase")({
	component: ShowcasePage,
});

const COLORS = ["terracotta", "sage", "yellow", "gray", "red", "amber"] as const;
const BADGE_VARIANTS = ["solid", "soft", "surface", "outline"] as const;
const BADGE_SIZES = [1, 2, 3] as const;
const BUTTON_VARIANTS = ["solid", "soft", "outline", "ghost"] as const;
const BUTTON_SIZES = [1, 2, 3, 4] as const;
const TEXT_SIZES = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const WEIGHTS = ["light", "regular", "medium", "bold"] as const;
const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;
const TRIMS = ["normal", "start", "end", "both"] as const;

const LEVEL_TO_SIZE: Record<number, number> = { 1: 8, 2: 7, 3: 6, 4: 5, 5: 4, 6: 3 };

function formatProps(props: Record<string, string | number | boolean | undefined>): string {
	return Object.entries(props)
		.filter(([, v]) => v !== undefined)
		.map(([k, v]) => {
			if (typeof v === "boolean")
				return v ? k : "";
			if (typeof v === "number")
				return `${k}={${v}}`;
			return `${k}="${v}"`;
		})
		.filter(Boolean)
		.join(" ");
}

function PropDisplay({
	props,
	children,
}: {
	props: Record<string, string | number | boolean | undefined>;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			{children}
			<Text size={1} color="gray" className="font-mono bg-gray-2 rounded-[var(--radius-2)] px-2 py-0.5">
				{formatProps(props)}
			</Text>
		</div>
	);
}

function Section({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: React.ReactNode;
}) {
	return (
		<section className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<Heading level={3} size={4}>
					{title}
				</Heading>
				{description && (
					<Text size={2} color="gray">
						{description}
					</Text>
				)}
			</div>
			{children}
		</section>
	);
}

function ShowcasePage() {
	return (
		<div className="p-8 flex flex-col gap-12 max-w-6xl mx-auto">
			<div className="flex flex-col gap-2">
				<Heading level={1}>Component Showcase</Heading>
				<Text size={3} color="gray">
					Visual reference for all @repo/ui components and their variant combinations.
				</Text>
			</div>

			{/* ── BUTTON ── */}
			<div className="flex flex-col gap-8">
				<Heading level={2}>Button</Heading>

				<Section title="Variants × Colors">
					{BUTTON_VARIANTS.map(variant => (
						<div key={variant} className="flex flex-col gap-3">
							<Text size={2} weight="medium" color="gray" highContrast>
								{variant}
							</Text>
							<div className="flex flex-wrap items-center gap-3">
								{COLORS.map(color => (
									<PropDisplay key={color} props={{ variant, color }}>
										<Button variant={variant} color={color}>
											{color.charAt(0).toUpperCase() + color.slice(1)}
										</Button>
									</PropDisplay>
								))}
							</div>
						</div>
					))}
				</Section>

				<Section title="Sizes">
					<div className="flex flex-wrap items-end gap-3">
						{BUTTON_SIZES.map(size => (
							<PropDisplay key={size} props={{ size }}>
								<Button size={size}>
									{`Size ${size}`}
								</Button>
							</PropDisplay>
						))}
					</div>
				</Section>

				<Section title="Disabled State">
					<div className="flex flex-wrap items-center gap-3">
						{BUTTON_VARIANTS.map(variant => (
							<PropDisplay key={variant} props={{ variant, isDisabled: true }}>
								<Button variant={variant} isDisabled>
									{variant}
								</Button>
							</PropDisplay>
						))}
					</div>
				</Section>
			</div>

			<hr className="border-gray-6" />

			{/* ── BADGE ── */}
			<div className="flex flex-col gap-8">
				<Heading level={2}>Badge</Heading>

				<Section title="Variants × Colors">
					{BADGE_VARIANTS.map(variant => (
						<div key={variant} className="flex flex-col gap-3">
							<Text size={2} weight="medium" color="gray" highContrast>
								{variant}
							</Text>
							<div className="flex flex-wrap items-center gap-3">
								{COLORS.map(color => (
									<PropDisplay key={color} props={{ variant, color }}>
										<Badge variant={variant} color={color}>
											{color.charAt(0).toUpperCase() + color.slice(1)}
										</Badge>
									</PropDisplay>
								))}
							</div>
						</div>
					))}
				</Section>

				<Section title="Sizes">
					<div className="flex flex-wrap items-end gap-3">
						{BADGE_SIZES.map(size => (
							<PropDisplay key={size} props={{ size }}>
								<Badge size={size}>
									{`Size ${size}`}
								</Badge>
							</PropDisplay>
						))}
					</div>
				</Section>

				<Section
					title="High Contrast"
					description="Compares standard vs high contrast for each variant."
				>
					<div className="flex flex-col gap-4">
						{BADGE_VARIANTS.map(variant => (
							<div key={variant} className="flex flex-col gap-2">
								<Text size={2} weight="medium" color="gray" highContrast>
									{variant}
								</Text>
								<div className="flex flex-wrap items-center gap-3">
									{COLORS.map(color => (
										<div key={color} className="flex flex-col gap-1.5">
											<Badge variant={variant} color={color}>
												{color}
											</Badge>
											<Badge variant={variant} color={color} highContrast>
												{color}
												{" "}
												HC
											</Badge>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</Section>
			</div>

			<hr className="border-gray-6" />

			{/* ── TEXT ── */}
			<div className="flex flex-col gap-8">
				<Heading level={2}>Text</Heading>

				<Section title="Sizes">
					<div className="flex flex-col gap-3">
						{TEXT_SIZES.map(size => (
							<PropDisplay key={size} props={{ size }}>
								<Text size={size}>
									{`Size ${size} — The quick brown fox jumps over the lazy dog`}
								</Text>
							</PropDisplay>
						))}
					</div>
				</Section>

				<Section title="Weights">
					<div className="flex flex-col gap-3">
						{WEIGHTS.map(weight => (
							<PropDisplay key={weight} props={{ weight, size: 4 }}>
								<Text size={4} weight={weight}>
									{`${weight} — The quick brown fox jumps over the lazy dog`}
								</Text>
							</PropDisplay>
						))}
					</div>
				</Section>

				<Section title="Colors">
					<div className="flex flex-col gap-3">
						{COLORS.map(color => (
							<PropDisplay key={color} props={{ color }}>
								<Text color={color}>
									{`${color} — The quick brown fox jumps over the lazy dog`}
								</Text>
							</PropDisplay>
						))}
					</div>
				</Section>

				<Section
					title="High Contrast"
					description="Compares standard contrast (step 11) vs high contrast (step 12) for each color."
				>
					<div className="flex flex-col gap-4">
						{COLORS.map(color => (
							<div key={color} className="flex flex-col gap-2">
								<Text size={2} weight="medium" color="gray" highContrast>
									{color}
								</Text>
								<div className="flex flex-wrap items-center gap-6">
									<PropDisplay props={{ color, highContrast: false }}>
										<Text size={4} color={color}>
											Standard contrast
										</Text>
									</PropDisplay>
									<PropDisplay props={{ color, highContrast: true }}>
										<Text size={4} color={color} highContrast>
											High contrast
										</Text>
									</PropDisplay>
								</div>
							</div>
						))}
					</div>
				</Section>

				<Section
					title="Trim"
					description="Leading trim removes whitespace above/below text. The gray background shows the container boundary."
				>
					<div className="flex flex-wrap items-start gap-6">
						{TRIMS.map(trim => (
							<PropDisplay key={trim} props={{ trim, size: 5 }}>
								<div className="bg-gray-3 px-2 rounded-[var(--radius-2)]">
									<Text size={5} trim={trim}>
										{trim}
									</Text>
								</div>
							</PropDisplay>
						))}
					</div>
				</Section>
			</div>

			<hr className="border-gray-6" />

			{/* ── HEADING ── */}
			<div className="flex flex-col gap-8">
				<Heading level={2}>Heading</Heading>

				<Section
					title="Levels"
					description="Each level maps to a default visual size: h1→8, h2→7, h3→6, h4→5, h5→4, h6→3."
				>
					<div className="flex flex-col gap-4">
						{HEADING_LEVELS.map(level => (
							<PropDisplay key={level} props={{ level, "auto size": LEVEL_TO_SIZE[level] }}>
								<Heading level={level}>
									{`Heading level ${level}`}
								</Heading>
							</PropDisplay>
						))}
					</div>
				</Section>

				<Section
					title="Size Override"
					description="The size prop overrides the auto-derived size from level."
				>
					<PropDisplay props={{ level: 3, size: 9 }}>
						<Heading level={3} size={9}>
							h3 with size 9
						</Heading>
					</PropDisplay>
				</Section>

				<Section title="Weights">
					<div className="flex flex-col gap-4">
						{WEIGHTS.map(weight => (
							<PropDisplay key={weight} props={{ weight, level: 3 }}>
								<Heading level={3} weight={weight}>
									{`${weight} weight`}
								</Heading>
							</PropDisplay>
						))}
					</div>
				</Section>

				<Section title="Colors">
					<div className="flex flex-col gap-3">
						{COLORS.map(color => (
							<PropDisplay key={color} props={{ color, level: 4 }}>
								<Heading level={4} color={color}>
									{color.charAt(0).toUpperCase() + color.slice(1)}
								</Heading>
							</PropDisplay>
						))}
					</div>
				</Section>

				<Section
					title="High Contrast"
					description="Compares standard contrast (step 11) vs high contrast (step 12)."
				>
					<div className="flex flex-col gap-4">
						{COLORS.map(color => (
							<div key={color} className="flex flex-col gap-2">
								<Text size={2} weight="medium" color="gray" highContrast>
									{color}
								</Text>
								<div className="flex flex-wrap items-center gap-6">
									<PropDisplay props={{ color, highContrast: false }}>
										<Heading level={4} color={color} highContrast={false}>
											Standard
										</Heading>
									</PropDisplay>
									<PropDisplay props={{ color, highContrast: true }}>
										<Heading level={4} color={color}>
											High contrast
										</Heading>
									</PropDisplay>
								</div>
							</div>
						))}
					</div>
				</Section>

				<Section
					title="Trim"
					description="Leading trim removes whitespace above/below the heading. The gray background shows the container boundary."
				>
					<div className="flex flex-wrap items-start gap-6">
						{TRIMS.map(trim => (
							<PropDisplay key={trim} props={{ trim, level: 4 }}>
								<div className="bg-gray-3 px-2 rounded-[var(--radius-2)]">
									<Heading level={4} trim={trim}>
										{trim}
									</Heading>
								</div>
							</PropDisplay>
						))}
					</div>
				</Section>
			</div>
		</div>
	);
}
