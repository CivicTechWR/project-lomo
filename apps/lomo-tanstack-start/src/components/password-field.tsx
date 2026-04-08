import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { Button } from "@repo/ui/button";
import { FieldError, Group, InputSlot, Label } from "@repo/ui/field";
import { Input, TextField } from "@repo/ui/text-field";
import { useState } from "react";

interface PasswordFieldProps<T extends FieldValues> {
	field: ControllerRenderProps<T, Path<T>>;
	isInvalid: boolean;
	errorMessage?: string;
	label?: string;
	placeholder?: string;
}

export function PasswordField<T extends FieldValues>({
	field,
	isInvalid,
	errorMessage,
	label = "Password",
	placeholder = "Enter your password",
}: PasswordFieldProps<T>) {
	const [visible, setVisible] = useState(false);

	return (
		<TextField
			isInvalid={isInvalid}
			name={field.name}
			value={field.value}
			onChange={field.onChange}
			onBlur={field.onBlur}
		>
			<Label>{label}</Label>
			<Group>
				<Input
					type={visible ? "text" : "password"}
					placeholder={placeholder}
				/>
				<InputSlot side="end">
					<Button
						icon
						aria-label={visible ? "Hide password" : "Show password"}
						variant="ghost"
						color="gray"
						size={1}
						onPress={() => setVisible(v => !v)}
					>
						{visible ? <EyeSlashIcon /> : <EyeIcon />}
					</Button>
				</InputSlot>
			</Group>
			{errorMessage && <FieldError>{errorMessage}</FieldError>}
		</TextField>
	);
}
