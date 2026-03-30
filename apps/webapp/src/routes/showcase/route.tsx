/*
 * TODO: Exclude showcase routes from production bundles
 *
 * WHAT:
 * The /showcase route tree (showcase/route.tsx and all child routes) is a
 * development-only documentation page for the design system. It should not
 * be included in production builds.
 *
 * WHY:
 * - These routes add dead weight to the production bundle — they import
 *   every component with every variant purely for documentation purposes.
 * - End users will never visit /showcase; it exists only for developers
 *   and designers reviewing the design system during development.
 * - Removing it from production also prevents accidental exposure of an
 *   internal documentation page.
 *
 * HOW (potential approaches to evaluate):
 * 1. Vite conditional imports — use import.meta.env.MODE to conditionally
 *    exclude the showcase route tree from the router config at build time.
 * 2. TanStack Router virtual file routes — use the virtualRouteConfig to
 *    programmatically exclude showcase/ files when building for production.
 * 3. Vite plugin — write a small plugin that strips the showcase/ route
 *    files from the build input in production mode.
 *
 * Whichever approach is chosen, verify that:
 * - The route tree auto-generation (routeTree.gen.ts) still works in dev
 * - Tree-shaking actually removes the showcase components from the bundle
 * - The /showcase URL returns a 404 (or redirect) in production, not a
 *   blank page or crash
 */

import { Heading, Text } from "@repo/ui";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useState } from "react";

const NAV_GROUPS = [
	{
		label: "Components",
		items: [
			{ name: "Badge", to: "/showcase/badge" },
			{ name: "Button", to: "/showcase/button" },
			{ name: "Card", to: "/showcase/card" },
			{ name: "Checkbox", to: "/showcase/checkbox" },
			{ name: "Checkbox Card", to: "/showcase/checkbox-card" },
			{ name: "Modal", to: "/showcase/modal" },
			{ name: "TextField", to: "/showcase/text-field" },
		],
	},
	{
		label: "Typography",
		items: [
			{ name: "Heading", to: "/showcase/heading" },
			{ name: "Link", to: "/showcase/link" },
			{ name: "Text", to: "/showcase/text" },
		],
	},
] as const;

const RADIUS_PRESETS = ["none", "small", "medium", "large", "full"] as const;

function ThemePanel() {
	const [open, setOpen] = useState(false);
	const [radius, setRadius] = useState<string>("medium");

	function selectRadius(preset: string) {
		setRadius(preset);
		document.documentElement.setAttribute("data-radius", preset);
	}

	return (
		<div className="fixed right-4 bottom-4 z-50">
			{open && (
				<div className="mb-2 rounded-lg border border-gray-6 bg-gray-1 p-3 shadow-lg">
					<Text size={1} weight="medium" color="gray" className="mb-2 block uppercase tracking-wider">
						Radius
					</Text>
					<div className="flex gap-0.5 rounded-md bg-gray-3 p-0.5">
						{RADIUS_PRESETS.map(preset => (
							<button
								key={preset}
								type="button"
								onClick={() => selectRadius(preset)}
								className={`rounded-[5px] px-2.5 py-1 text-[length:var(--text-1)] capitalize transition-colors ${
									radius === preset
										? "bg-white font-medium text-gray-12 shadow-sm"
										: "text-gray-11 hover:text-gray-12"
								}`}
							>
								{preset}
							</button>
						))}
					</div>
				</div>
			)}
			<button
				type="button"
				onClick={() => setOpen(prev => !prev)}
				className="flex size-10 items-center justify-center rounded-full border border-gray-6 bg-gray-2 text-gray-11 shadow-md transition-colors hover:bg-gray-3 hover:text-gray-12"
				aria-label="Toggle theme panel"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
					<path fillRule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
				</svg>
			</button>
		</div>
	);
}

function ShowcaseLayout() {
	return (
		<div className="flex min-h-screen">
			<nav className="sticky top-0 flex max-h-screen w-56 shrink-0 flex-col gap-6 overflow-y-auto border-r border-gray-6 bg-gray-1 px-4 py-6">
				<Link to="/showcase" className="px-2">
					<Heading level={4} size={3}>
						Design System
					</Heading>
				</Link>

				{NAV_GROUPS.map(group => (
					<div key={group.label} className="flex flex-col gap-1.5">
						<Text size={1} weight="medium" color="gray" className="px-2 uppercase tracking-wider">
							{group.label}
						</Text>
						<div className="flex flex-col gap-0.5">
							{group.items.map(item => (
								<Link
									key={item.to}
									to={item.to}
									className="rounded-md px-2 py-1.5 text-[length:var(--text-2)] text-gray-11 transition-colors hover:bg-gray-a3 hover:text-gray-12 [&.active]:bg-gray-a4 [&.active]:font-medium [&.active]:text-gray-12"
								>
									{item.name}
								</Link>
							))}
						</div>
					</div>
				))}
			</nav>

			<main className="flex-1 bg-gray-1 p-8 lg:p-12">
				<div className="mx-auto max-w-3xl">
					<Outlet />
				</div>
			</main>

			<ThemePanel />
		</div>
	);
}

export const Route = createFileRoute("/showcase")({
	component: ShowcaseLayout,
});
