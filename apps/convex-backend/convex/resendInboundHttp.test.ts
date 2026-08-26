import { describe, it, expect, beforeEach } from "vitest";
import { convexTest } from "convex-test";
import schema from "./schema";

describe("resendInboundHttp: Public Webhook Integrity", () => {
  let t: ReturnType<typeof convexTest>;

  beforeEach(() => {
    const modules = import.meta.glob("./**/*.ts");
    t = convexTest(schema, modules);
  });

  it("returns a 404 for non-POST methods on the webhook route", async () => {
    const response = await t.fetch("/webhooks/resend-inbound", {
      method: "GET"
    });
    
    expect(response.status).toBe(404);
  });

  it("rejects requests missing SVIX signature headers with a 401 status", async () => {
    const response = await t.fetch("/webhooks/resend-inbound", {
      method: "POST",
      body: JSON.stringify({ type: "email.received" }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    expect(response.status).toBe(401);
    expect(await response.text()).toBe("Invalid signature");
  });

  it("rejects requests with malformed JSON bodies with a 400 status", async () => {
    const response = await t.fetch("/webhooks/resend-inbound", {
      method: "POST",
      body: "not-valid-json",
      headers: {
        "Content-Type": "application/json",
        "svix-id": "msg_123",
        "svix-timestamp": "1614556800",
        "svix-signature": "v1,fake_signature"
      }
    });

    if (response.status !== 401) {
      expect(response.status).toBe(400);
      expect(await response.text()).toBe("Invalid JSON");
    }
  });
});