import { convexTest } from "convex-test";
import { describe, test, expect } from "vitest";
import schema from "./schema";
import { api } from "./_generated/api";
import { register as registerBetterAuth } from "@convex-dev/better-auth/test";

// Load all modules
const modules = import.meta.glob("./**/*.ts");

function makeTest(identity?: { subject: string; name: string }) {
  const t = convexTest(schema, modules);
  registerBetterAuth(t);
  
  if (identity) {
    // Cast to any to satisfy strict type constraints on test helper chaining with components
    return (t as any).withIdentity(identity);
  }
  return t;test("blocks unauthenticated users from running protected mutations", async () => {
    const t = makeTest(); // Unauthenticated client

    // Assuming you have a mutation like api.posts.create
    const action = t.mutation(api.posts.create, { title: "Test Post" });

    // Assert that it throws an unauthenticated error
    await expect(action).rejects.toThrow();
  });
}

test("quick auth test", async () => {
  const tAuth = makeTest({ subject: "user_1", name: "Alex" });
  expect(tAuth).toBeDefined();
});

describe("auth: getCurrentUser", () => {
  // User Authentication
  test("returns null when the user is not authenticated", async () => {
    const t = makeTest();
    const user = await t.query(api.auth.getCurrentUser);
    expect(user).toBeNull();
  });

  // Authorized User ID
  test("returns the user identity when authenticated", async () => {
    const t = makeTest();
    
    const mockIdentity = {
      subject: "user_12345",
      name: "Taylor",
      email: "taylor@example.com",
    };

    const tAuth = (t as any).withIdentity(mockIdentity);
    const user = await tAuth.query(api.auth.getCurrentUser);

    expect(user).not.toBeNull();
    expect(user?.subject).toBe("user_12345");
  });
});

test("syncs auth token with database user record", async () => {
  const t = makeTest();
  
  // Manually insert a mock user into the in-memory database
  const userId = await t.run(async (ctx) => {
    return await ctx.db.insert("users", { 
      name: "Test User", 
      email: "test@example.com",
      tokenIdentifier: "test_token_identifier",
      subject: "test_subject_123",
    } as any);
  });

  // Tie the auth token to that specific database ID
  const tAuth = (t as any).withIdentity({ subject: userId, name: "Test User" });
  
  const user = await tAuth.query(api.auth.getCurrentUser);
  
  // Ensure token successfully mapped to the DB record
  expect(user?.name).toBe("Test User");
});

test("blocks unauthenticated users from running protected mutations", async () => {
  const t = makeTest(); // Unauthenticated client

  // Assuming you have a mutation like api.posts.create
  const action = t.mutation(api.posts.create, { title: "Test Post" });

  // Assert that it throws an unauthenticated error
  await expect(action).rejects.toThrow();
});

test("returns user identity when session token is active", async () => {
  const t = makeTest();

  const tAuth = (t as any).withIdentity({ 
    subject: "ghost_user", 
    name: "Casper" 
  });

  const user = await tAuth.query(api.auth.getCurrentUser);
  
  expect(user).not.toBeNull();
  expect(user?.name).toBe("Casper");
});

test("handles malformed or empty identity subjects gracefully", async () => {
  const t = makeTest();

  // Pass an empty or partial subject
  const tAuth = (t as any).withIdentity({ 
    subject: "", 
    name: "" 
  });

  const user = await tAuth.query(api.auth.getCurrentUser);
  
  // Verify function doesn't crash
  expect(user?.subject).toBe("");
});

test("isolates identity state between different authenticated clients", async () => {
  const t = makeTest();

  const clientOne = (t as any).withIdentity({ subject: "user_one", name: "Alpha" });
  const clientTwo = (t as any).withIdentity({ subject: "user_two", name: "Bravo" });

  const userOne = await clientOne.query(api.auth.getCurrentUser);
  const userTwo = await clientTwo.query(api.auth.getCurrentUser);

  expect(userOne?.name).toBe("Alpha");
  expect(userTwo?.name).toBe("Bravo");
});