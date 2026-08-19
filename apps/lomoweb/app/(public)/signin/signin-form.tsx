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

const signinSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(1, "Password is required"),
});

type FieldErrors = Partial<Record<"email" | "password", string>>;

const SERVER_ERROR_MAP: Record<
	string,
	{ field?: keyof FieldErrors; message: string }
> = {
	INVALID_EMAIL: {
		field: "email",
		message: "Please enter a valid email address",
	},
	INVALID_EMAIL_OR_PASSWORD: { message: "Invalid email or password" },
	EMAIL_NOT_VERIFIED: { message: "Please verify your email before signing in" },
	INVALID_ORIGIN: {
		message:
			"Sign-in was blocked because this page’s origin is not allowed. "
			+ "On production, set Convex SITE_URL (and the host’s NEXT_PUBLIC_SITE_URL) "
			+ "to your live app URL (e.g. https://your-app.example). "
			+ "For local dev, open http://localhost:3000 and keep SITE_URL matching that origin.",
	},
};

function getRedirectPath(searchParams: URLSearchParams): string {
	const redirect = searchParams.get("redirect");
	if (redirect && redirect.startsWith("/app")) {
		return redirect;
	}
	return "/app";
}

export function SignInForm() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
	const [formError, setFormError] = useState<string | null>(null);
	const [successMessage] = useState<string | null>(() =>
		searchParams.get("reset") === "success"
			? "Your password was updated. Sign in with your new password."
			: null,
	);
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setFieldErrors({});
		setFormError(null);

		const result = signinSchema.safeParse({ email, password });
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
			({ error } = await authClient.signIn.email({
				email: result.data.email,
				password: result.data.password,
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
				setFormError(
					error.message ?? "Something went wrong. Please try again.",
				);
			}
			setIsSubmitting(false);
			return;
		}

		router.push(getRedirectPath(searchParams));
	}

	const signupHref = searchParams.get("redirect")
		? `/signup?redirect=${encodeURIComponent(searchParams.get("redirect")!)}`
		: "/signup";

	return (
		<form onSubmit={handleSubmit} className="auth-stagger flex flex-col gap-6">
			{/* Header */}
			<div className="flex flex-col gap-2">
				<Heading level={2} size={8} className="font-display">
					Welcome back
				</Heading>
				<Text size={2} color="gray">
					Sign in to reconnect with your community.
				</Text>
			</div>

			{/* Fields */}
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

			<TextField
				name="password"
				type="password"
				isRequired
				isInvalid={!!fieldErrors.password}
				value={password}
				onChange={setPassword}
			>
				<div className="flex items-center justify-between gap-2">
					<Label>Password</Label>
					<Link href="/forgot-password" color="terracotta" className="text-[length:var(--font-size-1)]">
						Forgot password?
					</Link>
				</div>
				<Group>
					<Input placeholder="Enter your password" />
				</Group>
				{fieldErrors.password && (
					<FieldError>{fieldErrors.password}</FieldError>
				)}
			</TextField>

			{successMessage && (
				<div className="rounded-[var(--radius-2)] border border-sage-6 bg-sage-2 px-4 py-3">
					<Text size={2} color="sage">{successMessage}</Text>
				</div>
			)}

			{/* Form-level error */}
			{formError && (
				<div className="rounded-[var(--radius-2)] border border-red-6 bg-red-2 px-4 py-3">
					<Text size={2} color="red">
						{formError}
					</Text>
				</div>
			)}

			{/* Submit */}
			<Button
				type="submit"
				variant="solid"
				color="yellow"
				isDisabled={isSubmitting}
				className="mt-2"
				size={3}
				border="large"
				borderColor="terracotta"
			>
				{isSubmitting ? "Signing in..." : "Login"}
			</Button>

			{/* Footer */}
			<Text size={2} color="gray" className="text-center">
				{"Don't have an account? "}
				<Link href={signupHref} color="terracotta">
					Sign up
				</Link>
			</Text>
		</form>
	);
}
