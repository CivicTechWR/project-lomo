import type { Metadata } from "next";
import {
	Geist,
	Geist_Mono,
	MuseoModerno,
} from "next/font/google";
import { ConvexClientProvider } from "./ConvexClientProvider";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const museoModerno = MuseoModerno({
	variable: "--font-logo",
	subsets: ["latin"],
	weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
	title: "LoMo — Community Help",
	description: "A calm, consent-based community help platform",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			// LoMo's visual language is pill-based end to end. `data-radius="full"`
			// resolves `--radius-full` to 9999px and `--radius-factor` to 2.5 for the
			// whole document. Setting it once here — rather than per route group — is
			// what keeps `/app` from rendering every `rounded-full` as a 0px square,
			// which is the default the design system inherits from Radix.
			data-radius="full"
			className={`${geistSans.variable} ${geistMono.variable} ${museoModerno.variable} h-full antialiased`}
		>
			<head>
				{/*
				  Andada Pro via CSS link: next/font/google currently requests stale
				  gstatic woff2 URLs that 404, which breaks Turbopack's font loader.
				*/}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Andada+Pro:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body className="min-h-full min-w-80 flex flex-col bg-surface-warm">
				<ConvexClientProvider>{children}</ConvexClientProvider>
			</body>
		</html>
	);
}
