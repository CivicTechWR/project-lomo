/*
 * TODO: Replace plain HTML playground controls with design system components
 *
 * WHAT:
 * The Playground component currently uses plain HTML <button> and <input>
 * elements styled with Tailwind for its interactive controls (segmented
 * button groups and checkboxes). These should eventually be replaced with
 * proper @repo/ui design system components.
 *
 * WHY:
 * - Visual consistency — the playground controls should match the design
 *   language of the components being documented.
 * - Dogfooding — using our own components in the showcase validates that
 *   they work well in real layouts and surfaces usability issues early.
 * - Maintenance — one set of styles to update instead of duplicate inline
 *   Tailwind for the playground controls.
 *
 * COMPONENTS NEEDED:
 * 1. SegmentedControl — a group of mutually exclusive options rendered as
 *    a pill-style button row. Used for enum and numeric scale props
 *    (variant, size, color, weight, trim, level). Needs: value, onChange,
 *    options array, compact sizing.
 * 2. Toggle / Switch — a boolean on/off control for props like highContrast
 *    and isDisabled. Needs: checked, onChange, label.
 *
 * HOW:
 * 1. Build SegmentedControl and Toggle in packages/ui/src/ following the
 *    existing component structure (index.ts, name.variants.ts, name.component.tsx).
 * 2. Export from packages/ui/src/index.ts.
 * 3. Replace the plain HTML elements in the Playground component below.
 * 4. Add showcase pages for the new components following the guide in
 *    packages/ui/AGENTS.md.
 */

import { Heading, Text } from "@repo/ui";
import { useState } from "react";

interface PropDef {
	name: string;
	type: string;
	default: string;
}

export function PageHeader({ title, description }: { title: string; description: string }) {
	return (
		<div className="flex flex-col gap-2">
			<Heading level={1} size={6}>
				{title}
			</Heading>
			<Text size={3} color="gray">
				{description}
			</Text>
		</div>
	);
}

export function PropTable({ data }: { data: PropDef[] }) {
	return (
		<div className="overflow-x-auto rounded-lg border border-gray-6">
			<table className="w-full text-left">
				<thead>
					<tr className="border-b border-gray-6 bg-gray-2">
						<th className="px-4 py-2.5 text-[length:var(--text-2)] font-medium text-gray-12">Prop</th>
						<th className="px-4 py-2.5 text-[length:var(--text-2)] font-medium text-gray-12">Type</th>
						<th className="px-4 py-2.5 text-[length:var(--text-2)] font-medium text-gray-12">Default</th>
					</tr>
				</thead>
				<tbody>
					{data.map(prop => (
						<tr key={prop.name} className="border-b border-gray-6 last:border-0">
							<td className="px-4 py-2.5 text-[length:var(--text-2)]">
								<code className="rounded bg-gray-a3 px-1.5 py-0.5 text-[length:var(--text-1)] text-terracotta-11">{prop.name}</code>
							</td>
							<td className="px-4 py-2.5 text-[length:var(--text-1)] font-mono text-gray-11">{prop.type}</td>
							<td className="px-4 py-2.5 text-[length:var(--text-1)] font-mono text-gray-11">{prop.default}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export function DemoSection({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: React.ReactNode;
}) {
	return (
		<section className="flex flex-col gap-3">
			<div className="flex flex-col gap-1">
				<Heading level={3} size={3} weight="medium">
					{title}
				</Heading>
				{description && (
					<Text size={2} color="gray">
						{description}
					</Text>
				)}
			</div>
			<div className="rounded-lg border border-gray-6 bg-gray-2 p-6">
				{children}
			</div>
		</section>
	);
}

// ── Playground ──────────────────────────────────────────────

interface SegmentControl {
	name: string;
	type: "segment";
	options: readonly (string | number)[];
}

interface ToggleControl {
	name: string;
	type: "toggle";
}

type PlaygroundControl = SegmentControl | ToggleControl;

interface PlaygroundProps {
	componentName: string | ((values: Record<string, string | number | boolean>) => string);
	childrenLabel: string | ((values: Record<string, string | number | boolean>) => string);
	controls: PlaygroundControl[];
	defaults: Record<string, string | number | boolean>;
	children: (props: Record<string, string | number | boolean>) => React.ReactNode;
	snippetExclude?: string[];
	footer?: React.ReactNode | ((values: Record<string, string | number | boolean>) => React.ReactNode);
	snippetPrefix?: string | ((values: Record<string, string | number | boolean>) => string);
	snippetExtraProps?: string[] | ((values: Record<string, string | number | boolean>) => string[]);
}

function formatCodeSnippet(
	componentName: string,
	values: Record<string, string | number | boolean>,
	defaults: Record<string, string | number | boolean>,
	childrenLabel: string,
	exclude: string[] = [],
	extraProps: string[] = [],
): string {
	const propEntries = [
		...Object.entries(values)
			.filter(([key, value]) => !exclude.includes(key) && value !== defaults[key])
			.map(([key, value]) => {
				if (typeof value === "boolean")
					return value ? key : `${key}={false}`;
				if (typeof value === "number")
					return `${key}={${value}}`;
				return `${key}="${value}"`;
			}),
		...extraProps,
	];

	if (propEntries.length === 0) {
		return `<${componentName}>\n  ${childrenLabel}\n</${componentName}>`;
	}

	const inlineOpen = `<${componentName} ${propEntries.join(" ")}>`;

	if (inlineOpen.length <= 60) {
		return `${inlineOpen}\n  ${childrenLabel}\n</${componentName}>`;
	}

	const multilineProps = propEntries.map(p => `  ${p}`).join("\n");
	return `<${componentName}\n${multilineProps}\n>\n  ${childrenLabel}\n</${componentName}>`;
}

export function Playground({
	componentName,
	childrenLabel,
	controls,
	defaults,
	children,
	snippetExclude,
	footer,
	snippetPrefix,
	snippetExtraProps,
}: PlaygroundProps) {
	const [values, setValues] = useState<Record<string, string | number | boolean>>({ ...defaults });

	function setValue(name: string, value: string | number | boolean) {
		setValues(prev => ({ ...prev, [name]: value }));
	}

	const resolvedName = typeof componentName === "function" ? componentName(values) : componentName;
	const resolvedLabel = typeof childrenLabel === "function" ? childrenLabel(values) : childrenLabel;
	const resolvedExtraProps = typeof snippetExtraProps === "function" ? snippetExtraProps(values) : snippetExtraProps ?? [];
	const resolvedPrefix = typeof snippetPrefix === "function" ? snippetPrefix(values) : snippetPrefix;
	const resolvedFooter = typeof footer === "function" ? footer(values) : footer;
	const rawSnippet = formatCodeSnippet(resolvedName, values, defaults, resolvedLabel, snippetExclude, resolvedExtraProps);
	const snippet = resolvedPrefix ? `${resolvedPrefix}\n\n${rawSnippet}` : rawSnippet;

	return (
		<section className="flex flex-col gap-4">
			<Text size={1} weight="medium" color="gray" className="uppercase tracking-wider">
				Playground
			</Text>

			<div className="flex min-h-28 items-center justify-center rounded-lg border border-gray-6 bg-gray-2 p-8">
				{children(values)}
			</div>

			{resolvedFooter}

			<div className="flex flex-wrap gap-x-6 gap-y-4">
				{controls.map(control =>
					control.type === "segment"
						? (
								<div key={control.name} className="flex flex-col gap-1.5">
									<span className="text-[length:var(--text-1)] font-medium text-gray-11">
										{control.name}
									</span>
									<div className="inline-flex flex-wrap gap-0.5 rounded-md bg-gray-3 p-0.5">
										{control.options.map(option => (
											<button
												key={String(option)}
												type="button"
												onClick={() => setValue(control.name, option)}
												className={`rounded-[5px] px-2.5 py-1 text-[length:var(--text-1)] transition-colors ${
													values[control.name] === option
														? "bg-white font-medium text-gray-12 shadow-sm"
														: "text-gray-11 hover:text-gray-12"
												}`}
											>
												{String(option)}
											</button>
										))}
									</div>
								</div>
							)
						: (
								<div key={control.name} className="flex flex-col gap-1.5">
									<span className="text-[length:var(--text-1)] font-medium text-gray-11">
										{control.name}
									</span>
									<label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-gray-3 px-3 py-1.5">
										<input
											type="checkbox"
											checked={values[control.name] as boolean}
											onChange={e => setValue(control.name, e.target.checked)}
											className="h-3.5 w-3.5 rounded accent-terracotta-9"
										/>
										<span className="text-[length:var(--text-1)] text-gray-11">
											{values[control.name] ? "On" : "Off"}
										</span>
									</label>
								</div>
							),
				)}
			</div>

			<pre className="overflow-x-auto rounded-lg border border-gray-6 bg-gray-2 p-4 font-mono text-[length:var(--text-1)] leading-relaxed text-gray-12">
				<code>{snippet}</code>
			</pre>
		</section>
	);
}
