import { RequestDetailView } from "./request-detail-view";

export default function RequestDetailPage() {
	return (
		<div className="flex min-h-0 w-full flex-1 flex-col bg-surface-warm">
			<div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 lg:py-10">
				<RequestDetailView />
			</div>
		</div>
	);
}
