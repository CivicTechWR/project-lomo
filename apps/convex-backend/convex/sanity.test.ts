import { convexTest } from "convex-test";
import { test, expect } from "vitest";
import schema from "./schema";
import { api } from "./_generated/api";

const modules = import.meta.glob("./**/*.ts");

test("environment initializes successfully", async () => {
  const t = convexTest(schema, modules);
  expect(t).toBeDefined();
});