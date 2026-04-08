import type { SignInFormData } from "#/lib/auth-schemas";
import { PasswordField } from "#/components/password-field";
import { authClient } from "#/lib/auth-client";
import { handleAuthError, SIGN_IN_ERROR_MAP } from "#/lib/auth-errors";
import { authSearchSchema, signInSchema } from "#/lib/auth-schemas";
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

export const Route = createFileRoute("/signin")({
	validateSearch: authSearchSchema,
	beforeLoad: ({ context, search }) => {
		if (context.isAuthenticated) {
			throw redirect({ to: search.redirect ?? "/app" });
		}
	},
	component: SignInPage,
});

function SignInPage() {
	const search = Route.useSearch();
	const navigate = useNavigate();
	const [formError, setFormError] = useState<string | null>(null);

	const { control, handleSubmit, setError, formState: { isSubmitting } } = useForm<SignInFormData>({
		resolver: zodResolver(signInSchema),
		shouldFocusError: true,
		defaultValues: { email: "", password: "" },
	});

	async function onSubmit(data: SignInFormData) {
		setFormError(null);

		const { error } = await authClient.signIn.email({
			email: data.email,
			password: data.password,
		});

		if (error) {
			const formMessage = handleAuthError(error, SIGN_IN_ERROR_MAP, setError);
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
						Welcome back
					</Heading>
					<Text size={2} color="gray">
						Sign in to reconnect with your community.
					</Text>
				</div>

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
							{isPending ? "Signing in..." : "Sign in"}
						</>
					)}
				</Button>

				<Text size={2} color="gray" className="text-center">
					{"Don't have an account? "}
					<Link
						to="/signup"
						search={{ redirect: search.redirect }}
						className="font-medium text-terracotta-11 hover:underline"
					>
						Sign up
					</Link>
				</Text>
			</form>
		</div>
	);
}
