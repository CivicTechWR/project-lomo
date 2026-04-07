import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
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

const instrumentSerif = Instrument_Serif({
	variable: "--font-display",
	subsets: ["latin"],
	weight: "400",
	style: ["normal", "italic"],
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
			className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col">
				<ConvexClientProvider>{children}</ConvexClientProvider>
			</body>
		</html>
	);
}
