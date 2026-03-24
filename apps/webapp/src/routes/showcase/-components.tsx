import { Heading, Text } from "@repo/ui";

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
