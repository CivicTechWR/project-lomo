/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as adminDashboard from "../adminDashboard.js";
import type * as adminSettings from "../adminSettings.js";
import type * as auth from "../auth.js";
import type * as helpRequests from "../helpRequests.js";
import type * as http from "../http.js";
import type * as lib_adminAuth from "../lib/adminAuth.js";
import type * as lib_currentUser from "../lib/currentUser.js";
import type * as lib_geo from "../lib/geo.js";
import type * as lib_helperPreferences from "../lib/helperPreferences.js";
import type * as lib_messageEmail from "../lib/messageEmail.js";
import type * as lib_notificationHelpers from "../lib/notificationHelpers.js";
import type * as lib_purgeRequest from "../lib/purgeRequest.js";
import type * as lib_purgeUserAppData from "../lib/purgeUserAppData.js";
import type * as lib_requestLocation from "../lib/requestLocation.js";
import type * as lib_requestMetadata from "../lib/requestMetadata.js";
import type * as lib_resendEmail from "../lib/resendEmail.js";
import type * as lib_seedData from "../lib/seedData.js";
import type * as lib_siteEnv from "../lib/siteEnv.js";
import type * as lib_stripEmailReply from "../lib/stripEmailReply.js";
import type * as lib_userStatus from "../lib/userStatus.js";
import type * as lib_verifyResendWebhook from "../lib/verifyResendWebhook.js";
import type * as notifications from "../notifications.js";
import type * as redactHelpRequest from "../redactHelpRequest.js";
import type * as requestGeocode from "../requestGeocode.js";
import type * as requestMessages from "../requestMessages.js";
import type * as resendInboundHttp from "../resendInboundHttp.js";
import type * as seed from "../seed.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adminDashboard: typeof adminDashboard;
  adminSettings: typeof adminSettings;
  auth: typeof auth;
  helpRequests: typeof helpRequests;
  http: typeof http;
  "lib/adminAuth": typeof lib_adminAuth;
  "lib/currentUser": typeof lib_currentUser;
  "lib/geo": typeof lib_geo;
  "lib/helperPreferences": typeof lib_helperPreferences;
  "lib/messageEmail": typeof lib_messageEmail;
  "lib/notificationHelpers": typeof lib_notificationHelpers;
  "lib/purgeRequest": typeof lib_purgeRequest;
  "lib/purgeUserAppData": typeof lib_purgeUserAppData;
  "lib/requestLocation": typeof lib_requestLocation;
  "lib/requestMetadata": typeof lib_requestMetadata;
  "lib/resendEmail": typeof lib_resendEmail;
  "lib/seedData": typeof lib_seedData;
  "lib/siteEnv": typeof lib_siteEnv;
  "lib/stripEmailReply": typeof lib_stripEmailReply;
  "lib/userStatus": typeof lib_userStatus;
  "lib/verifyResendWebhook": typeof lib_verifyResendWebhook;
  notifications: typeof notifications;
  redactHelpRequest: typeof redactHelpRequest;
  requestGeocode: typeof requestGeocode;
  requestMessages: typeof requestMessages;
  resendInboundHttp: typeof resendInboundHttp;
  seed: typeof seed;
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
