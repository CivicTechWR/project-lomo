"use client";

import { Button } from "@repo/ui/button";
import { FieldError, Group, Label } from "@repo/ui/field";
import { Heading } from "@repo/ui/heading";
import { Link } from "@repo/ui/link";
import { Text } from "@repo/ui/text";
import { Input, TextField } from "@repo/ui/text-field";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { AUTH_CONNECTION_ERROR_MESSAGE, authClient } from "@/lib/auth-client";

const resetPasswordSchema = z
	.object({
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type FieldErrors = Partial<Record<"password" | "confirmPassword", string>>;

const SERVER_ERROR_MAP: Record<string, { field?: keyof FieldErrors; message: string }> = {
	INVALID_TOKEN: { message: "This reset link is invalid or has expired. Request a new one." },
	PASSWORD_TOO_SHORT: { field: "password", message: "Password must be at least 8 characters" },
	PASSWORD_TOO_LONG: { field: "password", message: "Password is too long" },
};

function readTokenFromWindow(): string | undefined {
	if (typeof window === "undefined") {
		return undefined;
	}
	return new URLSearchParams(window.location.search).get("token") ?? undefined;
}

interface ResetPasswordFormProps {
	initialToken?: string;
	initialUrlError?: string;
}

export function ResetPasswordForm({ initialToken, initialUrlError }: ResetPasswordFormProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
	const [formError, setFormError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [windowToken] = useState(readTokenFromWindow);

	const token = initialToken ?? searchParams.get("token") ?? windowToken ?? undefined;
	const urlError = initialUrlError ?? searchParams.get("error") ?? undefined;

	const tokenError = urlError === "INVALID_TOKEN"
		? "This reset link is invalid or has expired. Request a new one."
		: !token
			? "Missing reset token. Open the link from your email or request a new one."
			: null;

	const canSubmit
		= password.length >= 8
			&& confirmPassword.length > 0
			&& !isSubmitting
			&& urlError !== "INVALID_TOKEN";

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setFieldErrors({});
		setFormError(null);

		if (!token) {
			setFormError("Missing reset token. Request a new password reset link.");
			return;
		}

		const result = resetPasswordSchema.safeParse({ password, confirmPassword });
		if (!result.success) {
			const errors: FieldErrors = {};
			for (const issue of result.error.issues) {
				const field = issue.path[0] as keyof FieldErrors;
				if (!errors[field]) {
					errors[field] = issue.message;
				}
			}
			setFieldErrors(errors);
			return;
		}

		setIsSubmitting(true);

		let error: { code?: string; message?: string } | null | undefined;
		try {
			({ error } = await authClient.resetPassword({
				newPassword: result.data.password,
				token,
			}));
		}
		catch {
			setFormError(AUTH_CONNECTION_ERROR_MESSAGE);
			setIsSubmitting(false);
			return;
		}

		if (error) {
			const mapped = SERVER_ERROR_MAP[error.code ?? ""];
			if (mapped?.field) {
				setFieldErrors({ [mapped.field]: mapped.message });
			}
			else if (mapped) {
				setFormError(mapped.message);
			}
			else {
				setFormError(error.message ?? "Something went wrong. Please try again.");
			}
			setIsSubmitting(false);
			return;
		}

		router.push("/signin?reset=success");
	}

	return (
		<form onSubmit={handleSubmit} className="auth-stagger flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<Heading level={2} size={8} className="font-display">
					Choose a new password
				</Heading>
				<Text size={2} color="gray">
					Enter a new password for your LoMo account.
				</Text>
			</div>

			<TextField
				name="password"
				type="password"
				isRequired
				isInvalid={!!fieldErrors.password}
				value={password}
				onChange={setPassword}
			>
				<Label>New password</Label>
				<Group>
					<Input placeholder="At least 8 characters" />
				</Group>
				{fieldErrors.password && <FieldError>{fieldErrors.password}</FieldError>}
			</TextField>

			<TextField
				name="confirmPassword"
				type="password"
				isRequired
				isInvalid={!!fieldErrors.confirmPassword}
				value={confirmPassword}
				onChange={setConfirmPassword}
			>
				<Label>Confirm password</Label>
				<Group>
					<Input placeholder="Re-enter your password" />
				</Group>
				{fieldErrors.confirmPassword && (
					<FieldError>{fieldErrors.confirmPassword}</FieldError>
				)}
			</TextField>

			{(formError ?? tokenError) && (
				<div className="rounded-[var(--radius-2)] border border-red-6 bg-red-2 px-4 py-3">
					<Text size={2} color="red">{formError ?? tokenError}</Text>
				</div>
			)}

			<Button
				type="submit"
				variant="solid"
				color="yellow"
				isDisabled={!canSubmit}
				className="mt-2"
			>
				{isSubmitting ? "Updating..." : "Update password"}
			</Button>

			<Text size={2} color="gray" className="text-center">
				Need a new link?
				{" "}
				<Link href="/forgot-password" color="terracotta">
					Request reset again
				</Link>
			</Text>
		</form>
	);
}
