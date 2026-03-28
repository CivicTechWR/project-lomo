import { Button, Heading, Text } from "@repo/ui";
import { DialogTrigger, Modal, ModalOverlay } from "@repo/ui/modal";
import { createFileRoute } from "@tanstack/react-router";

import { DemoSection, PageHeader, PropTable } from "./-components";

const SIZES = [1, 2, 3, 4] as const;

const MODAL_OVERLAY_PROPS = [
	{ name: "isDismissable", type: "boolean", default: "false" },
	{ name: "isKeyboardDismissDisabled", type: "boolean", default: "false" },
	{ name: "isOpen", type: "boolean", default: "—" },
	{ name: "defaultOpen", type: "boolean", default: "—" },
	{ name: "onOpenChange", type: "(isOpen: boolean) => void", default: "—" },
	{ name: "className", type: "string", default: "—" },
];

const MODAL_PROPS = [
	{ name: "size", type: "1 | 2 | 3 | 4", default: "3" },
	{ name: "role", type: "\"dialog\" | \"alertdialog\"", default: "\"dialog\"" },
	{ name: "aria-label", type: "string", default: "—" },
	{ name: "aria-labelledby", type: "string", default: "—" },
	{ name: "className", type: "string", default: "—" },
	{ name: "children", type: "ReactNode | (opts: { close }) => ReactNode", default: "—" },
];

function ModalPage() {
	return (
		<div className="flex flex-col gap-10">
			<PageHeader
				title="Modal"
				description="Modal overlay for confirmations, detail views, and multi-step flows."
			/>

			<div className="flex flex-col gap-3">
				<Heading level={3} size={3} weight="medium">ModalOverlay Props</Heading>
				<PropTable data={MODAL_OVERLAY_PROPS} />
			</div>

			<div className="flex flex-col gap-3">
				<Heading level={3} size={3} weight="medium">Modal Props</Heading>
				<PropTable data={MODAL_PROPS} />
			</div>

			<DemoSection title="Basic" description="A simple dialog with title, description, and close button.">
				<DialogTrigger>
					<Button>Open Dialog</Button>
					<ModalOverlay isDismissable>
						<Modal>
							<Heading slot="title" size={5}>Welcome</Heading>
							<Text elementType="p" size={3} color="gray" className="mt-2">
								This is a basic dialog with a title, description, and a close button.
							</Text>
							<div className="mt-5 flex justify-end gap-3">
								<Button slot="close" variant="soft" color="gray">Close</Button>
							</div>
						</Modal>
					</ModalOverlay>
				</DialogTrigger>
			</DemoSection>

			<DemoSection title="Size" description="Four sizes controlling padding and border radius.">
				<div className="flex flex-wrap items-center gap-3">
					{SIZES.map(size => (
						<DialogTrigger key={size}>
							<Button variant="soft">
								Size
								{" "}
								{size}
							</Button>
							<ModalOverlay isDismissable>
								<Modal size={size}>
									<Heading slot="title" size={5}>
										Size
										{" "}
										{size}
									</Heading>
									<Text elementType="p" size={3} color="gray" className="mt-2">
										This dialog uses size
										{" "}
										{size}
										. Notice the padding and border radius change.
									</Text>
									<div className="mt-5 flex justify-end gap-3">
										<Button slot="close" variant="soft" color="gray" size={size}>Close</Button>
									</div>
								</Modal>
							</ModalOverlay>
						</DialogTrigger>
					))}
				</div>
			</DemoSection>

			<DemoSection title="Width Override" description="Default max-width is max-w-lg (512px). Override via className.">
				<div className="flex flex-wrap items-center gap-3">
					<DialogTrigger>
						<Button variant="soft">Narrow (max-w-sm)</Button>
						<ModalOverlay isDismissable>
							<Modal className="max-w-sm">
								<Heading slot="title" size={5}>Narrow Dialog</Heading>
								<Text elementType="p" size={3} color="gray" className="mt-2">
									This dialog uses max-w-sm (384px).
								</Text>
								<div className="mt-5 flex justify-end gap-3">
									<Button slot="close" variant="soft" color="gray">Close</Button>
								</div>
							</Modal>
						</ModalOverlay>
					</DialogTrigger>
					<DialogTrigger>
						<Button variant="soft">Wide (max-w-2xl)</Button>
						<ModalOverlay isDismissable>
							<Modal className="max-w-2xl">
								<Heading slot="title" size={5}>Wide Dialog</Heading>
								<Text elementType="p" size={3} color="gray" className="mt-2">
									This dialog uses max-w-2xl (672px). Useful for detail views or forms with more content.
								</Text>
								<div className="mt-5 flex justify-end gap-3">
									<Button slot="close" variant="soft" color="gray">Close</Button>
								</div>
							</Modal>
						</ModalOverlay>
					</DialogTrigger>
				</div>
			</DemoSection>

			<DemoSection title="Alert Dialog" description="Non-dismissable dialog for confirmations. Uses role='alertdialog' and render props for close.">
				<DialogTrigger>
					<Button color="red">Delete Item</Button>
					<ModalOverlay>
						<Modal role="alertdialog" className="max-w-sm">
							{({ close }) => (
								<>
									<Heading slot="title" size={5}>Confirm Delete</Heading>
									<Text elementType="p" size={3} color="gray" className="mt-2">
										This action cannot be undone. Are you sure you want to delete this item?
									</Text>
									<div className="mt-5 flex justify-end gap-3">
										<Button variant="soft" color="gray" onPress={close}>Cancel</Button>
										<Button color="red" onPress={close}>Delete</Button>
									</div>
								</>
							)}
						</Modal>
					</ModalOverlay>
				</DialogTrigger>
			</DemoSection>

			<DemoSection title="Long Content" description="When content exceeds viewport height, the overlay scrolls.">
				<DialogTrigger>
					<Button variant="soft">Open Long Dialog</Button>
					<ModalOverlay isDismissable>
						<Modal>
							<Heading slot="title" size={5}>Terms of Service</Heading>
							<div className="mt-3 flex flex-col gap-3">
								{Array.from({ length: 12 }, (_, i) => (
									<Text key={i} elementType="p" size={2} color="gray">
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
										incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
										nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
									</Text>
								))}
							</div>
							<div className="mt-5 flex justify-end gap-3">
								<Button slot="close" variant="soft" color="gray">Decline</Button>
								<Button slot="close">Accept</Button>
							</div>
						</Modal>
					</ModalOverlay>
				</DialogTrigger>
			</DemoSection>
		</div>
	);
}

export const Route = createFileRoute("/showcase/modal")({
	component: ModalPage,
});
