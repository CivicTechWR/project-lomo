"use client";

import type { Id } from "@repo/convex-backend/convex/_generated/dataModel";
import { api } from "@repo/convex-backend/convex/_generated/api";
import { Badge } from "@repo/ui/badge";
import { Card } from "@repo/ui/card";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { useQuery } from "convex/react";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*                             DashboardSkeleton                               */
/* -------------------------------------------------------------------------- */

function DashboardSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			{/* Stats skeleton */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-0 sm:divide-x sm:divide-terracotta-6">
				{["stat-users", "stat-helpers", "stat-links"].map(key => (
					<div key={key} className="flex-1 px-4 py-2">
						<div className="h-4 w-20 animate-pulse rounded bg-terracotta-3" />
						<div className="mt-2 h-7 w-12 animate-pulse rounded bg-terracotta-3" />
					</div>
				))}
			</div>

			{/* Breakdown cards skeleton */}
			<div className="grid gap-4 sm:grid-cols-2">
				{["breakdown-active", "breakdown-closed"].map(key => (
					<Card key={key} border="medium" borderColor="terracotta" size={2} className="rounded-4">
						<div className="h-5 w-32 animate-pulse rounded bg-terracotta-3" />
						<div className="mt-4 h-3 w-full animate-pulse rounded-full bg-terracotta-3" />
						<div className="mt-3 flex gap-4">
							<div className="h-4 w-24 animate-pulse rounded bg-terracotta-3" />
							<div className="h-4 w-24 animate-pulse rounded bg-terracotta-3" />
						</div>
					</Card>
				))}
			</div>

			{/* Attention cards skeleton */}
			<div className="flex flex-col gap-3">
				<div className="h-6 w-48 animate-pulse rounded bg-terracotta-3" />
				{["attention-1", "attention-2", "attention-3"].map(key => (
					<Card key={key} border="medium" borderColor="terracotta" size={2} className="rounded-4">
						<div className="h-4 w-3/4 animate-pulse rounded bg-terracotta-3" />
						<div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-terracotta-3" />
					</Card>
				))}
			</div>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/*                               StatsSection                                  */
/* -------------------------------------------------------------------------- */

interface StatsSectionProps {
	totalUsers: number;
	helpers: number;
	magicLinks: number;
}

function StatsSection({ totalUsers, helpers, magicLinks }: StatsSectionProps) {
	const stats = [
		{ label: "Total Users", value: totalUsers },
		{ label: "Helpers", value: helpers },
		{ label: "Magic Links", value: magicLinks },
	];

	return (
		<Card border="medium" borderColor="terracotta" size={2} className="rounded-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-0 sm:divide-x sm:divide-terracotta-6">
				{stats.map(stat => (
					<div key={stat.label} className="flex-1 px-4 py-1 text-center">
						<Text size={2} weight="medium" color="terracotta">
							{stat.label}
						</Text>
						<p className="mt-1 text-2xl font-semibold text-terracotta-9">
							{stat.value}
						</p>
					</div>
				))}
			</div>
		</Card>
	);
}

/* -------------------------------------------------------------------------- */
/*                         ActiveRequestBreakdown                               */
/* -------------------------------------------------------------------------- */

interface BreakdownProps {
	total: number;
	segments: { label: string; count: number; colorClass: string }[];
}

function RequestBreakdown({ total, segments }: BreakdownProps) {
	return (
		<div className="flex flex-col gap-3">
			{/* Progress bar */}
			<div className="flex h-3 w-full overflow-hidden rounded-full bg-terracotta-3" role="img" aria-label={`Breakdown: ${segments.map(s => `${s.label} ${s.count}`).join(", ")} out of ${total} total`}>
				{segments.map(segment => (
					total > 0
						? (
								<div
									key={segment.label}
									className={`${segment.colorClass} transition-all`}
									style={{ width: `${(segment.count / total) * 100}%` }}
								/>
							)
						: null
				))}
			</div>

			{/* Labels */}
			<div className="flex flex-wrap gap-x-4 gap-y-1">
				{segments.map(segment => (
					<div key={segment.label} className="flex items-center gap-1.5">
						<span className={`inline-block h-2.5 w-2.5 rounded-full ${segment.colorClass}`} aria-hidden="true" />
						<Text size={2} color="terracotta">
							{segment.label}
							:
							{" "}
							{segment.count}
						</Text>
					</div>
				))}
			</div>
		</div>
	);
}

interface ActiveRequestBreakdownProps {
	inProgress: number;
	waiting: number;
	total: number;
}

function ActiveRequestBreakdown({ inProgress, waiting, total }: ActiveRequestBreakdownProps) {
	return (
		<Card border="medium" borderColor="terracotta" size={2} className="rounded-4">
			<div className="mb-3 flex items-baseline justify-between">
				<Heading level={2} size={5} weight="medium">Active Requests</Heading>
				<Text size={3} weight="bold" color="terracotta">{total}</Text>
			</div>
			<RequestBreakdown
				total={total}
				segments={[
					{ label: "In Progress", count: inProgress, colorClass: "bg-sage-9" },
					{ label: "Waiting", count: waiting, colorClass: "bg-yellow-9" },
				]}
			/>
		</Card>
	);
}

/* -------------------------------------------------------------------------- */
/*                         ClosedRequestBreakdown                               */
/* -------------------------------------------------------------------------- */

interface ClosedRequestBreakdownProps {
	completed: number;
	cancelled: number;
	total: number;
}

function ClosedRequestBreakdown({ completed, cancelled, total }: ClosedRequestBreakdownProps) {
	return (
		<Card border="medium" borderColor="terracotta" size={2} className="rounded-4">
			<div className="mb-3 flex items-baseline justify-between">
				<Heading level={2} size={5} weight="medium">Closed Requests</Heading>
				<Text size={3} weight="bold" color="terracotta">{total}</Text>
			</div>
			<RequestBreakdown
				total={total}
				segments={[
					{ label: "Completed", count: completed, colorClass: "bg-sage-9" },
					{ label: "Cancelled", count: cancelled, colorClass: "bg-darkred-5" },
				]}
			/>
		</Card>
	);
}

/* -------------------------------------------------------------------------- */
/*                             AttentionCard                                    */
/* -------------------------------------------------------------------------- */

interface AttentionItem {
	_id: Id<"helpRequests">;
	_creationTime: number;
	title: string;
	summary: string;
	category: string;
	isUrgent: boolean;
}

function AttentionCard({ item }: { item: AttentionItem }) {
	const daysAgo = Math.floor((Date.now() - item._creationTime) / 86_400_000);

	return (
		<li>
			<Link
				href={`/app/admin/requests/${item._id}`}
				className="block rounded-4 border-2 border-terracotta-6 bg-white p-4 transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-terracotta-9 focus-visible:ring-offset-2"
			>
				<div className="flex items-start justify-between gap-2">
					<div className="min-w-0 flex-1">
						<p className="truncate font-medium text-terracotta-9">
							{item.title}
						</p>
						<p className="mt-1 line-clamp-2 text-sm text-terracotta-8">
							{item.summary}
						</p>
					</div>
					{item.isUrgent && (
						<Badge variant="solid" color="darkred" size={1}>
							Urgent
						</Badge>
					)}
				</div>
				<div className="mt-2 flex items-center gap-2">
					<Badge variant="soft" color="terracotta" size={1}>
						{item.category}
					</Badge>
					<Text size={1} color="terracotta">
						{daysAgo}
						{" "}
						day
						{daysAgo === 1 ? "" : "s"}
						{" "}
						ago
					</Text>
				</div>
			</Link>
		</li>
	);
}

/* -------------------------------------------------------------------------- */
/*                          AttentionNeededSection                              */
/* -------------------------------------------------------------------------- */

function AttentionNeededSection({ items }: { items: AttentionItem[] }) {
	return (
		<section aria-labelledby="attention-heading">
			<div className="mb-3 flex items-center gap-2">
				<Heading level={2} size={5} weight="medium" id="attention-heading">
					Attention Needed
				</Heading>
				<Badge variant="solid" color={items.length > 0 ? "red" : "gray"} size={1}>
					{items.length}
				</Badge>
			</div>

			{items.length === 0
				? (
						<Card border="medium" borderColor="terracotta" size={2} className="rounded-4">
							<Text size={2} color="terracotta" className="text-center">
								No requests currently need coordinator action.
							</Text>
						</Card>
					)
				: (
						<ul className="flex flex-col gap-3" role="list">
							{items.map(item => (
								<AttentionCard key={item._id} item={item} />
							))}
						</ul>
					)}
		</section>
	);
}

/* -------------------------------------------------------------------------- */
/*                              DashboardView                                   */
/* -------------------------------------------------------------------------- */

export default function AdminDashboardPage() {
	const stats = useQuery(api.adminDashboard.adminStats);
	const attentionList = useQuery(api.adminDashboard.adminAttentionList);

	const isLoading = stats === undefined || attentionList === undefined;

	return (
		<div className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col px-4 py-8 sm:px-6 lg:py-10">
			<Heading level={1} size={6} weight="bold" className="mb-6">
				Dashboard
			</Heading>

			{/* aria-live region for loading/loaded state */}
			<div aria-live="polite" aria-atomic="true" className="sr-only">
				{isLoading ? "Loading dashboard data" : "Dashboard data loaded"}
			</div>

			{isLoading
				? <DashboardSkeleton />
				: (
						<div className="flex flex-col gap-6">
							{/* Stats Section */}
							<StatsSection
								totalUsers={stats.totalUsers}
								helpers={stats.helpers}
								magicLinks={0}
							/>

							{/* Request Breakdowns */}
							<div className="grid gap-4 sm:grid-cols-2">
								<ActiveRequestBreakdown
									inProgress={stats.active.inProgress}
									waiting={stats.active.waiting}
									total={stats.active.total}
								/>
								<ClosedRequestBreakdown
									completed={stats.closed.completed}
									cancelled={stats.closed.cancelled}
									total={stats.closed.total}
								/>
							</div>

							{/* Attention Needed */}
							<AttentionNeededSection items={attentionList} />
						</div>
					)}
		</div>
	);
}
