"use client";

import Image from "next/image";
import { Card } from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import { Text } from "@repo/ui/text";
import { Link } from "@repo/ui/link";

export type RequestStatus = "pending" | "in-progress" | "helping";

export interface RequestCardProps {
	icon: string;
	title: string;
	description: string;
	status: RequestStatus;
	helper?: { name: string; hasNewMessage: boolean };
	location?: string;
	views?: number;
	timeAgo: string;
}

const statusConfig: Record<RequestStatus, { label: string; badgeColor: "gray" | "sage" | "amber" }> = {
	pending: { label: "Pending", badgeColor: "gray" },
	"in-progress": { label: "In Progress", badgeColor: "sage" },
	helping: { label: "Helping", badgeColor: "amber" },
};

export function RequestCard({ icon, title, description, status, helper, location, views, timeAgo }: RequestCardProps) {
	const { label, badgeColor } = statusConfig[status];

	return (
		<Card variant="classic" size={3} color="gray" className="flex flex-col gap-3">
			<div className="flex items-start justify-between gap-3">
				<div className="flex items-center gap-2 min-w-0 flex-1">
					<Image src={icon} alt="" width={18} height={18} className="shrink-0" />
					<Text size={3} weight="bold" highContrast className="truncate">{title}</Text>
				</div>
				<Badge variant="soft" size={1} color={badgeColor}>{label}</Badge>
			</div>

			<Text size={2} color="gray" highContrast className="line-clamp-2">{description}</Text>

			{helper && (
				<div className="flex items-center justify-between gap-3 bg-gray-2 rounded-[var(--radius-4)] p-3">
					<div className="flex items-center gap-3 min-w-0">
						<div className="size-8 shrink-0 rounded-full bg-yellow-9 flex items-center justify-center">
								<Text size={1} weight="bold" className="text-yellow-12">{helper.name[0]}</Text>
							</div>
						<div className="flex flex-col min-w-0">
							<Text size={2} weight="medium" color="terracotta" highContrast className="truncate">
								{helper.name} is helping
							</Text>
							{helper.hasNewMessage && (
								<Link href="#" color="red" size={2} weight="medium" underline="none">
									New Message
								</Link>
							)}
						</div>
					</div>
					<div className="flex items-center gap-1.5 shrink-0">
						<Image src="/images/icon-clock.svg" alt="" width={13} height={13} />
						<Text size={1} color="gray">{timeAgo}</Text>
					</div>
				</div>
			)}

			{!helper && (
				<div className="flex items-center justify-between pt-2 border-t border-gray-a3">
					{location && (
						<div className="flex items-center gap-2 min-w-0 flex-1">
							<Image src="/images/icon-location.svg" alt="" width={12} height={12} className="shrink-0" />
							<Text size={1} color="gray" className="truncate">{location}</Text>
						</div>
					)}
					{views !== undefined && !location && (
						<div className="flex items-center gap-1.5">
							<Image src="/images/icon-eye.svg" alt="" width={13} height={9} />
							<Text size={1} color="gray">{views} neighbors saw this</Text>
						</div>
					)}
					<div className="flex items-center gap-1.5 ml-auto shrink-0">
						<Image src="/images/icon-clock.svg" alt="" width={13} height={13} />
						<Text size={1} color="gray">{timeAgo}</Text>
					</div>
				</div>
			)}
		</Card>
	);
}
