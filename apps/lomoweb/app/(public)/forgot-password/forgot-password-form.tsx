"use client";

import { Button } from "@repo/ui/button";
import { FieldError, Group, Label } from "@repo/ui/field";
import { Heading } from "@repo/ui/heading";
import { Link } from "@repo/ui/link";
import { Text } from "@repo/ui/text";
import { Input, TextField } from "@repo/ui/text-field";
import { useState } from "react";
import { z } from "zod";
import { AUTH_CONNECTION_ERROR_MESSAGE, authClient } from "@/lib/auth-client";

const forgotPasswordSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
});

type FieldErrors = Partial<Record<"email", string>>;

export function ForgotPasswordForm() {
	const [email, setEmail] = useState("");
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
	const [formError, setFormError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [sent, setSent] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setFieldErrors({});
		setFormError(null);

		const result = forgotPasswordSchema.safeParse({ email });
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

		const redirectTo = `${window.location.origin}/reset-password`;

		let error: { code?: string; message?: string } | null | undefined;
		try {
			({ error } = await authClient.requestPasswordReset({
				email: result.data.email,
				redirectTo,
			}));
		}
		catch {
			setFormError(AUTH_CONNECTION_ERROR_MESSAGE);
			setIsSubmitting(false);
			return;
		}

		if (error) {
			if (error.code === "RESET_PASSWORD_DISABLED") {
				setFormError("Password reset is not available right now. Please try again later.");
			}
			else {
				setFormError(error.message ?? "Something went wrong. Please try again.");
			}
			setIsSubmitting(false);
			return;
		}

		setSent(true);
		setIsSubmitting(false);
	}

	if (sent) {
		return (
			<div className="auth-stagger flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					<Heading level={2} size={8} className="font-display">
						Check your email
					</Heading>
					<Text size={2} color="gray">
						If an account exists for
						{" "}
						{email}
						, we sent a link to reset your password.
						The link expires in one hour.
					</Text>
				</div>
				<Link href="/signin" color="terracotta">
					Back to sign in
				</Link>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="auth-stagger flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<Heading level={2} size={8} className="font-display">
					Reset your password
				</Heading>
				<Text size={2} color="gray">
					Enter your email and we will send you a link to choose a new password.
				</Text>
			</div>

			<TextField
				name="email"
				type="email"
				isRequired
				isInvalid={!!fieldErrors.email}
				value={email}
				onChange={setEmail}
			>
				<Label>Email address</Label>
				<Group>
					<Input placeholder="you@example.com" />
				</Group>
				{fieldErrors.email && <FieldError>{fieldErrors.email}</FieldError>}
			</TextField>

			{formError && (
				<div className="rounded-[var(--radius-2)] border border-red-6 bg-red-2 px-4 py-3">
					<Text size={2} color="red">{formError}</Text>
				</div>
			)}

			<Button
				type="submit"
				variant="solid"
				color="yellow"
				isDisabled={isSubmitting}
				className="mt-2"
				border="large"
				borderColor="terracotta"
			>
				{isSubmitting ? "Sending..." : "Send reset link"}
			</Button>

			<Text size={2} color="gray" className="text-center">
				Remember your password?
				{" "}
				<Link href="/signin" color="terracotta">
					Sign in
				</Link>
			</Text>
		</form>
	);
}
