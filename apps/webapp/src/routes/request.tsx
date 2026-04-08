import { createFileRoute, useNavigate } from "@tanstack/react-router";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import MultiStepRequestForm from "../components/MultiStepRequestForm";

export const Route = createFileRoute("/request")({
	component: Request,
});

interface RequestData {
	id: string;
	groceries: string[];
	helpful: string;
	allergies: string;
	dietary: string;
	people: string;
	delivery: boolean;
	address: string;
	instructions: string;
	timestamp: Date;
	status: string;
}

export default function Request() {
	const navigate = useNavigate();

	const handleFormSubmit = (data: any) => {
		const newRequest: RequestData = {
			...data,
			id: Date.now().toString(),
			timestamp: new Date(),
			status: "Active",
		};

		const existingRequests = JSON.parse(localStorage.getItem("requests") || "[]");
		const updatedRequests = [newRequest, ...existingRequests];
		localStorage.setItem("requests", JSON.stringify(updatedRequests));

		navigate({ to: "/" });
	};

	const handleFormCancel = () => {
		navigate({ to: "/" });
	};

	return (
		<div className="home-container">
			<Header />

			<div className="home-content">
				{/* Page Header */}
				<div className="home-header">
					<h2>Create a Request</h2>
					<p>Fill out the form to request help from your community.</p>
				</div>

				{/* Form Card */}
				<div className="card form-card">
					<div className="form-fields">
						<MultiStepRequestForm
							onSubmit={handleFormSubmit}
							onCancel={handleFormCancel}
						/>
					</div>
				</div>

				{/* Optional Tip Card */}
				<div className="card stats-card">
					<h4>Quick Tip</h4>
					<p>Double-check your details to make it easier for helpers to assist you quickly.</p>
				</div>
			</div>

			<BottomNav />
		</div>
	);
}
