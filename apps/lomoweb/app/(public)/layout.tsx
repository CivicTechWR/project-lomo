import { Heading } from "@repo/ui/heading";
import { LomoLogo } from "@repo/ui/icons";
import { Text } from "@repo/ui/text";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen flex-col bg-terracotta-2" data-radius="full">
			{/* Main content — vertically centered */}
			<div className="mx-auto flex w-full max-w-[26rem] flex-1 flex-col justify-center px-6 py-12 sm:py-16">
				{/* Logo */}
				<div
					className="mb-10 flex items-center gap-3"
					style={{ animation: "auth-fade-in 0.6s ease forwards" }}
				>
					<LomoLogo className="size-11" />
					<Heading level={1} size={7} color="terracotta" highContrast className="font-display italic">
						LoMo
					</Heading>
				</div>

				{/* Form slot */}
				{children}
			</div>

			{/* Safety footer */}
			<footer className="px-6 pb-8 text-center">
				<Text size={1} color="gray" className="mx-auto max-w-sm leading-relaxed">
					If you are in immediate danger, contact local emergency services.
					LoMo is not a replacement for that.
				</Text>
			</footer>
		</div>
	);
}
