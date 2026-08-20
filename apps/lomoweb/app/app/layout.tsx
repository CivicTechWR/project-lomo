import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-server";
import { AppChrome } from "./app-chrome";

export default async function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	if (!(await isAuthenticated())) {
		redirect("/signin");
	}

	return (
		<div className="flex min-h-screen w-full bg-gray-1">
			<AppChrome>{children}</AppChrome>
		</div>
	);
}
