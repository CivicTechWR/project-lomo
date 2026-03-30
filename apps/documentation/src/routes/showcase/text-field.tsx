import {
	EnvelopeIcon,
	LockClosedIcon,
	MagnifyingGlassIcon,
	UserIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import {
	Button,
	Description,
	FieldError,
	Group,
	Input,
	InputSlot,
	Label,
	Text,
	TextArea,
	TextField,
} from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { DemoSection, PageHeader, PropTable } from "./-components";

const COLORS = ["terracotta", "sage", "yellow", "gray", "red", "amber"] as const;
const VARIANTS = ["surface", "classic", "soft"] as const;
const SIZES = [1, 2, 3] as const;
const SLOT_OPTIONS = ["none", "start", "end", "both"] as const;

const TEXT_FIELD_PROPS = [
	{ name: "variant", type: "\"surface\" | \"classic\" | \"soft\"", default: "\"surface\"" },
	{ name: "size", type: "1 | 2 | 3", default: "2" },
	{ name: "color", type: "\"terracotta\" | \"sage\" | ... | \"amber\"", default: "\"gray\"" },
	{ name: "orientation", type: "\"vertical\" | \"horizontal\"", default: "\"vertical\"" },
	{ name: "isDisabled", type: "boolean", default: "false" },
	{ name: "isInvalid", type: "boolean", default: "false" },
	{ name: "isRequired", type: "boolean", default: "false" },
	{ name: "isReadOnly", type: "boolean", default: "false" },
];

function TextFieldPlayground() {
	const [state, setState] = useState({
		variant: "surface" as (typeof VARIANTS)[number],
		size: 2 as (typeof SIZES)[number],
		color: "gray" as (typeof COLORS)[number],
		slots: "none" as (typeof SLOT_OPTIONS)[number],
		isDisabled: false,
		useTextArea: false,
		label: "Email address",
		description: "",
		errorMessage: "",
	});

	const update = (key: string, value: string | number | boolean) => {
		setState(prev => ({ ...prev, [key]: value }) as typeof prev);
	};

	const hasStart = state.slots === "start" || state.slots === "both";
	const hasEnd = state.slots === "end" || state.slots === "both";
	const isInvalid = state.errorMessage.length > 0;

	function generateSnippet() {
		const props: string[] = [];
		if (state.variant !== "surface")
			props.push(`variant="${state.variant}"`);
		if (state.size !== 2)
			props.push(`size={${state.size}}`);
		if (state.color !== "gray")
			props.push(`color="${state.color}"`);
		if (isInvalid)
			props.push("isInvalid");
		if (state.isDisabled)
			props.push("isDisabled");

		const openTag = props.length > 0
			? `<TextField ${props.join(" ")}>`
			: "<TextField>";

		const lines: string[] = [openTag];
		lines.push(`  <Label>${state.label}</Label>`);
		if (state.description)
			lines.push(`  <Description>${state.description}</Description>`);
		lines.push("  <Group>");
		if (hasStart)
			lines.push("    <InputSlot side=\"start\"><EnvelopeIcon /></InputSlot>");
		if (state.useTextArea)
			lines.push("    <TextArea rows={4} placeholder=\"Tell us more...\" />");
		else
			lines.push("    <Input placeholder=\"you@example.com\" />");
		if (hasEnd)
			lines.push("    <InputSlot side=\"end\"><XMarkIcon /></InputSlot>");
		lines.push("  </Group>");
		if (state.errorMessage)
			lines.push(`  <FieldError>${state.errorMessage}</FieldError>`);
		lines.push("</TextField>");
		return lines.join("\n");
	}

	const segments: { name: string; options: readonly (string | number)[] }[] = [
		{ name: "variant", options: VARIANTS },
		{ name: "size", options: SIZES },
		{ name: "color", options: COLORS },
		{ name: "slots", options: SLOT_OPTIONS },
	];

	const toggles: { name: string; checked: boolean }[] = [
		{ name: "isDisabled", checked: state.isDisabled },
		{ name: "useTextArea", checked: state.useTextArea },
	];

	const textInputs: { name: string; value: string }[] = [
		{ name: "label", value: state.label },
		{ name: "description", value: state.description },
		{ name: "errorMessage", value: state.errorMessage },
	];

	return (
		<section className="flex flex-col gap-4">
			<Text size={1} weight="medium" color="gray" className="uppercase tracking-wider">
				Playground
			</Text>

			<div className="flex min-h-28 items-center justify-center rounded-lg border border-gray-6 bg-gray-2 p-8">
				<div className="w-full max-w-md">
					<TextField
						variant={state.variant}
						size={state.size}
						color={state.color}
						isDisabled={state.isDisabled}
						isInvalid={isInvalid}
					>
						<Label>{state.label}</Label>
						{state.description && <Description>{state.description}</Description>}
						<Group>
							{hasStart && (
								<InputSlot side="start"><EnvelopeIcon /></InputSlot>
							)}
							{state.useTextArea
								? <TextArea rows={4} placeholder="Tell us more..." />
								: <Input placeholder="you@example.com" />}
							{hasEnd && (
								<InputSlot side="end"><XMarkIcon /></InputSlot>
							)}
						</Group>
						{state.errorMessage && <FieldError>{state.errorMessage}</FieldError>}
					</TextField>
				</div>
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

			<div className="flex flex-wrap gap-x-6 gap-y-4">
				{textInputs.map(control => (
					<div key={control.name} className="flex flex-col gap-1.5">
						<span className="text-[length:var(--text-1)] font-medium text-gray-11">
							{control.name}
						</span>
						<input
							type="text"
							value={control.value}
							onChange={e => update(control.name, e.target.value)}
							className="rounded-md bg-gray-3 px-3 py-1.5 text-[length:var(--text-1)] text-gray-12 outline-none"
						/>
					</div>
				))}
			</div>

			<pre className="overflow-x-auto rounded-lg border border-gray-6 bg-gray-2 p-4 font-mono text-[length:var(--text-1)] leading-relaxed text-gray-12">
				<code>{generateSnippet()}</code>
			</pre>
		</section>
	);
}

function TextFieldPage() {
	return (
		<div className="flex flex-col gap-10">
			<PageHeader
				title="TextField"
				description="Composable text input with label, description, validation, and slot support. Built from independent primitives orchestrated by a shared context."
			/>

			<TextFieldPlayground />

			{/* ── Composition Guide ── */}
			<DemoSection
				title="Composition Model"
				description="TextField is not a single component — it's a set of composable parts. TextField provides context (variant, size, color) and all children consume it automatically."
			>
				<div className="flex flex-col gap-4">
					<pre className="overflow-x-auto rounded-md bg-gray-3 p-4 font-mono text-[length:var(--text-1)] leading-relaxed text-gray-12">
						<code>
							{`<TextField variant="surface" size={2} color="sage">
  <Label>Email address</Label>
  <Description>We'll never share your email</Description>
  <Group>
    <InputSlot side="start"><MailIcon /></InputSlot>
    <Input placeholder="you@example.com" />
  </Group>
  <FieldError />
</TextField>`}
						</code>
					</pre>
					<TextField variant="surface" size={2} color="sage">
						<Label>Email address</Label>
						<Description>We'll never share your email</Description>
						<Group>
							<InputSlot side="start"><EnvelopeIcon /></InputSlot>
							<Input placeholder="you@example.com" />
						</Group>
					</TextField>
				</div>
			</DemoSection>

			{/* ── TextField Props ── */}
			<PropTable data={TEXT_FIELD_PROPS} />

			{/* ── Component Parts ── */}
			<DemoSection
				title="Component Parts"
				description="Each part is an independent styled component. TextField provides context, children consume it."
			>
				<table className="w-full text-left">
					<thead>
						<tr className="border-b border-gray-6">
							<th className="pb-2 text-[length:var(--text-2)] font-medium text-gray-12">Part</th>
							<th className="pb-2 text-[length:var(--text-2)] font-medium text-gray-12">Role</th>
						</tr>
					</thead>
					<tbody className="text-[length:var(--text-2)] text-gray-11">
						<tr className="border-b border-gray-6">
							<td className="py-2"><code className="rounded bg-gray-a3 px-1 text-[length:var(--text-1)] text-terracotta-11">TextField</code></td>
							<td className="py-2">Context provider + layout wrapper. Owns variant, size, color.</td>
						</tr>
						<tr className="border-b border-gray-6">
							<td className="py-2"><code className="rounded bg-gray-a3 px-1 text-[length:var(--text-1)] text-terracotta-11">Label</code></td>
							<td className="py-2">Styled label. Always font-medium text-gray-12. Scales with size.</td>
						</tr>
						<tr className="border-b border-gray-6">
							<td className="py-2"><code className="rounded bg-gray-a3 px-1 text-[length:var(--text-1)] text-terracotta-11">Description</code></td>
							<td className="py-2">Helper text below label. Pre-sets slot="description" for aria-describedby.</td>
						</tr>
						<tr className="border-b border-gray-6">
							<td className="py-2"><code className="rounded bg-gray-a3 px-1 text-[length:var(--text-1)] text-terracotta-11">Group</code></td>
							<td className="py-2">Visual container — border, background, focus ring, hover/invalid states.</td>
						</tr>
						<tr className="border-b border-gray-6">
							<td className="py-2"><code className="rounded bg-gray-a3 px-1 text-[length:var(--text-1)] text-terracotta-11">InputSlot</code></td>
							<td className="py-2">Prefix/suffix container. Auto-sizes icons. side="start" | "end".</td>
						</tr>
						<tr className="border-b border-gray-6">
							<td className="py-2"><code className="rounded bg-gray-a3 px-1 text-[length:var(--text-1)] text-terracotta-11">Input</code></td>
							<td className="py-2">Styled input element. Transparent, inherits font from Group.</td>
						</tr>
						<tr className="border-b border-gray-6">
							<td className="py-2"><code className="rounded bg-gray-a3 px-1 text-[length:var(--text-1)] text-terracotta-11">TextArea</code></td>
							<td className="py-2">Multi-line input. Supports resize prop. Used instead of Input.</td>
						</tr>
						<tr>
							<td className="py-2"><code className="rounded bg-gray-a3 px-1 text-[length:var(--text-1)] text-terracotta-11">FieldError</code></td>
							<td className="py-2">Validation errors. Always red. Renders list for multiple errors.</td>
						</tr>
					</tbody>
				</table>
			</DemoSection>

			{/* ── Variants ── */}
			<DemoSection title="Variant" description="Three visual styles for the input container. Variant is set on TextField and flows to Group via context.">
				<div className="flex flex-col gap-4">
					{VARIANTS.map(variant => (
						<TextField key={variant} variant={variant} color="sage">
							<Label>{variant.charAt(0).toUpperCase() + variant.slice(1)}</Label>
							<Group>
								<Input placeholder={`${variant} variant`} />
							</Group>
						</TextField>
					))}
				</div>
			</DemoSection>

			{/* ── Sizes ── */}
			<DemoSection title="Size" description="Three sizes that control Label text, Group height/padding, and FieldError text. Heights match Button sizes for inline alignment.">
				<div className="flex flex-col gap-4">
					{SIZES.map(size => (
						<TextField key={size} size={size}>
							<Label>
								Size
								{" "}
								{size}
							</Label>
							<Group>
								<Input placeholder={`Size ${size} input`} />
							</Group>
						</TextField>
					))}
				</div>
			</DemoSection>

			{/* ── Colors (soft variant) ── */}
			<DemoSection title="Color" description="All palette colors shown in the soft variant to demonstrate accent tinting. Surface and classic use neutral borders with accent only on focus ring.">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{COLORS.map(color => (
						<TextField key={color} variant="soft" color={color}>
							<Label>{color.charAt(0).toUpperCase() + color.slice(1)}</Label>
							<Group>
								<Input placeholder={`${color} soft`} />
							</Group>
						</TextField>
					))}
				</div>
			</DemoSection>

			{/* ── InputSlot ── */}
			<DemoSection title="InputSlot" description="Prefix and suffix slots for icons or controls. Icons auto-size based on the field's size.">
				<div className="flex flex-col gap-4">
					<TextField color="sage">
						<Label>Search</Label>
						<Group>
							<InputSlot side="start"><MagnifyingGlassIcon /></InputSlot>
							<Input placeholder="Search requests..." />
						</Group>
					</TextField>

					<TextField color="terracotta">
						<Label>Password</Label>
						<Group>
							<InputSlot side="start"><LockClosedIcon /></InputSlot>
							<Input type="password" placeholder="Enter password" />
						</Group>
					</TextField>

					<TextField color="sage">
						<Label>Username</Label>
						<Group>
							<InputSlot side="start"><UserIcon /></InputSlot>
							<Input placeholder="johndoe" />
							<InputSlot side="end"><XMarkIcon /></InputSlot>
						</Group>
					</TextField>
				</div>
			</DemoSection>

			{/* ── TextArea ── */}
			<DemoSection title="TextArea" description="Multi-line input used inside Group instead of Input. Supports resize prop.">
				<div className="flex flex-col gap-4">
					<TextField size={2} color="sage">
						<Label>Description</Label>
						<Description>Describe your request in detail</Description>
						<Group>
							<TextArea rows={4} resize="vertical" placeholder="Tell us more..." />
						</Group>
					</TextField>
				</div>
			</DemoSection>

			{/* ── Description ── */}
			<DemoSection title="Description" description="Helper text between label and input. Automatically wires up aria-describedby via RAC's slot system.">
				<TextField color="sage">
					<Label>Display name</Label>
					<Description>This is how others will see you in the community</Description>
					<Group>
						<Input placeholder="John Doe" />
					</Group>
				</TextField>
			</DemoSection>

			{/* ── Invalid ── */}
			<DemoSection title="Invalid State" description="Set isInvalid on TextField. Border, focus ring, and soft background shift to red across all variants.">
				<div className="flex flex-col gap-4">
					{VARIANTS.map(variant => (
						<TextField key={variant} variant={variant} color="sage" isInvalid>
							<Label>
								{variant.charAt(0).toUpperCase() + variant.slice(1)}
								{" "}
								(invalid)
							</Label>
							<Group>
								<Input value="bad-input" />
							</Group>
							<FieldError>Please enter a valid value</FieldError>
						</TextField>
					))}
				</div>
			</DemoSection>

			{/* ── Disabled ── */}
			<DemoSection title="Disabled State" description="Set isDisabled on TextField. Reduces opacity and prevents interaction.">
				<TextField isDisabled>
					<Label>Disabled field</Label>
					<Group>
						<Input placeholder="Cannot edit" />
					</Group>
				</TextField>
			</DemoSection>

			{/* ── Horizontal ── */}
			<DemoSection title="Horizontal Orientation" description="Set orientation to horizontal for inline label + input layout.">
				<TextField orientation="horizontal" size={2}>
					<Label>Zip code</Label>
					<Group>
						<Input placeholder="N2L 3G1" className="max-w-32" />
					</Group>
				</TextField>
			</DemoSection>

			{/* ── Inline with Button ── */}
			<DemoSection title="Inline with Button" description="Size-2 inputs match size-2 buttons in height for seamless inline layouts.">
				<div className="flex items-end gap-3">
					<TextField size={2} color="sage" className="flex-1">
						<Label>Search</Label>
						<Group>
							<InputSlot side="start"><MagnifyingGlassIcon /></InputSlot>
							<Input placeholder="Search..." />
						</Group>
					</TextField>
					<Button size={2} color="sage">Go</Button>
				</div>
			</DemoSection>
		</div>
	);
}

export const Route = createFileRoute("/showcase/text-field")({
	component: TextFieldPage,
});
