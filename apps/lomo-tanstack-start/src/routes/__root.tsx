import { LomoLogo } from "@repo/ui/icons";
import { Text } from "@repo/ui/text";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "LoMo — Community Help" },
			{ name: "description", content: "A calm, consent-based community help platform" },
		],
		links: [
			{ rel: "stylesheet", href: appCss },
		],
	}),
	component: RootComponent,
});

function RootComponent() {
	return (
		<html lang="en" className="h-full antialiased">
			<head>
				<HeadContent />
			</head>
			<body className="flex min-h-full flex-col bg-gray-1 text-gray-12">
				<Header />
				<main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
					<Outlet />
				</main>
				<Footer />
				<Scripts />
			</body>
		</html>
	);
}

function Header() {
	return (
		<header className="sticky top-0 z-10 border-b border-gray-a3 bg-gray-1/80 backdrop-blur-sm">
			<div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
				<a href="/" className="flex items-center gap-2 text-gray-12 no-underline">
					<LomoLogo className="size-8" />
					<span className="text-base font-semibold tracking-tight">LoMo</span>
				</a>
			</div>
		</header>
	);
}

function Footer() {
	return (
		<footer className="border-t border-gray-a3 bg-gray-2">
			<div className="mx-auto flex h-12 max-w-5xl items-center px-4">
				<Text size={1} color="gray">
					&copy;
					{" "}
					{new Date().getFullYear()}
					{" "}
					CivicTechWR
				</Text>
			</div>
		</footer>
	);
}
