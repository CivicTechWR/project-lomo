import type { Metadata } from "next";
import {
	Andada_Pro,
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

const andadaPro = Andada_Pro({
	variable: "--font-display",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"],
	style: ["normal", "italic"],
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
			className={`${geistSans.variable} ${geistMono.variable} ${andadaPro.variable} ${museoModerno.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col">
				<ConvexClientProvider>{children}</ConvexClientProvider>
			</body>
		</html>
	);
}
