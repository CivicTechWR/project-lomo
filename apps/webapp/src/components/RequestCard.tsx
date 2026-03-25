export default function RequestCard() {
	return (
		<div className="card">
			<div className="card-top">
				<div className="avatar" />
				<div className="title">Title</div>
				<div className="status">Status</div>
			</div>

			<div className="card-body">
				<p>Comments</p>
				<p>Priority Tags</p>
				<p>Helper: User</p>
			</div>
		</div>
	);
}
