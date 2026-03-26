import { Link, Text } from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";

import { AppLink } from "../../components/link";
import { DemoSection, PageHeader, Playground, PropTable } from "./-components";

const COLORS = ["terracotta", "sage", "yellow", "gray", "red", "amber"] as const;
const SIZES = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const WEIGHTS = ["light", "regular", "medium", "bold"] as const;
const UNDERLINES = ["auto", "always", "hover", "none"] as const;
const TRIMS = ["normal", "start", "end", "both"] as const;

const PROPS = [
	{ name: "color", type: "\"terracotta\" | \"sage\" | \"yellow\" | \"gray\" | \"red\" | \"amber\"", default: "\"terracotta\"" },
	{ name: "size", type: "1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9", default: "3" },
	{ name: "weight", type: "\"light\" | \"regular\" | \"medium\" | \"bold\"", default: "\"regular\"" },
	{ name: "underline", type: "\"auto\" | \"always\" | \"hover\" | \"none\"", default: "\"auto\"" },
	{ name: "highContrast", type: "boolean", default: "false" },
	{ name: "trim", type: "\"normal\" | \"start\" | \"end\" | \"both\"", default: "\"normal\"" },
	{ name: "truncate", type: "boolean", default: "false" },
	{ name: "wrap", type: "\"wrap\" | \"nowrap\" | \"pretty\" | \"balance\"", default: "\"wrap\"" },
];

function LinkPage() {
	return (
		<div className="flex flex-col gap-10">
			<PageHeader
				title="Link"
				description="Typographic navigation element with underline styling."
			/>

			<Playground
				componentName="Link"
				childrenLabel="Click me"
				defaults={{ size: 3, weight: "regular", color: "terracotta", underline: "auto", highContrast: false, trim: "normal" }}
				controls={[
					{ name: "size", type: "segment", options: SIZES },
					{ name: "weight", type: "segment", options: WEIGHTS },
					{ name: "color", type: "segment", options: COLORS },
					{ name: "underline", type: "segment", options: UNDERLINES },
					{ name: "trim", type: "segment", options: TRIMS },
					{ name: "highContrast", type: "toggle" },
				]}
			>
				{props => (
					<Link
						href="#"
						size={props.size as any}
						weight={props.weight as any}
						color={props.color as any}
						underline={props.underline as any}
						highContrast={props.highContrast as boolean}
						trim={props.trim as any}
					>
						Click me
					</Link>
				)}
			</Playground>

			<PropTable data={PROPS} />

			<DemoSection title="Underline" description="Four underline modes: auto (hover-only), always, hover, and none.">
				<div className="flex flex-wrap items-center gap-6">
					{UNDERLINES.map(underline => (
						<Link key={underline} href="#" underline={underline}>
							{underline}
						</Link>
					))}
				</div>
			</DemoSection>

			<DemoSection title="Size" description="Nine sizes from fine print to display text.">
				<div className="flex flex-col gap-3">
					{SIZES.map(size => (
						<Link key={size} href="#" size={size}>
							Size
							{" "}
							{size}
							{" "}
							— The quick brown fox
						</Link>
					))}
				</div>
			</DemoSection>

			<DemoSection title="Color" description="Available color options at standard contrast.">
				<div className="flex flex-wrap items-center gap-6">
					{COLORS.map(color => (
						<Link key={color} href="#" color={color} underline="always">
							{color.charAt(0).toUpperCase() + color.slice(1)}
						</Link>
					))}
				</div>
			</DemoSection>

			<DemoSection title="Underline × Color" description="All underline and color combinations.">
				<div className="flex flex-col gap-4">
					{UNDERLINES.map(underline => (
						<div key={underline} className="flex flex-wrap items-center gap-6">
							<Text size={1} color="gray" className="w-14">{underline}</Text>
							{COLORS.map(color => (
								<Link key={color} href="#" color={color} underline={underline}>
									{color.charAt(0).toUpperCase() + color.slice(1)}
								</Link>
							))}
						</div>
					))}
				</div>
			</DemoSection>

			<DemoSection title="High Contrast" description="Standard contrast (step 11) vs high contrast (step 12). High contrast forces underline visible in auto mode.">
				<div className="flex flex-col gap-4">
					{COLORS.map(color => (
						<div key={color} className="flex flex-wrap items-center gap-6">
							<Link href="#" color={color} underline="always">
								{color}
								{" "}
								standard
							</Link>
							<Link href="#" color={color} underline="auto" highContrast>
								{color}
								{" "}
								high contrast
							</Link>
						</div>
					))}
				</div>
			</DemoSection>

			<DemoSection title="Weight" description="Four weights for typographic emphasis.">
				<div className="flex flex-wrap items-center gap-6">
					{WEIGHTS.map(weight => (
						<Link key={weight} href="#" weight={weight} underline="always">
							{weight.charAt(0).toUpperCase() + weight.slice(1)}
						</Link>
					))}
				</div>
			</DemoSection>

			<DemoSection title="Inline in Text" description="Link used inline within a paragraph.">
				<Text size={3} color="gray">
					This is a paragraph with a
					{" "}
					<Link href="#">link inline</Link>
					{" "}
					that blends with the surrounding text. Links can also be
					{" "}
					<Link href="#" color="sage" underline="always">always underlined</Link>
					{" "}
					or
					{" "}
					<Link href="#" color="red" highContrast>high contrast</Link>
					.
				</Text>
			</DemoSection>

			<DemoSection title="Disabled" description="Disabled state with reduced opacity and no underline.">
				<div className="flex flex-wrap items-center gap-6">
					<Link href="#" isDisabled>Disabled link</Link>
					<Link href="#" isDisabled color="sage" underline="always">Disabled always</Link>
					<Link href="#" isDisabled highContrast>Disabled high contrast</Link>
				</div>
			</DemoSection>

			<DemoSection
				title="Trim"
				description="Leading trim removes whitespace above and below. The background shows the container boundary."
			>
				<div className="flex flex-wrap items-start gap-6">
					{TRIMS.map(trim => (
						<div key={trim} className="flex flex-col items-center gap-2">
							<div className="rounded-[var(--radius-2)] bg-gray-a3 px-3">
								<Link href="#" size={5} trim={trim} underline="always">
									{trim}
								</Link>
							</div>
							<Text size={1} color="gray">{trim}</Text>
						</div>
					))}
				</div>
			</DemoSection>

			<DemoSection title="Router Integration" description="AppLink using TanStack Router's createLink for type-safe navigation.">
				<div className="flex flex-wrap items-center gap-6">
					<AppLink to="/showcase" color="terracotta" underline="always">
						Showcase Home
					</AppLink>
					<AppLink to="/showcase/button" color="sage" underline="always">
						Button Page
					</AppLink>
					<AppLink to="/showcase/text" color="gray" underline="always">
						Text Page
					</AppLink>
				</div>
			</DemoSection>
		</div>
	);
}

export const Route = createFileRoute("/showcase/link")({
	component: LinkPage,
});
