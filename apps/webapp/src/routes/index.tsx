import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import RequestCard from "../components/RequestCard";

export const Route = createFileRoute("/")({
	component: Home,
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

function Home() {
	const navigate = useNavigate();

	const [requests, setRequests] = useState<RequestData[]>(() => {
		const saved = localStorage.getItem("requests");
		if (saved) {
			return JSON.parse(saved).map((r: any) => ({
				...r,
				timestamp: new Date(r.timestamp),
			}));
		}
		return [];
	});

	useEffect(() => {
		const handleFocus = () => {
			const saved = localStorage.getItem("requests");
			if (saved) {
				setRequests(
					JSON.parse(saved).map((r: any) => ({
						...r,
						timestamp: new Date(r.timestamp),
					})),
				);
			}
		};

		window.addEventListener("focus", handleFocus);
		return () => window.removeEventListener("focus", handleFocus);
	}, []);

	const [mode, setMode] = useState("can-help");

	return (
		<div className="home-container">
			<Header />

			<div className="home-content">
				{/* Greeting */}
				<div className="home-header">
					<h2>Hey, Name</h2>
					<p>Thanks for being here</p>
				</div>

				{/* Mode selector */}
				<div className="mode-selector">
					<button
						className={`mode ${mode === "need-help" ? "active" : ""}`}
						onClick={() => {
							setMode("need-help");
							navigate({ to: "/request" });
						}}
					>
						Need Help
					</button>

					<button
						className={`mode ${mode === "can-help" ? "active" : ""}`}
						onClick={() => setMode("can-help")}
					>
						Can Help
					</button>

					<button
						className={`mode ${mode === "resting" ? "active" : ""}`}
						onClick={() => setMode("resting")}
					>
						Resting
					</button>
				</div>

				{/* Availability */}
				<div className="card availability-card">
					<div>
						<h4>Available to help</h4>
						<p>You can be assigned requests</p>
					</div>
					<div className="toggle" />
				</div>

				{/* Stats */}
				<div className="card stats-card">
					<h1>1</h1>
					<p>person helped so far</p>
				</div>

				{/* Action */}
				<div className="card action-card">
					<h3>Make a request</h3>
					<p>Need groceries, a ride, or tools? The community is here.</p>
					<button onClick={() => navigate({ to: "/request" })}>
						Create Now
					</button>
				</div>

				{/* Requests */}
				<div className="requests-section">
					<h3>My Active Requests</h3>

					{requests.length === 0 && <p>No requests yet</p>}

					{requests.map(req => (
						<RequestCard key={req.id} {...req} />
					))}
				</div>
			</div>

			<BottomNav />
		</div>
	);
}
