import { convexBetterAuthReactStart } from "@convex-dev/better-auth/react-start";

export const {
	handler,
	getToken,
	fetchAuthQuery,
	fetchAuthMutation,
	fetchAuthAction,
} = convexBetterAuthReactStart({
	convexUrl: import.meta.env.VITE_CONVEX_URL!,
	convexSiteUrl: import.meta.env.VITE_CONVEX_SITE_URL!,
});
