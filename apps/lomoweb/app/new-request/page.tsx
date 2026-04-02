"use client";

import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";

export default function NewRequest() {
	return (
		<>
			<Heading level={1} size={8} weight="bold" color="gray" highContrast>
				New Request
			</Heading>
			<Text size={3} color="gray">This page is coming soon.</Text>
		</>
	);
}
