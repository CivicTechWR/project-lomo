import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Availability from "../components/Availability";
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
		const savedRequests = localStorage.getItem("requests");
		if (savedRequests) {
			return JSON.parse(savedRequests).map((req: any) => ({
				...req,
				timestamp: new Date(req.timestamp),
			}));
		}
		return [];
	});

	// Check for new request on page focus (when returning from request page)
	useEffect(() => {
		const handleFocus = () => {
			const savedRequests = localStorage.getItem("requests");
			if (savedRequests) {
				const parsedRequests = JSON.parse(savedRequests).map((req: any) => ({
					...req,
					timestamp: new Date(req.timestamp),
				}));
				setRequests(parsedRequests);
			}
		};

		window.addEventListener("focus", handleFocus);
		return () => window.removeEventListener("focus", handleFocus);
	}, []);

	const handleRequestSupport = () => {
		navigate({ to: "/request" });
	};

	return (
		<div className="container">
			<Header />

			<h2>Hey, [Name]!</h2>
			<p>How do you want to connect today?</p>

			<Availability onRequestSupport={handleRequestSupport} />

			<div className="requests-header">
				<h3>My Requests</h3>
				<span>{requests.length}</span>
			</div>

			{requests.map(request => (
				<RequestCard
					key={request.id}
					groceries={request.groceries}
					helpful={request.helpful}
					allergies={request.allergies}
					dietary={request.dietary}
					people={request.people}
					delivery={request.delivery}
					address={request.address}
					instructions={request.instructions}
					status={request.status}
					timestamp={request.timestamp}
				/>
			))}

			<p className="note">
				You can pause or stop this request at any time.
			</p>

			<p className="note small">
				If it helps, a small reset can sometimes make this easier: water · a stretch · a breath · a snack · a text to someone safe.
			</p>

			<button className="primary-btn" onClick={handleRequestSupport}>
				Request Support
			</button>

			<BottomNav />
		</div>
	);
}
