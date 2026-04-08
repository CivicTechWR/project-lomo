import type { SignUpFormData } from "#/lib/auth-schemas";
import { PasswordField } from "#/components/password-field";
import { authClient } from "#/lib/auth-client";
import { handleAuthError, SIGN_UP_ERROR_MAP } from "#/lib/auth-errors";
import { authSearchSchema, signUpSchema } from "#/lib/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { FieldError, Group, Label } from "@repo/ui/field";
import { Heading } from "@repo/ui/heading";
import { LoaderIcon } from "@repo/ui/icons";
import { Text } from "@repo/ui/text";
import { Input, TextField } from "@repo/ui/text-field";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const Route = createFileRoute("/signup")({
	validateSearch: authSearchSchema,
	beforeLoad: ({ context, search }) => {
		if (context.isAuthenticated) {
			throw redirect({ to: search.redirect ?? "/app" });
		}
	},
	component: SignUpPage,
});

function SignUpPage() {
	const search = Route.useSearch();
	const navigate = useNavigate();
	const [formError, setFormError] = useState<string | null>(null);

	const { control, handleSubmit, setError, formState: { isSubmitting } } = useForm<SignUpFormData>({
		resolver: zodResolver(signUpSchema),
		shouldFocusError: true,
		defaultValues: { name: "", email: "", password: "" },
	});

	async function onSubmit(data: SignUpFormData) {
		setFormError(null);

		const { error } = await authClient.signUp.email({
			name: data.name,
			email: data.email,
			password: data.password,
		});

		if (error) {
			const formMessage = handleAuthError(error, SIGN_UP_ERROR_MAP, setError);
			if (formMessage) {
				setFormError(formMessage);
			}
			return;
		}

		await navigate({ to: search.redirect ?? "/app" });
	}

	return (
		<div className="mx-auto flex w-full max-w-sm flex-col items-center py-16">
			<form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-6">
				<div className="flex flex-col gap-2">
					<Heading level={2} size={7} weight="bold">
						Create an account
					</Heading>
					<Text size={2} color="gray">
						Join your community on LoMo.
					</Text>
				</div>

				<Controller
					control={control}
					name="name"
					render={({ field, fieldState }) => (
						<TextField
							isInvalid={fieldState.invalid}
							name={field.name}
							value={field.value}
							onChange={field.onChange}
							onBlur={field.onBlur}
						>
							<Label>Name</Label>
							<Group>
								<Input type="text" placeholder="Your name" />
							</Group>
							{fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
						</TextField>
					)}
				/>

				<Controller
					control={control}
					name="email"
					render={({ field, fieldState }) => (
						<TextField
							isInvalid={fieldState.invalid}
							name={field.name}
							value={field.value}
							onChange={field.onChange}
							onBlur={field.onBlur}
						>
							<Label>Email address</Label>
							<Group>
								<Input type="email" placeholder="you@example.com" />
							</Group>
							{fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
						</TextField>
					)}
				/>

				<Controller
					control={control}
					name="password"
					render={({ field, fieldState }) => (
						<PasswordField
							field={field}
							isInvalid={fieldState.invalid}
							errorMessage={fieldState.error?.message}
							placeholder="At least 8 characters"
						/>
					)}
				/>

				{formError && (
					<div
						role="alert"
						className="rounded-[var(--radius-2)] border border-red-6 bg-red-2 px-4 py-3"
					>
						<Text size={2} color="red">{formError}</Text>
					</div>
				)}

				<Button type="submit" variant="solid" color="terracotta" isPending={isSubmitting}>
					{({ isPending }) => (
						<>
							{isPending && <LoaderIcon />}
							{isPending ? "Creating account..." : "Sign up"}
						</>
					)}
				</Button>

				<Text size={2} color="gray" className="text-center">
					{"Already have an account? "}
					<Link
						to="/signin"
						search={{ redirect: search.redirect }}
						className="font-medium text-terracotta-11 hover:underline"
					>
						Sign in
					</Link>
				</Text>
			</form>
		</div>
	);
}
