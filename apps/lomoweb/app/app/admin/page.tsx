import { AdminDashboard } from "./admin-dashboard";

export default function AdminPage() {
	return (
		<div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-8 lg:min-h-0 lg:max-w-none lg:w-full">
			<AdminDashboard />
		</div>
	);
}
