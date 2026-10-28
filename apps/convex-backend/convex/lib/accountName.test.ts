import { memoryAdapter } from "better-auth/adapters/memory";
import { betterAuth } from "better-auth/minimal";
import { describe, expect, it } from "bun:test";
import { accountNameDatabaseHooks } from "./accountName";
import { INVALID_PERSON_NAME_CODE, PERSON_NAME_CHARACTERS_ERROR } from "./personName";

function createTestAuth() {
	return betterAuth({
		baseURL: "http://localhost:3000",
		secret: "test-secret-that-is-long-enough-for-better-auth",
		database: memoryAdapter({ user: [], session: [], account: [], verification: [] }),
		emailAndPassword: { enabled: true },
		databaseHooks: accountNameDatabaseHooks,
	});
}

const PASSWORD = "long-enough-password";

describe("account_name database hooks", () => {
	it("rejects sign-up with an @ in the name", async () => {
		const auth = createTestAuth();

		const error = await auth.api
			.signUpEmail({ body: { name: "sam@example.test", email: "sam@example.test", password: PASSWORD } })
			.catch((e: unknown) => e);

		expect(error).toMatchObject({
			status: "BAD_REQUEST",
			body: { code: INVALID_PERSON_NAME_CODE, message: PERSON_NAME_CHARACTERS_ERROR },
		});
	});

	it("stores the trimmed name on sign-up", async () => {
		const auth = createTestAuth();

		const result = await auth.api.signUpEmail({
			body: { name: "  Zoë   D’Angelo ", email: "zoe@example.test", password: PASSWORD },
		});

		expect(result.user.name).toBe("Zoë D’Angelo");
	});

	it("rejects renaming to an invalid name and allows a valid one", async () => {
		const auth = createTestAuth();
		const { headers } = await auth.api.signUpEmail({
			body: { name: "Sam", email: "rename@example.test", password: PASSWORD },
			returnHeaders: true,
		});
		const sessionHeaders = new Headers({ cookie: headers.getSetCookie().map(c => c.split(";")[0]).join("; ") });

		const error = await auth.api
			.updateUser({ headers: sessionHeaders, body: { name: "Sam <3" } })
			.catch((e: unknown) => e);
		expect(error).toMatchObject({ body: { code: INVALID_PERSON_NAME_CODE } });

		await auth.api.updateUser({ headers: sessionHeaders, body: { name: " Samira " } });
		const session = await auth.api.getSession({ headers: sessionHeaders });
		expect(session?.user.name).toBe("Samira");
	});
});
