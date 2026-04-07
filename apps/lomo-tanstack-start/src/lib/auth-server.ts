import { convexBetterAuthReactStart } from "@convex-dev/better-auth/react-start";
import { serverEnv } from "./env-server";

export const {
	handler,
	getToken,
	fetchAuthQuery,
	fetchAuthMutation,
	fetchAuthAction,
} = convexBetterAuthReactStart({
	convexUrl: serverEnv.VITE_CONVEX_URL,
	convexSiteUrl: serverEnv.VITE_CONVEX_SITE_URL,
});
