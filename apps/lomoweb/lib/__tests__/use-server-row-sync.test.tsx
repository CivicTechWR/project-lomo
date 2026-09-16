import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useServerRowSync } from "../use-server-row-sync";

/**
 * Guards the profile-form sync bug.
 *
 * The previous implementation was `useRef(row)` inline in the component. That
 * only syncs when the component mounts *before* the query resolves. Mounting with
 * an already-loaded row — what happens on client-side navigation, because the
 * `/app` layout subscribes to `getMyProfileRow` first — left the ref equal to the
 * row, so the form never loaded stored values and showed
 * "I can offer support" as off regardless of what was saved.
 */
describe("useServerRowSync", () => {
	it("syncs on the first render when the row is already available (regression)", () => {
		const row = { canHelpNow: true };

		const { result } = renderHook(() => useServerRowSync(row));

		expect(result.current).toBe(true);
	});

	it("does not sync while the query is still loading", () => {
		const { result } = renderHook(() => useServerRowSync(undefined));

		expect(result.current).toBe(false);
	});

	it("does not sync when the query resolves to no row", () => {
		const { result } = renderHook(() => useServerRowSync(null));

		expect(result.current).toBe(false);
	});

	it("syncs on the render where a row first arrives after loading", () => {
		const row = { canHelpNow: true };
		const { result, rerender } = renderHook(
			({ value }: { value: typeof row | undefined }) => useServerRowSync(value),
			{ initialProps: { value: undefined as typeof row | undefined } },
		);

		expect(result.current).toBe(false);

		rerender({ value: row });
		expect(result.current).toBe(true);
	});

	it("syncs only once for the same row, so unsaved edits are not clobbered", () => {
		const row = { canHelpNow: true };
		const { result, rerender } = renderHook(
			({ value }: { value: typeof row }) => useServerRowSync(value),
			{ initialProps: { value: row } },
		);

		expect(result.current).toBe(true);

		// Same identity: the user may be mid-edit, so the form must be left alone.
		rerender({ value: row });
		expect(result.current).toBe(false);

		rerender({ value: row });
		expect(result.current).toBe(false);
	});

	it("syncs again when the document actually changes", () => {
		const first = { canHelpNow: true };
		const second = { canHelpNow: false };
		const { result, rerender } = renderHook(
			({ value }: { value: typeof first }) => useServerRowSync(value),
			{ initialProps: { value: first } },
		);

		expect(result.current).toBe(true);

		rerender({ value: second });
		expect(result.current).toBe(true);

		rerender({ value: second });
		expect(result.current).toBe(false);
	});

	it("resumes syncing after the row briefly goes away", () => {
		const row = { canHelpNow: true };
		const { result, rerender } = renderHook(
			({ value }: { value: typeof row | undefined }) => useServerRowSync(value),
			{ initialProps: { value: row as typeof row | undefined } },
		);

		expect(result.current).toBe(true);

		rerender({ value: undefined });
		expect(result.current).toBe(false);

		// Same identity as before the gap — already synced, so no re-sync.
		rerender({ value: row });
		expect(result.current).toBe(false);
	});
});
