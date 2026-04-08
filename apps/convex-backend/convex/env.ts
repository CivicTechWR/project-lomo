/* eslint-disable node/prefer-global/process */
import { z } from "zod";

const envSchema = z.object({
	SITE_URL: z.url(),
});

export const env = envSchema.parse(process.env);
