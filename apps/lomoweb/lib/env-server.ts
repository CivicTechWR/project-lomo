/* eslint-disable node/prefer-global/process */
import { z } from "zod";
import { clientSchema } from "./env-client";
import "server-only";

const serverSchema = clientSchema.extend({
	NEXT_PUBLIC_CONVEX_SITE_URL: z.url(),
});

export const env = serverSchema.parse(process.env);
