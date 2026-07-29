import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";

export function HomeFooter() {
	return (
		<footer className="w-full bg-terracotta-12">
			<div className="max-w-[1512px] mx-auto px-4 md:px-8 py-12 md:py-16 text-center">
				<div className="flex flex-col items-center gap-4">
					<Heading level={3} className="text-terracotta-2">
						LoMo
					</Heading>

					<Heading level={3} className="text-terracotta-2">
						Community help, close to home.
					</Heading>

					<Text size={2} color="gray">
						If you are experiencing an emergency, please reach out to local
						emergency services or a crisis professional immediately. LoMo is
						here to help with community needs once you are safe.
					</Text>
				</div>
			</div>
		</footer>
	);
}
