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

function Request() {
	const navigate = useNavigate();

	const handleFormSubmit = (data: any) => {
		const newRequest: RequestData = {
			...data,
			id: Date.now().toString(),
			timestamp: new Date(),
			status: "Active",
		};

		// Save to localStorage
		const existingRequests = JSON.parse(localStorage.getItem("requests") || "[]");
		const updatedRequests = [newRequest, ...existingRequests];
		localStorage.setItem("requests", JSON.stringify(updatedRequests));

		navigate({ to: "/" });
	};

	const handleFormCancel = () => {
		navigate({ to: "/" });
	};

	return (
		<div className="container">
			<Header />

			<MultiStepRequestForm onSubmit={handleFormSubmit} onCancel={handleFormCancel} />

			<BottomNav />
		</div>
	);
}
