import { useState } from "react";

interface RequestFormProps {
	onSubmit: (data: { title: string; description: string; priority: string }) => void;
	onCancel: () => void;
}

export default function RequestForm({ onSubmit, onCancel }: RequestFormProps) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState("medium");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit({ title, description, priority });
	};

	return (
		<div className="request-form-overlay">
			<div className="request-form">
				<h3>Request Support</h3>
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="title">What do you need help with?</label>
						<input
							type="text"
							id="title"
							value={title}
							onChange={e => setTitle(e.target.value)}
							placeholder="e.g., Help with groceries, emotional support, etc."
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="description">More details (optional)</label>
						<textarea
							id="description"
							value={description}
							onChange={e => setDescription(e.target.value)}
							placeholder="Provide any additional context..."
							rows={3}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="priority">Priority</label>
						<select
							id="priority"
							value={priority}
							onChange={e => setPriority(e.target.value)}
						>
							<option value="low">Low - Can wait</option>
							<option value="medium">Medium - Soon would be nice</option>
							<option value="high">High - Need help ASAP</option>
						</select>
					</div>

					<div className="form-actions">
						<button type="button" onClick={onCancel} className="cancel-btn">
							Cancel
						</button>
						<button type="submit" className="submit-btn">
							Submit Request
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
