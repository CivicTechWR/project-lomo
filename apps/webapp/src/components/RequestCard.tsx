interface RequestCardProps {
	groceries: string[];
	helpful: string;
	allergies: string;
	dietary: string;
	people: string;
	delivery: boolean;
	address: string;
	instructions: string;
	status: string;
	timestamp: Date;
}

export default function RequestCard({ groceries, helpful, allergies, dietary, people, delivery, address, instructions, status, timestamp }: RequestCardProps) {
	const formatTimestamp = (date: Date) => {
		return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
	};

	return (
		<div className="card">
			<div className="card-top">
				<div className="avatar" />
				<div className="title">Request</div>
				<div className="status">{status}</div>
			</div>
			<div className="card-body">
				<div>
					<b>Groceries:</b>
					{" "}
					{groceries && groceries.length > 0 ? groceries.join(", ") : "-"}
				</div>
				{helpful && (
					<div>
						<b>Most helpful:</b>
						{" "}
						{helpful}
					</div>
				)}
				{allergies && (
					<div>
						<b>Allergies:</b>
						{" "}
						{allergies}
					</div>
				)}
				{dietary && (
					<div>
						<b>Dietary:</b>
						{" "}
						{dietary}
					</div>
				)}
				{people && (
					<div>
						<b>For:</b>
						{" "}
						{people}
						{" "}
						{Number(people) === 1 ? "person" : "people"}
					</div>
				)}
				<div>
					<b>Delivery:</b>
					{" "}
					{delivery ? "Yes" : "No"}
				</div>
				{address && (
					<div>
						<b>Address:</b>
						{" "}
						{address}
					</div>
				)}
				{instructions && (
					<div>
						<b>Instructions:</b>
						{" "}
						{instructions}
					</div>
				)}
				<p className="timestamp">
					Submitted:
					{" "}
					{formatTimestamp(timestamp)}
				</p>
			</div>
		</div>
	);
}
