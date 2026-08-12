/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as helpRequests from "../helpRequests.js";
import type * as http from "../http.js";
import type * as lib_currentUser from "../lib/currentUser.js";
import type * as lib_siteEnv from "../lib/siteEnv.js";
import type * as lib_verifyResendWebhook from "../lib/verifyResendWebhook.js";
import type * as notifications from "../notifications.js";
import type * as redactHelpRequest from "../redactHelpRequest.js";
import type * as requestMessages from "../requestMessages.js";
import type * as resendInboundHttp from "../resendInboundHttp.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  helpRequests: typeof helpRequests;
  http: typeof http;
  "lib/currentUser": typeof lib_currentUser;
  "lib/siteEnv": typeof lib_siteEnv;
  "lib/verifyResendWebhook": typeof lib_verifyResendWebhook;
  notifications: typeof notifications;
  redactHelpRequest: typeof redactHelpRequest;
  requestMessages: typeof requestMessages;
  resendInboundHttp: typeof resendInboundHttp;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  betterAuth: import("@convex-dev/better-auth/_generated/component.js").ComponentApi<"betterAuth">;
};
