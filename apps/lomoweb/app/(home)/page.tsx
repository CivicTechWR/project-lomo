import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-server";
import { ContactSection } from "./components/contact-section";
import { FindSection } from "./components/find-section";
import { HeroSection } from "./components/hero-section";
import { HomeFooter } from "./components/home-footer";
import { HomeNav } from "./components/home-nav";
import { HowItWorksSection } from "./components/how-it-works-section";
import { JoinSection } from "./components/join-section";
import { ShareSection } from "./components/share-section";
import { TrustBlock } from "./components/trust-block";

export default async function HomePage() {
	try {
		if (await isAuthenticated()) {
			redirect("/app");
		}
	}
	catch {
		// Treat as unauthenticated
	}

	return (
		<>
			<HomeNav />
			<main>
				<HeroSection />
				<TrustBlock />
				<HowItWorksSection />
				<FindSection />
				<ShareSection />
				<JoinSection />
				<ContactSection />
			</main>
			<HomeFooter />
		</>
	);
}
