import { describe, it, expect, beforeEach } from "vitest";
import { convexTest } from "convex-test";
import { api } from "./_generated/api";
import schema from "./schema";

describe("users: Destructive Data Operations", () => {
  let t: ReturnType<typeof convexTest>;
  let userId: string;

  beforeEach(async () => {
    const modules = import.meta.glob("./**/*.ts");
    t = convexTest(schema, modules);

    // Setup a mock user
    userId = await t.run(async (ctx) => ctx.db.insert("users", {
      tokenIdentifier: "user-to-delete",
      subject: "user-to-delete",
      email: "delete-me@example.com",
    }));
  });

  it("rejects account deletion if the password is empty or whitespace", async () => {
    const tUser = t.withIdentity({ subject: "user-to-delete", tokenIdentifier: "user-to-delete" });

    await expect(
      tUser.mutation(api.users.deleteMyAccount, { password: "   " })
    ).rejects.toThrow("Password is required");
  });

  it("rejects account deletion if the user is unauthenticated", async () => {
    // Attempting to delete without setting t.withIdentity()
    await expect(
      t.mutation(api.users.deleteMyAccount, { password: "validPassword123!" })
    ).rejects.toThrow("Unauthenticated");
  });
});