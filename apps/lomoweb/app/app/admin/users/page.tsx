"use client";

import type { UserFilters, UserStatus } from "../lib/filters";
import { api } from "@repo/convex-backend/convex/_generated/api";
import { Badge } from "@repo/ui/badge";
import { Card } from "@repo/ui/card";
import { Heading } from "@repo/ui/heading";
import { Icon } from "@repo/ui/icons";
import { Text } from "@repo/ui/text";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useState } from "react";
import {
	deriveUserStatus,
	filterUsers,
	USER_STATUS_BADGE_COLOR,
} from "../lib/filters";

/* -------------------------------------------------------------------------- */
/*                           Types & Constants                                  */
/* -------------------------------------------------------------------------- */

type TimeRangeOption = "alltime" | "last7days" | "last30days" | "last90days";

const STATUS_OPTIONS: { value: UserStatus | null; label: string }[] = [
	{ value: null, label: "All" },
	{ value: "Volunteer", label: "Volunteer" },
	{ value: "Resting", label: "Resting" },
	{ value: "Member", label: "Member" },
	{ value: "Blocked", label: "Blocked" },
];

const TIME_OPTIONS: { value: TimeRangeOption; label: string }[] = [
	{ value: "alltime", label: "All Time" },
	{ value: "last7days", label: "Last 7 Days" },
	{ value: "last30days", label: "Last 30 Days" },
	{ value: "last90days", label: "Last 90 Days" },
];

/* -------------------------------------------------------------------------- */
/*                              UserListSkeleton                                */
/* -------------------------------------------------------------------------- */

function UserListSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			{/* Search skeleton */}
			<div className="h-11 w-full animate-pulse rounded-full bg-gray-3" />

			{/* Filter pills skeleton */}
			<div className="flex gap-2">
				<div className="h-8 w-24 animate-pulse rounded-full bg-gray-3" />
				<div className="h-8 w-28 animate-pulse rounded-full bg-gray-3" />
			</div>

			{/* Card skeletons */}
			<ul className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label="Loading users">
				{Array.from({ length: 6 }, (_, i) => `skeleton-${i}`).map(key => (
					<li key={key}>
						<Card size={2} className="rounded-4 border border-gray-6">
							<div className="flex items-start gap-3">
								<div className="h-10 w-10 animate-pulse rounded-full bg-gray-3" />
								<div className="flex-1">
									<div className="h-4 w-32 animate-pulse rounded bg-gray-3" />
									<div className="mt-2 h-3 w-48 animate-pulse rounded bg-gray-3" />
									<div className="mt-2 h-3 w-20 animate-pulse rounded bg-gray-3" />
								</div>
							</div>
						</Card>
					</li>
				))}
			</ul>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/*                                SearchBar                                     */
/* -------------------------------------------------------------------------- */

function SearchBar({
	value,
	onChange,
}: {
	value: string;
	onChange: (value: string) => void;
}) {
	return (
		<div className="relative">
			<label htmlFor="user-search" className="sr-only">
				Search users by name or email
			</label>
			<input
				id="user-search"
				type="search"
				aria-label="Search users by name or email"
				placeholder="Search by name or email..."
				value={value}
				onChange={e => onChange(e.target.value)}
				maxLength={100}
				className="h-11 w-full rounded-full border border-gray-6 bg-white px-4 py-2 text-sm text-gray-12 placeholder:text-gray-9 focus:border-gray-8 focus:outline-none focus:ring-2 focus:ring-gray-8 focus:ring-offset-2"
			/>
			{/* Search icon */}
			<Icon
				name="search"
				className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-gray-9"
			/>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/*                               FilterPills                                    */
/* -------------------------------------------------------------------------- */

function FilterPills({
	statusFilter,
	onStatusChange,
	timeFilter,
	onTimeChange,
}: {
	statusFilter: UserStatus | null;
	onStatusChange: (status: UserStatus | null) => void;
	timeFilter: TimeRangeOption;
	onTimeChange: (range: TimeRangeOption) => void;
}) {
	return (
		<div
			className="flex flex-wrap gap-2"
			role="group"
			aria-label="User filters"
		>
			{/* Status pills */}
			<fieldset className="flex flex-wrap gap-1.5">
				<legend className="sr-only">Filter by status</legend>
				{STATUS_OPTIONS.map((opt) => {
					const isActive = opt.value === statusFilter;
					return (
						<button
							key={opt.label}
							type="button"
							aria-pressed={isActive}
							onClick={() => onStatusChange(opt.value)}
							className={`min-h-11 min-w-11 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-8 focus-visible:ring-offset-2 ${
								isActive
									? "border-gray-12 bg-gray-12 text-white"
									: "border-gray-6 bg-white text-gray-12 hover:bg-gray-3"
							}`}
						>
							{opt.label}
						</button>
					);
				})}
			</fieldset>

			{/* Time range pills */}
			<fieldset className="flex flex-wrap gap-1.5">
				<legend className="sr-only">Filter by registration time</legend>
				{TIME_OPTIONS.map((opt) => {
					const isActive = opt.value === timeFilter;
					return (
						<button
							key={opt.value}
							type="button"
							aria-pressed={isActive}
							onClick={() => onTimeChange(opt.value)}
							className={`min-h-11 min-w-11 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-8 focus-visible:ring-offset-2 ${
								isActive
									? "border-gray-12 bg-gray-12 text-white"
									: "border-gray-6 bg-white text-gray-12 hover:bg-gray-3"
							}`}
						>
							{opt.label}
						</button>
					);
				})}
			</fieldset>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/*                                UserCard                                      */
/* -------------------------------------------------------------------------- */

interface UserCardUser {
	_id: string;
	_creationTime: number;
	name?: string | null;
	email?: string | null;
	isVolunteer?: boolean;
	canHelpNow?: boolean;
	blocked?: boolean;
}

function UserCard({ user }: { user: UserCardUser }) {
	const status = deriveUserStatus(user);
	const badgeColor = USER_STATUS_BADGE_COLOR[status];
	const initial = (user.name ?? user.email ?? "?").charAt(0).toUpperCase();
	const registrationDate = new Date(user._creationTime).toLocaleDateString(
		"en-CA",
		{ year: "numeric", month: "short", day: "numeric" },
	);

	return (
		<li>
			<Link
				href={`/app/admin/users/${user._id}`}
				className="block rounded-4 border border-gray-6 bg-white p-4 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-8 focus-visible:ring-offset-2"
			>
				<div className="flex items-start gap-3">
					{/* Avatar */}
					<div
						className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-3 text-sm font-semibold text-gray-12"
						aria-hidden="true"
					>
						{initial}
					</div>

					<div className="min-w-0 flex-1">
						{/* Name + status badge */}
						<div className="flex items-center gap-2">
							<p className="truncate font-medium text-gray-12">
								{user.name ?? "Unnamed User"}
							</p>
							<Badge variant="soft" color={badgeColor} size={1}>
								{status}
							</Badge>
						</div>

						{/* Email */}
						{user.email && (
							<p className="mt-0.5 truncate text-sm text-gray-11">
								{user.email}
							</p>
						)}

						{/* Meta row: registration date */}
						<div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
							<Text size={1} color="gray">
								Joined
								{" "}
								{registrationDate}
							</Text>
						</div>
					</div>
				</div>
			</Link>
		</li>
	);
}

/* -------------------------------------------------------------------------- */
/*                               EmptyState                                    */
/* -------------------------------------------------------------------------- */

function EmptyState() {
	return (
		<Card size={2} className="rounded-4 border border-gray-6">
			<div className="flex flex-col items-center gap-2 py-6 text-center">
				<Text size={3} weight="medium" color="gray">
					No users match your criteria
				</Text>
				<Text size={2} color="gray">
					Try adjusting your search or filters.
				</Text>
			</div>
		</Card>
	);
}

/* -------------------------------------------------------------------------- */
/*                             UserListView (page)                              */
/* -------------------------------------------------------------------------- */

export default function UsersPage() {
	const users = useQuery(api.users.listAllForAdmin);
	const isLoading = users === undefined;

	// Local filter state
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<UserStatus | null>(null);
	const [timeFilter, setTimeFilter] = useState<TimeRangeOption>("alltime");

	// Map time filter to the format expected by filterUsers
	const timeRangeForFilter = timeFilter === "last90days" ? "last30days" : timeFilter;

	// Build filter object — handle "last90days" manually since filterUsers uses "last30days" max
	const filters: UserFilters = {
		search,
		status: statusFilter,
		timeRange: timeFilter === "last90days" ? null : (timeRangeForFilter as UserFilters["timeRange"]),
	};

	// Apply client-side filtering
	let filteredUsers = isLoading ? [] : filterUsers(users, filters);

	// Handle "last90days" manually (filterUsers doesn't support it natively)
	if (!isLoading && timeFilter === "last90days") {
		const now = Date.now();
		const ninetyDaysMs = 90 * 86_400_000;
		filteredUsers = filteredUsers.filter(u => u._creationTime >= now - ninetyDaysMs);
	}

	const userCount = filteredUsers.length;

	return (
		<div className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col px-4 py-8 sm:px-6 lg:py-10">
			<Heading level={1} size={6} weight="bold" className="mb-6">
				All Users
				{!isLoading && (
					<span className="ml-2 text-lg font-normal text-gray-11">
						(
						{userCount}
						)
					</span>
				)}
			</Heading>

			{/* aria-live for loading state */}
			<div aria-live="polite" aria-atomic="true" className="sr-only">
				{isLoading ? "Loading users" : `${userCount} users displayed`}
			</div>

			{isLoading
				? <UserListSkeleton />
				: (
						<div className="flex flex-col gap-4">
							{/* Search */}
							<SearchBar value={search} onChange={setSearch} />

							{/* Filters */}
							<FilterPills
								statusFilter={statusFilter}
								onStatusChange={setStatusFilter}
								timeFilter={timeFilter}
								onTimeChange={setTimeFilter}
							/>

							{/* User list or empty state */}
							{filteredUsers.length === 0
								? <EmptyState />
								: (
										<ul
											className="grid grid-cols-1 gap-4 sm:grid-cols-2"
											role="list"
											aria-label={`Users list, ${userCount} results`}
										>
											{filteredUsers.map(user => (
												<UserCard key={user._id} user={user} />
											))}
										</ul>
									)}
						</div>
					)}
		</div>
	);
}
