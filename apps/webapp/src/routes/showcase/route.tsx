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

const NAV_GROUPS = [
	{
		label: "Components",
		items: [
			{ name: "Badge", to: "/showcase/badge" },
			{ name: "Button", to: "/showcase/button" },
			{ name: "Card", to: "/showcase/card" },
			{ name: "TextField", to: "/showcase/text-field" },
		],
	},
	{
		label: "Typography",
		items: [
			{ name: "Heading", to: "/showcase/heading" },
			{ name: "Text", to: "/showcase/text" },
		],
	},
] as const;

function ShowcaseLayout() {
	return (
		<div className="flex h-screen min-h-0">
			<nav className="flex w-56 shrink-0 flex-col gap-6 overflow-y-auto border-r border-gray-6 bg-gray-1 px-4 py-6">
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

			<main className="flex-1 overflow-y-auto bg-gray-1 p-8 lg:p-12">
				<div className="mx-auto max-w-3xl">
					<Outlet />
				</div>
			</main>
		</div>
	);
}

export const Route = createFileRoute("/showcase")({
	component: ShowcaseLayout,
});
