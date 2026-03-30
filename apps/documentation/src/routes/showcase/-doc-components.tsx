import { Heading, Text } from "@repo/ui";

// ── Anatomy ────────────────────────────────────────────────

interface AnatomyPart {
	label: string;
	description: string;
}

export function Anatomy({
	children,
	parts,
}: {
	children: React.ReactNode;
	parts: AnatomyPart[];
}) {
	return (
		<DocSection title="Anatomy">
			<div className="flex flex-col gap-4">
				<div className="flex min-h-28 items-center justify-center rounded-lg border border-gray-6 bg-gray-2 p-8">
					{children}
				</div>
				<div className="flex flex-col gap-2">
					{parts.map(part => (
						<div key={part.label} className="flex items-baseline gap-2">
							<code className="shrink-0 rounded bg-gray-a3 px-1.5 py-0.5 text-[length:var(--text-1)] text-terracotta-11">
								{part.label}
							</code>
							<Text size={2} color="gray">
								{part.description}
							</Text>
						</div>
					))}
				</div>
			</div>
		</DocSection>
	);
}

// ── Feature List ───────────────────────────────────────────

export function FeatureList({ features }: { features: string[] }) {
	return (
		<DocSection title="Features">
			<ul className="flex flex-col gap-1.5 pl-5">
				{features.map(feature => (
					<li key={feature} className="list-disc">
						<Text size={2} color="gray">
							{feature}
						</Text>
					</li>
				))}
			</ul>
		</DocSection>
	);
}

// ── Usage Guidelines ───────────────────────────────────────

interface GuidelineItem {
	type: "do" | "dont";
	text: string;
}

export function UsageGuidelines({
	description,
	guidelines,
}: {
	description?: string;
	guidelines: GuidelineItem[];
}) {
	const dos = guidelines.filter(g => g.type === "do");
	const donts = guidelines.filter(g => g.type === "dont");

	return (
		<DocSection title="Usage Guidelines" description={description}>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{dos.length > 0 && (
					<div className="flex flex-col gap-2 rounded-lg border border-sage-6 bg-sage-2 p-4">
						<Text size={2} weight="medium" color="sage" highContrast>
							Do
						</Text>
						<ul className="flex flex-col gap-1.5 pl-5">
							{dos.map(item => (
								<li key={item.text} className="list-disc">
									<Text size={2} color="gray">
										{item.text}
									</Text>
								</li>
							))}
						</ul>
					</div>
				)}
				{donts.length > 0 && (
					<div className="flex flex-col gap-2 rounded-lg border border-red-6 bg-red-2 p-4">
						<Text size={2} weight="medium" color="red" highContrast>
							Don't
						</Text>
						<ul className="flex flex-col gap-1.5 pl-5">
							{donts.map(item => (
								<li key={item.text} className="list-disc">
									<Text size={2} color="gray">
										{item.text}
									</Text>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</DocSection>
	);
}

// ── Code Example ───────────────────────────────────────────

export function CodeExample({
	title,
	description,
	code,
	children,
}: {
	title: string;
	description?: string;
	code: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-1">
				<Heading level={4} size={2} weight="medium">
					{title}
				</Heading>
				{description && (
					<Text size={2} color="gray">
						{description}
					</Text>
				)}
			</div>
			<div className="flex min-h-20 items-center justify-center rounded-lg border border-gray-6 bg-gray-2 p-6">
				{children}
			</div>
			<pre className="overflow-x-auto rounded-lg border border-gray-6 bg-gray-2 p-4 font-mono text-[length:var(--text-1)] leading-relaxed text-gray-12">
				<code>{code}</code>
			</pre>
		</div>
	);
}

// ── Doc Section ────────────────────────────────────────────

export function DocSection({
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
				<Heading level={2} size={4} weight="medium">
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
