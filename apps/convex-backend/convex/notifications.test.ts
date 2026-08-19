import { convexTest } from "convex-test";
import { describe, test, expect } from "vitest";
import schema from "./schema";
import { api } from "./_generated/api";
import { register as registerBetterAuth } from "@convex-dev/better-auth/test";

const modules = import.meta.glob("./**/*.ts");

function makeTest() {
  const t = convexTest(schema, modules);
  registerBetterAuth(t);
  return t;
}

describe("notifications: listMine", () => {
  test("returns empty array when unauthenticated", async () => {
    const t = makeTest();
    const notifications = await t.query(api.notifications.listMine, {});
    expect(notifications).toEqual([]);
  });

  test("lists only notifications belonging to the authenticated user", async () => {
    const t = makeTest();

    const userTwoId = await t.run(async (ctx: any) => {
      return await ctx.db.insert("users", {
        name: "User Two",
        email: "two@example.com",
        tokenIdentifier: "user_two_token_id",
        subject: "user_two_id",
      } as any);
    });

    const internalUserOneId = await t.run(async (ctx: any) => {
      return await ctx.db.insert("users", {
        name: "User One",
        email: "one@example.com",
        tokenIdentifier: "user_one_token_id",
        subject: "user_one_id",
      } as any);
    });

    await t.run(async (ctx: any) => {
      await ctx.db.insert("notifications", {
        recipientUserId: internalUserOneId,
        isRead: false,
        type: "volunteer_assigned",
        title: "Test Notification",
        body: "Test body",
      } as any);
      
      await ctx.db.insert("notifications", {
        recipientUserId: userTwoId,
        isRead: false,
        type: "volunteer_assigned",
        title: "Test Notification",
        body: "Test body",
      } as any);
    });

    const tAuth = t.withIdentity({ 
      subject: "user_one_id", 
      tokenIdentifier: "user_one_token_id", 
      name: "User One", 
      email: "one@example.com" 
    });
    const notifications = await tAuth.query(api.notifications.listMine, {});

    expect(notifications.length).toBe(1);
  });

  test("filters unread notifications when unreadOnly is true", async () => {
    const t = makeTest();
    
    const userId = await t.run(async (ctx: any) => {
      return await ctx.db.insert("users", {
        name: "Filter User",
        email: "filter@example.com",
        tokenIdentifier: "user_filter_token_id",
        subject: "user_filter_id",
      } as any);
    });

    await t.run(async (ctx: any) => {
      await ctx.db.insert("notifications", {
        recipientUserId: userId,
        isRead: false,
        type: "volunteer_assigned",
        title: "Test Notification",
        body: "Test body",
      } as any);
      
      await ctx.db.insert("notifications", {
        recipientUserId: userId,
        isRead: true,
        type: "volunteer_assigned",
        title: "Test Notification",
        body: "Test body",
      } as any);
    });

    const tAuth = t.withIdentity({ 
      subject: "user_filter_id", 
      tokenIdentifier: "user_filter_token_id", 
      name: "Filter User", 
      email: "filter@example.com" 
    });
    const unreadOnlyList = await tAuth.query(api.notifications.listMine, { unreadOnly: true });

    expect(unreadOnlyList.length).toBe(1);
    expect(unreadOnlyList[0].isRead).toBe(false);
  });

  test("returns both read and unread notifications when unreadOnly is false", async () => {
    const t = makeTest();
    
    const userId = await t.run(async (ctx: any) => {
      return await ctx.db.insert("users", {
        name: "All User",
        email: "all@example.com",
        tokenIdentifier: "all_token_id",
        subject: "all_id",
      } as any);
    });

    await t.run(async (ctx: any) => {
      await ctx.db.insert("notifications", {
        recipientUserId: userId,
        isRead: false,
        type: "volunteer_assigned",
        title: "Unread",
        body: "Body",
      });
      await ctx.db.insert("notifications", {
        recipientUserId: userId,
        isRead: true,
        type: "volunteer_assigned",
        title: "Read",
        body: "Body",
      });
    });

    const tAuth = t.withIdentity({ subject: "all_id", tokenIdentifier: "all_token_id" });
    const notifications = await tAuth.query(api.notifications.listMine, { unreadOnly: false });

    expect(notifications.length).toBe(2);
  });

  test("returns notifications sorted by newest first", async () => {
    const t = makeTest();
    
    const userId = await t.run(async (ctx: any) => {
      return await ctx.db.insert("users", {
        name: "Sorted User",
        email: "sorted@example.com",
        tokenIdentifier: "sorted_token_id",
        subject: "sorted_id",
      } as any);
    });

    await t.run(async (ctx: any) => {
      await ctx.db.insert("notifications", {
        recipientUserId: userId,
        isRead: false,
        type: "volunteer_assigned",
        title: "First Created",
        body: "Body",
      });
      await ctx.db.insert("notifications", {
        recipientUserId: userId,
        isRead: false,
        type: "volunteer_assigned",
        title: "Second Created",
        body: "Body",
      });
    });

    const tAuth = t.withIdentity({ subject: "sorted_id", tokenIdentifier: "sorted_token_id" });
    const notifications = await tAuth.query(api.notifications.listMine, {});

    expect(notifications.length).toBe(2);
    expect(notifications[0].title).toBe("Second Created");
    expect(notifications[1].title).toBe("First Created");
  });

  test("enriches notifications with help request data when requestId is present", async () => {
    const t = makeTest();
    
    const userId = await t.run(async (ctx: any) => {
      return await ctx.db.insert("users", {
        name: "Enrich User",
        email: "enrich@example.com",
        tokenIdentifier: "enrich_token_id",
        subject: "enrich_id",
      } as any);
    });

    const requestId = await t.run(async (ctx: any) => {
      return await ctx.db.insert("helpRequests", {
        ownerUserId: userId,
        title: "Grocery Delivery",
        category: "food" as any,
        summary: "Need groceries delivered",
        details: "Please pick up milk and eggs from the store.",
        status: "pending" as any,
      } as any);
    });

    await t.run(async (ctx: any) => {
      await ctx.db.insert("notifications", {
        recipientUserId: userId,
        isRead: false,
        type: "volunteer_assigned",
        title: "Test Request",
        body: "Body",
        requestId: requestId,
      } as any);
    });

    const tAuth = t.withIdentity({ subject: "enrich_id", tokenIdentifier: "enrich_token_id" });
    const notifications = await tAuth.query(api.notifications.listMine, {});

    expect(notifications.length).toBe(1);
    expect(notifications[0]).toHaveProperty("requestId");
  });

  test("handles notifications gracefully when requestId is missing or null", async () => {
    const t = makeTest();
    
    const userId = await t.run(async (ctx: any) => {
      return await ctx.db.insert("users", {
        name: "NoReq User",
        email: "noreq@example.com",
        tokenIdentifier: "noreq_token_id",
        subject: "noreq_id",
      } as any);
    });

    await t.run(async (ctx: any) => {
      await ctx.db.insert("notifications", {
        recipientUserId: userId,
        isRead: false,
        type: "volunteer_assigned",
        title: "General Alert",
        body: "No request tied here",
        requestId: undefined,
      } as any);
    });

    const tAuth = t.withIdentity({ subject: "noreq_id", tokenIdentifier: "noreq_token_id" });
    const notifications = await tAuth.query(api.notifications.listMine, {});

    expect(notifications.length).toBe(1);
    expect(notifications[0].title).toBe("General Alert");
  });

  test("handles orphaned requestId gracefully when the referenced help request is deleted", async () => {
    const t = makeTest();
    
    const userId = await t.run(async (ctx: any) => {
      return await ctx.db.insert("users", {
        name: "Orphan User",
        email: "orphan@example.com",
        tokenIdentifier: "orphan_token_id",
        subject: "orphan_id",
      } as any);
    });

    const fakeRequestId = await t.run(async (ctx: any) => {
      const id = await ctx.db.insert("helpRequests", {
        ownerUserId: userId,
        title: "Temp Request",
        category: "food" as any,
        summary: "Temp summary",
        details: "Temp details",
        status: "pending" as any,
      } as any);
      await ctx.db.delete(id);
      return id;
    });

    await t.run(async (ctx: any) => {
      await ctx.db.insert("notifications", {
        recipientUserId: userId,
        isRead: false,
        type: "volunteer_assigned",
        title: "Orphan Notification",
        body: "Body",
        requestId: fakeRequestId,
      } as any);
    });

    const tAuth = t.withIdentity({ subject: "orphan_id", tokenIdentifier: "orphan_token_id" });
    const notifications = await tAuth.query(api.notifications.listMine, {});

    expect(notifications.length).toBe(1);
    expect(notifications[0].title).toBe("Orphan Notification");
  });

  
});

describe("notifications: markRead", () => {
  test("throws error if unauthenticated", async () => {
    const t = makeTest();
    
    const dummyId = await t.run(async (ctx: any) => {
      const dummyUser = await ctx.db.insert("users", { name: "Temp", email: "temp@example.com", tokenIdentifier: "t", subject: "s" } as any);
      return await ctx.db.insert("notifications", { recipientUserId: dummyUser, isRead: false, type: "volunteer_assigned", title: "Test Notification", body: "Test body" } as any);
    });

    const action = t.mutation(api.notifications.markRead, { notificationId: dummyId });
    await expect(action).rejects.toThrow("Unauthenticated");
  });

  test("successfully marks notification as read for the recipient", async () => {
    const t = makeTest();
    
    const userId = await t.run(async (ctx: any) => {
      return await ctx.db.insert("users", {
        name: "Owner",
        email: "owner@example.com",
        tokenIdentifier: "user_owner_token_id",
        subject: "user_owner_id",
      } as any);
    });

    const notifId = await t.run(async (ctx: any) => {
      return await ctx.db.insert("notifications", {
        recipientUserId: userId,
        isRead: false,
        type: "volunteer_assigned",
        title: "Test Notification",
        body: "Test body",
      } as any);
    });

    const tAuth = t.withIdentity({ 
      subject: "user_owner_id", 
      tokenIdentifier: "user_owner_token_id", 
      name: "Owner", 
      email: "owner@example.com" 
    });
    await tAuth.mutation(api.notifications.markRead, { notificationId: notifId });

    const updated = await t.run(async (ctx: any) => {
      return await ctx.db.get(notifId);
    });

    expect(updated.isRead).toBe(true);
  });

  test("prevents a user from marking another user's notification as read", async () => {
    const t = makeTest();
    
    const ownerId = await t.run(async (ctx: any) => {
      return await ctx.db.insert("users", {
        name: "Owner Two",
        email: "owner2@example.com",
        tokenIdentifier: "user_owner2_token_id",
        subject: "user_owner2_id",
      } as any);
    });

    await t.run(async (ctx: any) => {
      return await ctx.db.insert("users", {
        name: "Intruder",
        email: "intruder@example.com",
        tokenIdentifier: "user_intruder_token_id",
        subject: "user_intruder_id",
      } as any);
    });

    const notifId = await t.run(async (ctx: any) => {
      return await ctx.db.insert("notifications", {
        recipientUserId: ownerId,
        isRead: false,
        type: "volunteer_assigned",
        title: "Test Notification",
        body: "Test body",
      } as any);
    });

    const tAuth = t.withIdentity({ 
      subject: "user_intruder_id", 
      tokenIdentifier: "user_intruder_token_id", 
      name: "Intruder", 
      email: "intruder@example.com" 
    });
    const action = tAuth.mutation(api.notifications.markRead, { notificationId: notifId });

    await expect(action).rejects.toThrow("Not found");
  });

  test("throws error if notification does not exist", async () => {
    const t = makeTest();
    
    const fakeNotificationId = await t.run(async (ctx: any) => {
      const user = await ctx.db.insert("users", {
        name: "User",
        email: "user@example.com",
        tokenIdentifier: "user_token_id",
        subject: "user_id",
      } as any);
      
      const id = await ctx.db.insert("notifications", {
        recipientUserId: user,
        isRead: false,
        type: "volunteer_assigned",
        title: "Temp",
        body: "Temp",
      });
      await ctx.db.delete(id);
      return id;
    });

    const tAuth = t.withIdentity({ subject: "user_id", tokenIdentifier: "user_token_id" });
    const action = tAuth.mutation(api.notifications.markRead, { notificationId: fakeNotificationId });

    await expect(action).rejects.toThrow("Not found");
  });
});