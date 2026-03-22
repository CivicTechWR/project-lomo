import { Button } from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<div className="p-8 flex flex-col gap-8">
			<h3 className="text-[length:var(--text-6)] leading-[var(--text-6--line-height)] font-semibold text-gray-12">
				Button Demo
			</h3>

			{/* Solid variants */}
			<section className="flex flex-col gap-3">
				<h4 className="text-[length:var(--text-3)] leading-[var(--text-3--line-height)] font-medium text-gray-11">Solid</h4>
				<div className="flex flex-wrap items-center gap-3">
					<Button color="terracotta">Terracotta</Button>
					<Button color="sage">Sage</Button>
					<Button color="yellow">Yellow</Button>
					<Button color="gray">Gray</Button>
					<Button color="red">Red</Button>
					<Button color="amber">Amber</Button>
				</div>
			</section>

			{/* Soft variants */}
			<section className="flex flex-col gap-3">
				<h4 className="text-[length:var(--text-3)] leading-[var(--text-3--line-height)] font-medium text-gray-11">Soft</h4>
				<div className="flex flex-wrap items-center gap-3">
					<Button variant="soft" color="terracotta">Terracotta</Button>
					<Button variant="soft" color="sage">Sage</Button>
					<Button variant="soft" color="yellow">Yellow</Button>
					<Button variant="soft" color="gray">Gray</Button>
					<Button variant="soft" color="red">Red</Button>
					<Button variant="soft" color="amber">Amber</Button>
				</div>
			</section>

			{/* Outline variants */}
			<section className="flex flex-col gap-3">
				<h4 className="text-[length:var(--text-3)] leading-[var(--text-3--line-height)] font-medium text-gray-11">Outline</h4>
				<div className="flex flex-wrap items-center gap-3">
					<Button variant="outline" color="terracotta">Terracotta</Button>
					<Button variant="outline" color="sage">Sage</Button>
					<Button variant="outline" color="yellow">Yellow</Button>
					<Button variant="outline" color="gray">Gray</Button>
					<Button variant="outline" color="red">Red</Button>
					<Button variant="outline" color="amber">Amber</Button>
				</div>
			</section>

			{/* Ghost variants */}
			<section className="flex flex-col gap-3">
				<h4 className="text-[length:var(--text-3)] leading-[var(--text-3--line-height)] font-medium text-gray-11">Ghost</h4>
				<div className="flex flex-wrap items-center gap-3">
					<Button variant="ghost" color="terracotta">Terracotta</Button>
					<Button variant="ghost" color="sage">Sage</Button>
					<Button variant="ghost" color="yellow">Yellow</Button>
					<Button variant="ghost" color="gray">Gray</Button>
					<Button variant="ghost" color="red">Red</Button>
					<Button variant="ghost" color="amber">Amber</Button>
				</div>
			</section>

			{/* Sizes */}
			<section className="flex flex-col gap-3">
				<h4 className="text-[length:var(--text-3)] leading-[var(--text-3--line-height)] font-medium text-gray-11">Sizes</h4>
				<div className="flex flex-wrap items-center gap-3">
					<Button size={1}>Size 1</Button>
					<Button size={2}>Size 2</Button>
					<Button size={3}>Size 3</Button>
					<Button size={4}>Size 4</Button>
				</div>
			</section>

			{/* States */}
			<section className="flex flex-col gap-3">
				<h4 className="text-[length:var(--text-3)] leading-[var(--text-3--line-height)] font-medium text-gray-11">States</h4>
				<div className="flex flex-wrap items-center gap-3">
					<Button>Default</Button>
					<Button isDisabled>Disabled</Button>
					<Button className="w-48">Full Width Override</Button>
				</div>
			</section>
		</div>
	);
}
