"use client";

import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { NotificationsList } from "../notifications-panel";

export function NotificationsPageView() {
	return (
		<div className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:py-10">
			<div>
				<Heading level={1} size={7}>
					Notifications
				</Heading>
				<Text size={2} color="gray" className="mt-1">
					Updates about your requests and offers to help.
				</Text>
			</div>
			<NotificationsList />
		</div>
	);
}
