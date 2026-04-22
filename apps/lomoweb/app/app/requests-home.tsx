"use client";

import { api } from "@repo/convex-backend/convex/_generated/api";
import type { Doc } from "@repo/convex-backend/convex/_generated/dataModel";
import type { Preloaded } from "convex/react";
import { useQuery } from "convex/react";
import { usePreloadedAuthQuery } from "@convex-dev/better-auth/nextjs/client";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	readStoredHomeMode,
	writeStoredHomeMode,
	type HomeAppMode,
} from "@/lib/app-home-mode";
import {
	HELP_REQUEST_FILTER_CHIPS,
	HELP_REQUEST_STATUS_LABEL,
	type HelpRequestStatus,
	type HelpRequestStatusFilter,
	statusBadgeColor,
} from "@/lib/help-request-status";

export function RequestsHome({
	preloadedUser,
}: {
	preloadedUser: Preloaded<typeof api.auth.getCurrentUser>;
}) {
	const router = useRouter();
	const user = usePreloadedAuthQuery(preloadedUser);
	const [mode, setMode] = useState<HomeAppMode>("request_help");
	const [statusFilter, setStatusFilter] = useState<HelpRequestStatusFilter>(null);

	useEffect(() => {
		const stored = readStoredHomeMode();
		if (stored) {
			setMode(stored);
		}
	}, []);

	useEffect(() => {
		writeStoredHomeMode(mode);
	}, [mode]);

	const listArgs
		= statusFilter === null ? {} : { statusFilter };

	const myRequests = useQuery(api.helpRequests.listMine, listArgs);
	const isAdmin = useQuery(api.helpRequests.isAdmin, {});
	const openForOthers = useQuery(
		api.helpRequests.listPendingFromOthers,
		mode === "offer_help" ? {} : "skip",
	);

	if (!user) {
		return null;
	}

	return (
		<div className="flex w-full max-w-lg flex-col gap-6 lg:max-w-none">
			{isAdmin && (
				<Button
					variant="soft"
					color="terracotta"
					size={2}
					className="self-start"
					onPress={() => router.push("/app/admin")}
				>
					Admin dashboard
				</Button>
			)}
			<div
				className="flex rounded-[max(var(--radius-3),12px)] border border-gray-6 bg-gray-2 p-1"
				role="tablist"
				aria-label="How you are using LoMo"
			>
				<button
					type="button"
					role="tab"
					aria-selected={mode === "request_help"}
					className={
						mode === "request_help"
							? "min-h-10 flex-1 rounded-[var(--radius-2)] bg-gray-1 px-3 text-[length:var(--text-2)] font-medium text-gray-12 shadow-sm"
							: "min-h-10 flex-1 rounded-[var(--radius-2)] px-3 text-[length:var(--text-2)] font-medium text-gray-11 transition-colors hover:text-gray-12"
					}
					onClick={() => setMode("request_help")}
				>
					Requesting help
				</button>
				<button
					type="button"
					role="tab"
					aria-selected={mode === "offer_help"}
					className={
						mode === "offer_help"
							? "min-h-10 flex-1 rounded-[var(--radius-2)] bg-gray-1 px-3 text-[length:var(--text-2)] font-medium text-gray-12 shadow-sm"
							: "min-h-10 flex-1 rounded-[var(--radius-2)] px-3 text-[length:var(--text-2)] font-medium text-gray-11 transition-colors hover:text-gray-12"
					}
					onClick={() => setMode("offer_help")}
				>
					Offering help
				</button>
			</div>

			{mode === "request_help" ? (
				<RequestingHelpPanel
					router={router}
					statusFilter={statusFilter}
					setStatusFilter={setStatusFilter}
					requests={myRequests}
				/>
			) : (
				<OfferingHelpPanel
					router={router}
					openForOthers={openForOthers}
				/>
			)}
		</div>
	);
}

function RequestingHelpPanel(props: {
	router: ReturnType<typeof useRouter>;
	statusFilter: HelpRequestStatusFilter;
	setStatusFilter: (v: HelpRequestStatusFilter) => void;
	requests: Doc<"helpRequests">[] | undefined;
}) {
	const { router, statusFilter, setStatusFilter, requests } = props;

	return (
		<>
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<Heading level={1} size={7}>
						Your requests
					</Heading>
					<Text size={2} color="gray" className="mt-1">
						Track what you&apos;ve asked for and how it&apos;s going.
					</Text>
				</div>
				<div className="flex shrink-0 flex-wrap items-center gap-2">
					<Button
						variant="solid"
						color="sage"
						size={2}
						onPress={() => router.push("/app/request?fresh=1")}
					>
						New request
					</Button>
					<Button
						variant="ghost"
						color="gray"
						size={2}
						onPress={() => router.push("/app/profile")}
					>
						Profile
					</Button>
				</div>
			</div>

			<div className="flex flex-wrap gap-2">
				{HELP_REQUEST_FILTER_CHIPS.map(chip => {
					const active = statusFilter === chip.value;
					return (
						<Button
							key={chip.label}
							size={1}
							variant={active ? "soft" : "outline"}
							color={active ? "gray" : "gray"}
							className="rounded-full"
							onPress={() => setStatusFilter(chip.value)}
						>
							{chip.label}
						</Button>
					);
				})}
			</div>

			{requests === undefined && (
				<Text size={2} color="gray">
					Loading…
				</Text>
			)}

			{requests !== undefined && requests.length === 0 && (
				<Card size={2} variant="surface" className="p-6">
					<Text size={3} color="gray" className="text-center">
						No requests match this filter yet. When you post a new request,
						it&apos;ll show up here.
					</Text>
					<div className="mt-4 flex justify-center">
						<Button
							variant="solid"
							color="sage"
							size={2}
							onPress={() => router.push("/app/request?fresh=1")}
						>
							Start a request
						</Button>
					</div>
				</Card>
			)}

			{requests !== undefined && requests.length > 0 && (
				<ul className="flex flex-col gap-3">
					{requests.map(r => (
						<li key={r._id}>
							<Link
								href={`/app/requests/${r._id}`}
								className="block rounded-[max(var(--radius-3),12px)] outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-gray-8 focus-visible:ring-offset-2"
							>
								<Card
									size={2}
									variant="surface"
									className="p-4 transition-colors hover:bg-gray-2"
								>
									<div className="flex items-start justify-between gap-3">
										<div className="min-w-0 flex-1">
											<Text
												size={3}
												weight="medium"
												className="line-clamp-2"
											>
												{r.title}
											</Text>
											<Text
												size={2}
												color="gray"
												className="mt-1 line-clamp-2"
											>
												{r.summary}
											</Text>
										</div>
										<Badge
											variant="soft"
											size={1}
											color={statusBadgeColor(r.status as HelpRequestStatus)}
										>
											{HELP_REQUEST_STATUS_LABEL[r.status as HelpRequestStatus]}
										</Badge>
									</div>
								</Card>
							</Link>
						</li>
					))}
				</ul>
			)}
		</>
	);
}

function OfferingHelpPanel(props: {
	router: ReturnType<typeof useRouter>;
	openForOthers: Doc<"helpRequests">[] | undefined;
}) {
	const { router, openForOthers } = props;

	return (
		<>
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<Heading level={1} size={7}>
						Open requests
					</Heading>
					<Text size={2} color="gray" className="mt-1">
						People in the community are looking for support. Open a request
						to read more — if it feels like a fit, you can offer to help.
					</Text>
				</div>
				<Button
					variant="ghost"
					color="gray"
					size={2}
					className="self-start"
					onPress={() => router.push("/app/profile")}
				>
					Profile
				</Button>
			</div>

			{openForOthers === undefined && (
				<Text size={2} color="gray">
					Loading…
				</Text>
			)}

			{openForOthers !== undefined && openForOthers.length === 0 && (
				<Card size={2} variant="surface" className="p-6">
					<Text size={3} color="gray" className="text-center">
						There are no open requests from others right now. Check back
						again soon.
					</Text>
				</Card>
			)}

			{openForOthers !== undefined && openForOthers.length > 0 && (
				<ul className="flex flex-col gap-3">
					{openForOthers.map(r => (
						<li key={r._id}>
							<Link
								href={`/app/offer/${r._id}`}
								className="block rounded-[max(var(--radius-3),12px)] outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-gray-8 focus-visible:ring-offset-2"
							>
								<Card
									size={2}
									variant="surface"
									className="p-4 transition-colors hover:bg-gray-2"
								>
									<div className="flex items-start justify-between gap-3">
										<div className="min-w-0 flex-1">
											<Text
												size={3}
												weight="medium"
												className="line-clamp-2"
											>
												{r.title}
											</Text>
											<Text
												size={2}
												color="gray"
												className="mt-1 line-clamp-2"
											>
												{r.summary}
											</Text>
										</div>
										<Badge variant="soft" size={1} color="amber">
											{HELP_REQUEST_STATUS_LABEL.pending}
										</Badge>
									</div>
								</Card>
							</Link>
						</li>
					))}
				</ul>
			)}
		</>
	);
}
