import { createFileRoute } from "@tanstack/react-router";

import Availability from "../components/Availability";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import RequestCard from "../components/RequestCard";

export const Route = createFileRoute("/home")({
	component: Home,
});

function Home() {
	return (
		<div className="container">
			<Header />

			<h2>Hey, [Name]!</h2>
			<p>How do you want to connect today?</p>

			<Availability />

			<div className="requests-header">
				<h3>My Requests</h3>
				<span>2</span>
			</div>

			<RequestCard />
			<RequestCard />

			<p className="note">
				You can pause or stop this request at any time.
			</p>

			<p className="note small">
				If it helps, a small reset can sometimes make this easier: water · a stretch · a breath · a snack · a text to someone safe.
			</p>

			<button className="primary-btn">Request Support</button>

			<BottomNav />
		</div>
	);
}
