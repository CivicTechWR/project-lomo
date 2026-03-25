import { Card, Heading, Text } from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";

import { DemoSection, PageHeader, Playground, PropTable } from "./-components";

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

			<PropTable data={PROPS} />

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

			<DemoSection title="Variant × Color" description="All variant and color combinations.">
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
	);
}

export const Route = createFileRoute("/showcase/card")({
	component: CardPage,
});
