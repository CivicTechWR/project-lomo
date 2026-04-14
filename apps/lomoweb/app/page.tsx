import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-server";

export default async function RootPage() {
	if (await isAuthenticated()) {
		redirect("/app");
	}
	redirect("/signin");
}
