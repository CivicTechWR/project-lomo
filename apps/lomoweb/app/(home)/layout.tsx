export default function HomepageLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="w-full" data-radius="full">
			{children}
		</div>
	);
}
