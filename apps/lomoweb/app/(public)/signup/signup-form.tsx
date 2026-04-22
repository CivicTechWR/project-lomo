"use client";

import { api } from "@repo/convex-backend/convex/_generated/api";
import { Button } from "@repo/ui/button";
import { FieldError, Group, Label } from "@repo/ui/field";
import { Heading } from "@repo/ui/heading";
import { Link } from "@repo/ui/link";
import { Text } from "@repo/ui/text";
import { Input, TextField } from "@repo/ui/text-field";
import { useMutation } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";

const signupSchema = z
	.object({
		name: z.string().min(1, "Name is required"),
		email: z.string().email("Please enter a valid email address"),
		password: z.string().min(8, "Password must be at least 8 characters"),
		phone: z.string(),
	})
	.superRefine((data, ctx) => {
		const t = data.phone.trim();
		if (t.length === 0) {
			return;
		}
		if (t.length < 7) {
			ctx.addIssue({
				code: "custom",
				path: ["phone"],
				message: "If you add a phone number, enter at least 7 characters.",
			});
		}
		if (t.length > 32) {
			ctx.addIssue({
				code: "custom",
				path: ["phone"],
				message: "Phone number looks too long. Try a shorter entry.",
			});
		}
	});

type FieldErrors = Partial<Record<"name" | "email" | "password" | "phone", string>>;

const SERVER_ERROR_MAP: Record<string, { field?: keyof FieldErrors; message: string }> = {
	INVALID_EMAIL: { field: "email", message: "Please enter a valid email address" },
	INVALID_PASSWORD: { field: "password", message: "Invalid password" },
	PASSWORD_TOO_SHORT: { field: "password", message: "Password is too short" },
	PASSWORD_TOO_LONG: { field: "password", message: "Password is too long" },
	USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: { field: "email", message: "An account with this email already exists" },
};

function getRedirectPath(searchParams: URLSearchParams): string {
	const redirect = searchParams.get("redirect");
	if (redirect && redirect.startsWith("/app")) {
		return redirect;
	}
	return "/app";
}

export function SignUpForm() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [phone, setPhone] = useState("");
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
	const [formError, setFormError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const updatePublicProfile = useMutation(api.users.updatePublicProfile);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setFieldErrors({});
		setFormError(null);

		const result = signupSchema.safeParse({ name, email, password, phone });
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

		const { error } = await authClient.signUp.email({
			name: result.data.name,
			email: result.data.email,
			password: result.data.password,
		});

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

		const phoneTrimmed = result.data.phone.trim();
		if (phoneTrimmed.length > 0) {
			try {
				await updatePublicProfile({ phone: phoneTrimmed });
			}
			catch (e) {
				console.error(e);
				window.alert(
					"Your account was created, but we could not save your phone number. You can add it under Profile in the app.",
				);
			}
		}

		router.push(getRedirectPath(searchParams));
	}

	const signinHref = searchParams.get("redirect")
		? `/signin?redirect=${encodeURIComponent(searchParams.get("redirect")!)}`
		: "/signin";

	return (
		<form onSubmit={handleSubmit} className="auth-stagger flex flex-col gap-6">
			{/* Header */}
			<div className="flex flex-col gap-2">
				<Heading level={2} size={8} className="font-display">
					Create Your Account
				</Heading>
				<Text size={2} color="gray">
					Before you begin, we&apos;ll ask for a few basics so we can help
					people connect thoughtfully.
				</Text>
			</div>

			{/* Fields */}
			<TextField
				name="name"
				isRequired
				isInvalid={!!fieldErrors.name}
				value={name}
				onChange={setName}
			>
				<Label>Preferred name</Label>
				<Group>
					<Input placeholder="What should we call you?" />
				</Group>
				{fieldErrors.name && <FieldError>{fieldErrors.name}</FieldError>}
			</TextField>

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
				<Label>Password</Label>
				<Group>
					<Input placeholder="At least 8 characters" />
				</Group>
				{fieldErrors.password && (
					<FieldError>{fieldErrors.password}</FieldError>
				)}
			</TextField>

			<div className="flex flex-col gap-2">
				<TextField
					name="phone"
					type="tel"
					autoComplete="tel"
					isInvalid={!!fieldErrors.phone}
					value={phone}
					onChange={setPhone}
				>
					<Label>Mobile number (optional)</Label>
					<Group>
						<Input placeholder="e.g. +1 519 555 0100" />
					</Group>
					{fieldErrors.phone && <FieldError>{fieldErrors.phone}</FieldError>}
				</TextField>
				<Text size={1} color="gray" className="leading-relaxed">
					If you add a number, we only share it with someone after you are matched
					on a request, so you can coordinate by text outside LoMo. LoMo does not
					send texts or host chat in the app. If you skip this, a matched
					volunteer will reach you by email using a masked address so your real
					email stays private.
				</Text>
			</div>

			{/* Form-level error */}
			{formError && (
				<div className="rounded-[var(--radius-2)] border border-red-6 bg-red-2 px-4 py-3">
					<Text size={2} color="red">{formError}</Text>
				</div>
			)}

			{/* Submit */}
			<Button
				type="submit"
				variant="solid"
				color="yellow"
				isDisabled={isSubmitting}
				className="mt-2"
			>
				{isSubmitting ? "Creating account..." : "Sign up"}
			</Button>

			{/* Footer */}
			<Text size={2} color="gray" className="text-center">
				{"Already have an account? "}
				<Link href={signinHref} color="terracotta">
					Sign in
				</Link>
			</Text>
		</form>
	);
}
