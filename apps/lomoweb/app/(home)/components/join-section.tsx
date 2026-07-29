import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";

export function JoinSection() {
	return (
		<section aria-label="Join the Circle" className="w-full bg-yellow-3">
			<div className="max-w-[1512px] mx-auto px-4 md:px-8 py-16 md:py-24 text-center">
				<div className="flex flex-col items-center gap-6">
					<Heading level={2} className="font-display" color="yellow" highContrast>
						Join the Circle
					</Heading>

					<Button href="/signup" variant="solid" color="terracotta" size={4}>
						Sign Up
					</Button>

					<Text size={3}>
						Free to join. No social media login. You own your data.
					</Text>
				</div>
			</div>
		</section>
	);
}
