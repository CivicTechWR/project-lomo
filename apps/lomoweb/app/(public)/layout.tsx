import { LomoLogo } from "@repo/ui/icons";
import { Text } from "@repo/ui/text";
import Link from "next/link";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div
			className="flex min-h-screen flex-col bg-terracotta-2 py-8 px-6"
			data-radius="full"
		>
			{/* Main content — vertically centered */}
			<div className="m-auto w-full max-w-104 flex-1 flex flex-col justify-center gap-2">
				{/* Logo */}
				<Link
					href="/"
					className="mb-4 flex w-full items-center justify-center gap-3 h-fit"
				>
					<LomoLogo className="size-24 flex" />
				</Link>

				{/* Form slot */}
				{children}
			</div>
			{/* Safety footer */}
			<footer className="px-6 text-center">
				<Text
					size={2}
					color="darkred"
					className="mx-auto max-w-sm leading-relaxed"
				>
					If you are experiencing an emergency, please reach out to local
					emergency services or a crisis professional immediately. LoMo is here
					to help with community needs once you are safe.
				</Text>
			</footer>
		</div>
	);
}
