import { importMetaGlob } from "convex-test";

// Registers all backend function modules
export const modules = import.meta.glob("./**/*.ts");