"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@repo/ui/button";
import { Badge } from "@repo/ui/badge";
import { Heading } from "@repo/ui/heading";
import { Link } from "@repo/ui/link";
import { Text } from "@repo/ui/text";

import { MoodSelector } from "./_components/mood-selector";
import { RequestCard } from "./_components/request-card";
import type { RequestCardProps } from "./_components/request-card";

const MY_REQUESTS: RequestCardProps[] = [
	{
		icon: "/images/icon-gift.svg",
		title: "Borrow: Cordless Drill",
		description: "Hanging some shelves this weekend. Does anyone have a drill I could borrow for a few hours?",
		status: "pending",
		views: 4,
		timeAgo: "2hrs ago",
	},
	{
		icon: "/images/icon-grocery.svg",
		title: "Grocery Pickup - Market Sq.",
		description: "Looking for someone headed near the downtown market this afternoon to pick up a few items.",
		status: "in-progress",
		helper: { name: "Marcus", hasNewMessage: true },
		timeAgo: "2hrs ago",
	},
];

const RECEIVED_REQUESTS: RequestCardProps[] = [
	{
		icon: "/images/icon-gift.svg",
		title: "Borrow: Cordless Drill",
		description: "Hanging some shelves this weekend. Does anyone have a drill I could borrow for ...",
		status: "in-progress",
		location: "Downtown Kitchener",
		timeAgo: "2hrs ago",
	},
];

type RequestTab = "mine" | "received";

function RequestTabSwitcher({ active, onChange }: { active: RequestTab; onChange: (tab: RequestTab) => void }) {
	return (
		<div className="flex bg-gray-3 rounded-[max(var(--radius-3),var(--radius-full))] p-1">
			<button
				type="button"
				onClick={() => onChange("mine")}
				className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-[max(var(--radius-2),var(--radius-full))] transition-colors ${
					active === "mine"
						? "bg-gray-1 shadow-sm"
						: "hover:bg-gray-4"
				}`}
			>
				<Text size={2} weight={active === "mine" ? "bold" : "medium"} color="gray" highContrast>
					My Requests
				</Text>
				<Badge variant="solid" size={1} color="red">3</Badge>
			</button>
			<button
				type="button"
				onClick={() => onChange("received")}
				className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-[max(var(--radius-2),var(--radius-full))] transition-colors ${
					active === "received"
						? "bg-gray-1 shadow-sm"
						: "hover:bg-gray-4"
				}`}
			>
				<Text size={2} weight={active === "received" ? "bold" : "medium"} color="gray" highContrast>
					Received
				</Text>
				<Badge variant="solid" size={1} color="red">1</Badge>
			</button>
		</div>
	);
}

export default function Home() {
	const [activeTab, setActiveTab] = useState<RequestTab>("mine");
	const requests = activeTab === "mine" ? MY_REQUESTS : RECEIVED_REQUESTS;

	return (
		<>
			<Heading level={2} size={8} weight="medium" color="gray" highContrast>
				Hi Name!
			</Heading>

			<MoodSelector />

			<RequestTabSwitcher active={activeTab} onChange={setActiveTab} />

			<div className="flex items-center justify-between">
				{activeTab === "mine" && (
					<Link href="/new-request">
            <Button color="yellow" size={2} className="rounded-[max(var(--radius-2),var(--radius-full))] gap-1.5">
						<Image src="/images/icon-plus.svg" alt="" width={16} height={16} />
						Make a request
					</Button>
          </Link> 
				)}
				<Link href={activeTab === "mine" ? "/requests" : "/received"} underline="hover" color="terracotta" size={3} className="ml-auto">
					View all
				</Link>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
				{requests.map((request) => (
					<RequestCard key={request.title} {...request} />
				))}
			</div>
		</>
	);
}
