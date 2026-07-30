export default function HomepageLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="w-full" data-radius="full">
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:bg-terracotta-9 focus:text-white focus:px-4 focus:py-2 focus:rounded-full focus:font-display focus:font-bold focus:text-sm focus:shadow-lg"
			>
				Skip to main content
			</a>
			{children}
		</div>
	);
}
