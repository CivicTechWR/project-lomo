import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-server";
import { AppTopBar } from "./app-top-bar";

export default async function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	if (!(await isAuthenticated())) {
		redirect("/signin");
	}

	return (
		<>
			<div
				className="pointer-events-none fixed inset-0 -z-10 hidden bg-[url('/lomo-bg.jpg')] bg-cover bg-center bg-no-repeat lg:block"
				aria-hidden
			/>
			<div className="relative min-h-screen lg:px-3 lg:py-8">
				<div
					className={
						"mx-auto flex min-h-screen w-full flex-col bg-gray-1 "
						+ "lomo-desktop-app-frame lg:min-h-min "
						+ "lg:overflow-x-hidden lg:rounded-[max(var(--radius-4),16px)] lg:border-2 lg:border-gray-9 lg:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)]"
					}
				>
					<AppTopBar />
					<div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto">
						{children}
					</div>
				</div>
			</div>
		</>
	);
}
