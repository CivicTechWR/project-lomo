import { Badge, Button, Card, Checkbox, CheckboxCard, CheckboxCardGroup, CheckboxIndicator, DialogTrigger, Group, Heading, Input, Label, Modal, ModalOverlay, Text, TextField, Link as UILink } from "@repo/ui";
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
		name: "Card",
		description: "Tonal surface container for grouping content.",
		to: "/showcase/card",
		preview: (
			<div className="flex items-center gap-2">
				<Card size={1} variant="surface"><Text size={1}>Surface</Text></Card>
				<Card size={1} variant="classic"><Text size={1}>Classic</Text></Card>
				<Card size={1} variant="ghost" color="terracotta"><Text size={1}>Ghost</Text></Card>
			</div>
		),
	},
	{
		name: "Checkbox",
		description: "Toggleable selection control with composable indicator.",
		to: "/showcase/checkbox",
		preview: (
			<div className="flex flex-col gap-2">
				<Checkbox defaultSelected color="terracotta">
					<CheckboxIndicator />
					Selected
				</Checkbox>
				<Checkbox color="sage">
					<CheckboxIndicator />
					Unchecked
				</Checkbox>
			</div>
		),
	},
	{
		name: "Checkbox Card",
		description: "Card-style selection control for multi-option grids.",
		to: "/showcase/checkbox-card",
		preview: (
			<CheckboxCardGroup color="sage" className="grid w-full grid-cols-2 gap-2">
				<CheckboxCard value="a" defaultSelected>
					<Text size={1} weight="medium">Selected</Text>
				</CheckboxCard>
				<CheckboxCard value="b">
					<Text size={1} weight="medium">Option</Text>
				</CheckboxCard>
			</CheckboxCardGroup>
		),
	},
	{
		name: "Modal",
		description: "Modal overlay for confirmations, detail views, and multi-step flows.",
		to: "/showcase/modal",
		preview: (
			<div className="flex flex-wrap items-center gap-2">
				<DialogTrigger>
					<Button variant="soft" size={1}>Open</Button>
					<ModalOverlay isDismissable>
						<Modal size={2} className="max-w-xs">
							<Heading slot="title" size={4}>Dialog</Heading>
							<Text elementType="p" size={2} color="gray" className="mt-1">A simple modal dialog.</Text>
							<div className="mt-3 flex justify-end">
								<Button slot="close" variant="soft" color="gray" size={1}>Close</Button>
							</div>
						</Modal>
					</ModalOverlay>
				</DialogTrigger>
			</div>
		),
	},
	{
		name: "Link",
		description: "Typographic navigation element with underline styling.",
		to: "/showcase/link",
		preview: (
			<div className="flex flex-wrap items-center gap-4">
				<UILink href="#" color="terracotta" underline="always">Terracotta</UILink>
				<UILink href="#" color="sage" underline="always">Sage</UILink>
				<UILink href="#" color="gray" underline="auto" highContrast>High contrast</UILink>
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
	{
		name: "TextField",
		description: "Composable text input with label, description, and validation.",
		to: "/showcase/text-field",
		preview: (
			<div className="flex flex-col gap-2 w-full max-w-xs">
				<TextField size={1} color="sage">
					<Label>Email</Label>
					<Group>
						<Input placeholder="you@example.com" />
					</Group>
				</TextField>
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
