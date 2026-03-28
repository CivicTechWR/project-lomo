import { Button, Heading, Text } from "@repo/ui";
import { DialogTrigger, Modal, ModalOverlay } from "@repo/ui/modal";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { DemoSection, PageHeader, PropTable } from "./-components";

const SIZES = [1, 2, 3, 4] as const;
const ROLES = ["dialog", "alertdialog"] as const;

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

function ModalPlayground() {
	const [state, setState] = useState({
		size: 3 as (typeof SIZES)[number],
		role: "dialog" as (typeof ROLES)[number],
		isDismissable: false,
	});

	const update = (key: string, value: string | number | boolean) => {
		setState(prev => ({ ...prev, [key]: value }) as typeof prev);
	};

	function generateSnippet() {
		const triggerLines: string[] = ["<DialogTrigger>"];
		triggerLines.push("  <Button>Open</Button>");

		const overlayProps: string[] = [];
		if (state.isDismissable)
			overlayProps.push("isDismissable");
		const overlayTag = overlayProps.length > 0
			? `  <ModalOverlay ${overlayProps.join(" ")}>`
			: "  <ModalOverlay>";
		triggerLines.push(overlayTag);

		const modalProps: string[] = [];
		if (state.size !== 3)
			modalProps.push(`size={${state.size}}`);
		if (state.role !== "dialog")
			modalProps.push(`role="${state.role}"`);
		const modalTag = modalProps.length > 0
			? `    <Modal ${modalProps.join(" ")}>`
			: "    <Modal>";
		triggerLines.push(modalTag);

		triggerLines.push("      {/* content */}");
		triggerLines.push("    </Modal>");
		triggerLines.push("  </ModalOverlay>");
		triggerLines.push("</DialogTrigger>");
		return triggerLines.join("\n");
	}

	const segments: { name: string; options: readonly (string | number)[] }[] = [
		{ name: "size", options: SIZES },
		{ name: "role", options: ROLES },
	];

	const toggles: { name: string; checked: boolean }[] = [
		{ name: "isDismissable", checked: state.isDismissable },
	];

	return (
		<section className="flex flex-col gap-4">
			<Text size={1} weight="medium" color="gray" className="uppercase tracking-wider">
				Playground
			</Text>

			<div className="flex min-h-28 items-center justify-center rounded-lg border border-gray-6 bg-gray-2 p-8">
				<DialogTrigger>
					<Button>Open Modal</Button>
					<ModalOverlay isDismissable={state.isDismissable}>
						<Modal size={state.size} role={state.role}>
							<Heading slot="title" size={5}>Modal Preview</Heading>
							<Text elementType="p" size={3} color="gray" className="mt-2">
								This is a playground preview of the Modal component.
							</Text>
							<div className="mt-5 flex justify-end gap-3">
								<Button slot="close" variant="soft" color="gray">Close</Button>
							</div>
						</Modal>
					</ModalOverlay>
				</DialogTrigger>
			</div>

			<div className="flex flex-wrap gap-x-6 gap-y-4">
				{segments.map(control => (
					<div key={control.name} className="flex flex-col gap-1.5">
						<span className="text-[length:var(--text-1)] font-medium text-gray-11">
							{control.name}
						</span>
						<div className="inline-flex flex-wrap gap-0.5 rounded-md bg-gray-3 p-0.5">
							{control.options.map(option => (
								<button
									key={String(option)}
									type="button"
									onClick={() => update(control.name, option)}
									className={`rounded-[5px] px-2.5 py-1 text-[length:var(--text-1)] transition-colors ${
										state[control.name as keyof typeof state] === option
											? "bg-white font-medium text-gray-12 shadow-sm"
											: "text-gray-11 hover:text-gray-12"
									}`}
								>
									{String(option)}
								</button>
							))}
						</div>
					</div>
				))}
			</div>

			<div className="flex flex-wrap gap-x-6 gap-y-4">
				{toggles.map(control => (
					<div key={control.name} className="flex flex-col gap-1.5">
						<span className="text-[length:var(--text-1)] font-medium text-gray-11">
							{control.name}
						</span>
						<label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-gray-3 px-3 py-1.5">
							<input
								type="checkbox"
								checked={control.checked}
								onChange={e => update(control.name, e.target.checked)}
								className="h-3.5 w-3.5 rounded accent-terracotta-9"
							/>
							<span className="text-[length:var(--text-1)] text-gray-11">
								{control.checked ? "On" : "Off"}
							</span>
						</label>
					</div>
				))}
			</div>

			<pre className="overflow-x-auto rounded-lg border border-gray-6 bg-gray-2 p-4 font-mono text-[length:var(--text-1)] leading-relaxed text-gray-12">
				<code>{generateSnippet()}</code>
			</pre>
		</section>
	);
}

function ModalPage() {
	return (
		<div className="flex flex-col gap-10">
			<PageHeader
				title="Modal"
				description="Modal overlay for confirmations, detail views, and multi-step flows."
			/>

			<ModalPlayground />

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
