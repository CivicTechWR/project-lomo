import { z } from "zod";

export const signInSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(1, "Password is required"),
});

export type SignInFormData = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Please enter a valid email address"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
		.regex(/[a-z]/, "Password must contain at least one lowercase letter")
		.regex(/\d/, "Password must contain at least one number")
		.regex(/[^A-Z0-9]/i, "Password must contain at least one special character"),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const authSearchSchema = z.object({
	redirect: z.string()
		.refine(val => val.startsWith("/") && !val.startsWith("//"), {
			message: "Redirect must be a relative path",
		})
		.optional()
		.catch(undefined),
});
