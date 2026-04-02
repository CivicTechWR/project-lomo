"use client";

import { TitleBar } from "./title-bar";
import { TabBar } from "./tab-bar";
import { DesktopSidebar } from "./desktop-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col h-dvh bg-gray-2 overflow-hidden">
			<div className="flex flex-col flex-1 min-h-0 px-3 pt-3 sm:px-5 sm:pt-4 gap-3">
				<TitleBar />

				<div className="flex flex-1 min-h-0 gap-6">
					<DesktopSidebar />

					<main className="flex-1 overflow-y-auto flex flex-col gap-5 pb-3 sm:gap-6 sm:pb-6 max-w-2xl">
						{children}
					</main>
				</div>
			</div>

			<TabBar />
		</div>
	);
}
