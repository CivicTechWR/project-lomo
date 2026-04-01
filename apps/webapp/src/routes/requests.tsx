import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Availability from "../components/Availability";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import MultiStepRequestForm from "../components/MultiStepRequestForm";
import RequestCard from "../components/RequestCard";

function RequestsPage() {
	const [showForm, setShowForm] = useState(false);
	const [requests, setRequests] = useState<any[]>([]);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const handleRequestSupport = () => setShowForm(true);
	const handleFormSubmit = (data: any) => {
		const newRequest = {
			...data,
			id: Date.now().toString(),
			timestamp: new Date(),
			status: "Active",
		};
		setRequests(prev => [newRequest, ...prev]);
		setShowForm(false);
		setSuccessMessage("Request sent, will get back to you shortly");
		setTimeout(setSuccessMessage, 3000, null);
	};
	const handleFormCancel = () => setShowForm(false);

	return (
		<div className="container">
			<Header />
			<h2>My Requests</h2>
			<p>All your submitted requests are listed below.</p>
			<Availability onRequestSupport={handleRequestSupport} />
			{successMessage && (
				<div className="success-message">
					✅
					{successMessage}
				</div>
			)}
			<div className="requests-header">
				<h3>My Requests</h3>
				<span>{requests.length}</span>
			</div>
			{requests.length === 0 && <p>No requests yet. Click below to make one!</p>}
			{requests.map(request => (
				<RequestCard key={request.id} {...request} />
			))}
			<button className="primary-btn" onClick={handleRequestSupport}>
				Request Support
			</button>
			<BottomNav />
			{showForm && (
				<MultiStepRequestForm onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
			)}
		</div>
	);
}

export const Route = createFileRoute("/requests")({
	component: RequestsPage,
});
