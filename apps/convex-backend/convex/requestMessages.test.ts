import { describe, it, expect, beforeEach } from "vitest";
import { convexTest } from "convex-test";
import { api, internal } from "./_generated/api";
import schema from "./schema";

describe("requestMessages: Access Control & Privacy", () => {
  let t: ReturnType<typeof convexTest>;
  let ownerId: string;
  let helperId: string;
  let strangerId: string;
  let requestId: string;

  beforeEach(async () => {
    // Initialize the Convex test environment
    const modules = import.meta.glob("./**/*.ts");
    t = convexTest(schema, modules);

    // Setup mock users with the required tokenIdentifier field
    ownerId = await t.run(async (ctx) => ctx.db.insert("users", { 
      tokenIdentifier: "owner-123", 
      subject: "owner-123", 
      email: "owner@example.com" 
    }));
    helperId = await t.run(async (ctx) => ctx.db.insert("users", { 
      tokenIdentifier: "helper-123", 
      subject: "helper-123", 
      email: "helper@example.com" 
    }));
    strangerId = await t.run(async (ctx) => ctx.db.insert("users", { 
      tokenIdentifier: "stranger-123", 
      subject: "stranger-123", 
      email: "stranger@example.com" 
    }));

    // Setup an active request with all required schema fields
    requestId = await t.run(async (ctx) => 
      ctx.db.insert("helpRequests", {
        ownerUserId: ownerId,
        helperUserId: helperId,
        status: "in_progress",
        category: "other",
        title: "Test Request",
        summary: "This is a test summary.",
        details: "These are the test details.",
        emailRelayToken: "token123"
      })
    );
  });

    it("rejects unauthorized third-party users from fetching messages", async () => {
      const tStranger = t.withIdentity({ subject: "stranger-123", tokenIdentifier: "stranger-123" });
      
      await expect(
        tStranger.query(api.requestMessages.listForRequest, { requestId })
      ).rejects.toThrow("Forbidden");
    });

    it("rejects unauthorized third-party users from posting messages", async () => {
      const tStranger = t.withIdentity({ subject: "stranger-123", tokenIdentifier: "stranger-123" });

      await expect(
        tStranger.mutation(api.requestMessages.post, { requestId, body: "Malicious entry" })
      ).rejects.toThrow("Forbidden");
    });

    it("allows the assigned helper to fetch and post messages", async () => {
      const tHelper = t.withIdentity({ subject: "helper-123", tokenIdentifier: "helper-123" });

      await tHelper.mutation(api.requestMessages.post, { requestId, body: "I am on my way." });
      const messages = await tHelper.query(api.requestMessages.listForRequest, { requestId });
      
      expect(messages).toHaveLength(1);
      expect(messages[0].body).toBe("I am on my way.");
    });

  describe("Spam Prevention", () => {
    it("blocks a user from exceeding the 30 messages per hour limit", async () => {
      const tOwner = t.withIdentity({ subject: "owner-123", tokenIdentifier: "owner-123" });

      await t.run(async (ctx) => {
        for (let i = 0; i < 30; i++) {
          await ctx.db.insert("requestMessages", {
            requestId,
            authorUserId: ownerId,
            body: `Spam ${i}`,
            source: "web"
          });
        }
      });

      await expect(
        tOwner.mutation(api.requestMessages.post, { requestId, body: "One more" })
      ).rejects.toThrow("Too many messages. Try again later.");
    });
  });

  describe("Email Spoofing Defenses", () => {
    beforeEach(() => {
      // Mock the environment variable required for email relay validation
      process.env.EMAIL_RELAY_DOMAIN = "relay.example.com";
    });

    it("rejects emails sent to an invalid relay domain", async () => {
      const result = await t.mutation(internal.requestMessages.ingestInboundEmail, {
        resendEmailId: "email_123",
        fromHeader: "owner@example.com",
        toAddresses: ["token123@malicious-domain.com"],
        subject: "Reply",
        bodyText: "Fake reply"
      });

      expect(result).toEqual({ ok: false, reason: "wrong_domain" });
    });

    it("rejects emails from a sender not participating in the request", async () => {
      const result = await t.mutation(internal.requestMessages.ingestInboundEmail, {
        resendEmailId: "email_456",
        fromHeader: "stranger@example.com", // Not the owner or helper
        toAddresses: ["token123@relay.example.com"],
        subject: "Reply",
        bodyText: "Intercepted reply"
      });

      expect(result).toEqual({ ok: false, reason: "sender_not_participant" });
    });

    it("accepts valid emails from the request owner", async () => {
      const result = await t.mutation(internal.requestMessages.ingestInboundEmail, {
        resendEmailId: "email_789",
        fromHeader: "owner@example.com",
        toAddresses: ["token123@relay.example.com"],
        subject: "Reply",
        bodyText: "Legitimate reply"
      });

      expect(result).toEqual({ ok: true, duplicate: false });
      
      // Verify the message was successfully stored
      const messages = await t.run(async (ctx) => ctx.db.query("requestMessages").collect());
      expect(messages).toHaveLength(1);
      expect(messages[0].source).toBe("email");
    });
  });
});