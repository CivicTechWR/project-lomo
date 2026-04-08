import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-server";

export default async function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	if (!(await isAuthenticated())) {
		redirect("/signin");
	}

	return children;
}
