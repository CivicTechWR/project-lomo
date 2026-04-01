import { useState } from "react";

interface MultiStepRequestFormProps {
	onSubmit: (data: any) => void;
	onCancel: () => void;
}

const initialFormState = {
	groceries: [],
	helpful: "",
	allergies: "",
	dietary: "",
	people: "",
	delivery: false,
	address: "",
	instructions: "",
};

const groceryOptions = ["Fresh", "Frozen", "Shelf-stable", "Snacks", "No Preference"];

export default function MultiStepRequestForm({ onSubmit, onCancel }: MultiStepRequestFormProps) {
	const [step, setStep] = useState(0);
	const [form, setForm] = useState(initialFormState);

	const handleChange = (field: string, value: any) => {
		setForm(prev => ({ ...prev, [field]: value }));
	};

	const handleGroceryToggle = (option: string) => {
		setForm((prev) => {
			const groceries = prev.groceries.includes(option)
				? prev.groceries.filter((g: string) => g !== option)
				: [...prev.groceries, option];
			return { ...prev, groceries };
		});
	};

	const handleNext = () => setStep(s => s + 1);
	const handleBack = () => setStep(s => s - 1);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(form);
	};

	return (
		<form onSubmit={handleSubmit}>
			{step === 0 && (
				<>
					<h3>Tell us a bit more</h3>
					<div className="form-group">
						<label>What types of groceries?</label>
						<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
							{groceryOptions.map(option => (
								<button
									type="button"
									key={option}
									className={
										form.groceries.includes(option) ? "box selected" : "box"
									}
									onClick={() => handleGroceryToggle(option)}
								>
									{option}
								</button>
							))}
						</div>
					</div>
					<div className="form-group">
						<label>What would be most helpful right now? (optional)</label>
						<input
							type="text"
							value={form.helpful}
							onChange={e => handleChange("helpful", e.target.value)}
							placeholder="Describe what you need most"
						/>
					</div>
				</>
			)}

			{step === 1 && (
				<>
					<div className="form-group">
						<label>Allergies (optional)</label>
						<input
							type="text"
							value={form.allergies}
							onChange={e => handleChange("allergies", e.target.value)}
							placeholder="e.g., peanuts, dairy"
						/>
					</div>
					<div className="form-group">
						<label>Dietary preferences or needs (optional)</label>
						<input
							type="text"
							value={form.dietary}
							onChange={e => handleChange("dietary", e.target.value)}
							placeholder="e.g., vegetarian, halal, diabetic"
						/>
					</div>
					<div className="form-group">
						<label>For how many people?</label>
						<input
							type="number"
							min={1}
							value={form.people}
							onChange={e => handleChange("people", e.target.value)}
							placeholder="Number of people"
						/>
					</div>
				</>
			)}

			{step === 2 && (
				<>
					<div className="form-group">
						<label>
							<input
								type="checkbox"
								checked={form.delivery}
								onChange={e => handleChange("delivery", e.target.checked)}
							/>
                  &nbsp;I need delivery (Picking up isn't an option)
						</label>
					</div>
					<div className="form-group">
						<label>Address</label>
						<input
							type="text"
							value={form.address}
							onChange={e => handleChange("address", e.target.value)}
							placeholder="Enter your address"
						/>
					</div>
					<div className="form-group">
						<label>Instructions</label>
						<input
							type="text"
							value={form.instructions}
							onChange={e => handleChange("instructions", e.target.value)}
							placeholder="e.g., side door, buzzer"
						/>
					</div>
				</>
			)}

			<div className="form-actions">
				{step > 0 && (
					<button type="button" className="cancel-btn" onClick={handleBack}>
						Back
					</button>
				)}
				{step < 2 && (
					<button type="button" className="submit-btn" onClick={handleNext}>
						Next
					</button>
				)}
				{step === 2 && (
					<button type="submit" className="submit-btn">
						Submit Request
					</button>
				)}
				<button type="button" className="cancel-btn" onClick={onCancel}>
					Cancel
				</button>
			</div>
		</form>
	);
}
