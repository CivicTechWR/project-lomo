"use client";

import { Button } from "@repo/ui/button";
import { Text } from "@repo/ui/text";
import { usePathname, useRouter } from "next/navigation";
import { ALREADY_SIGNED_IN_MESSAGE } from "@/lib/already-signed-in";
import { signOutToSignIn } from "@/lib/sign-out";

export function AlreadySignedInNotice() {
	const router = useRouter();
	const pathname = usePathname();

	return (
		<div
			role="status"
			className="flex flex-col gap-3 rounded-[var(--radius-2)] border border-sage-6 bg-sage-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
		>
			<Text size={2}>{ALREADY_SIGNED_IN_MESSAGE}</Text>
			<div className="flex shrink-0 flex-wrap gap-2 self-start sm:self-center">
				<Button
					variant="outline"
					color="terracotta"
					size={2}
					border="small"
					borderColor="terracotta"
					onPress={() => void signOutToSignIn()}
				>
					Log out
				</Button>
				<Button
					variant="outline"
					color="gray"
					size={2}
					border="small"
					borderColor="gray"
					onPress={() => router.replace(pathname)}
				>
					Dismiss
				</Button>
			</div>
		</div>
	);
}
