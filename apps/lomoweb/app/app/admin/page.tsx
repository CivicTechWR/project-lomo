import { AdminDashboard } from "./admin-dashboard";

export default function AdminPage() {
	return (
		<div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 lg:py-10">
			<AdminDashboard />
		</div>
	);
}
