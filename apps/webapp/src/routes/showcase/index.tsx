import { Badge, Button, Heading, Text } from "@repo/ui";
import { createFileRoute, Link } from "@tanstack/react-router";

const COMPONENT_CARDS = [
	{
		name: "Badge",
		description: "Displays a short status indicator or label.",
		to: "/showcase/badge",
		preview: (
			<div className="flex flex-wrap items-center gap-2">
				<Badge variant="soft" color="terracotta">New</Badge>
				<Badge variant="solid" color="sage">Active</Badge>
				<Badge variant="outline" color="gray">Draft</Badge>
				<Badge variant="surface" color="amber">Pending</Badge>
			</div>
		),
	},
	{
		name: "Button",
		description: "Triggers an action or event.",
		to: "/showcase/button",
		preview: (
			<div className="flex flex-wrap items-center gap-2">
				<Button variant="solid" size={2}>Primary</Button>
				<Button variant="soft" size={2} color="sage">Secondary</Button>
				<Button variant="outline" size={2} color="gray">Outline</Button>
			</div>
		),
	},
	{
		name: "Heading",
		description: "Semantic heading with automatic size mapping from level.",
		to: "/showcase/heading",
		preview: (
			<div className="flex flex-col gap-1">
				<Heading level={2} size={5}>Page Title</Heading>
				<Heading level={3} size={3} weight="medium" color="gray" highContrast={false}>Subtitle text</Heading>
			</div>
		),
	},
	{
		name: "Text",
		description: "Renders inline or block text with typographic controls.",
		to: "/showcase/text",
		preview: (
			<div className="flex flex-col gap-1">
				<Text size={3} weight="medium" highContrast>Body text in medium weight</Text>
				<Text size={2} color="gray">Secondary description text</Text>
			</div>
		),
	},
] as const;

function ShowcaseIndex() {
	return (
		<div className="flex flex-col gap-10">
			<div className="flex flex-col gap-2">
				<Heading level={1} size={6}>
					Components
				</Heading>
				<Text size={3} color="gray">
					Visual reference for all @repo/ui components. Select a component to view its API and examples.
				</Text>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{COMPONENT_CARDS.map(card => (
					<Link
						key={card.name}
						to={card.to}
						className="group flex flex-col gap-4 rounded-lg border border-gray-6 bg-gray-2 p-5 transition-colors hover:border-gray-8 hover:bg-gray-3"
					>
						<div className="flex min-h-16 items-center">
							{card.preview}
						</div>
						<div className="flex flex-col gap-1">
							<Heading level={3} size={3} weight="medium">
								{card.name}
							</Heading>
							<Text size={2} color="gray">
								{card.description}
							</Text>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}

export const Route = createFileRoute("/showcase/")({
	component: ShowcaseIndex,
});
