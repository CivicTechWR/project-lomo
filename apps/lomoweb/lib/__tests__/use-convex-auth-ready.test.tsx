import { act, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const authState = { isLoading: false, isAuthenticated: false };

vi.mock("convex/react", () => ({
	useConvexAuth: () => authState,
}));

// Imported after the mock so the hook picks up the stubbed `useConvexAuth`.
const { useConvexAuthReady } = await import("../use-convex-auth-ready");

/**
 * Renders the hook and exposes the latest `waitForConvexAuth` via a ref so the
 * test can call it outside React and still see re-rendered auth state.
 */
function renderWaiter() {
	const ref: { current: null | ((timeoutMs?: number) => Promise<boolean>) }
		= { current: null };

	function Probe() {
		const waitForConvexAuth = useConvexAuthReady();
		// Stable across renders (useCallback with no deps), so capturing it during
		// render is safe here.
		ref.current = waitForConvexAuth;
		return null;
	}

	const utils = render(<Probe />);
	return { ref, rerender: () => utils.rerender(<Probe />) };
}

function setAuthenticated(value: boolean) {
	authState.isAuthenticated = value;
}

describe("useConvexAuthReady", () => {
	it("resolves immediately when Convex already reports authenticated", async () => {
		setAuthenticated(true);
		const { ref } = renderWaiter();

		await expect(ref.current!()).resolves.toBe(true);
	});

	it("resolves once auth flips to true after the call started", async () => {
		setAuthenticated(false);
		const { ref, rerender } = renderWaiter();

		let settled: boolean | undefined;
		const pending = ref.current!(2000).then((v) => {
			settled = v;
			return v;
		});

		// Still waiting: this is the window where the old code threw
		// `Unauthenticated`.
		await act(async () => {
			await new Promise(r => setTimeout(r, 120));
		});
		expect(settled).toBeUndefined();

		// Provider finishes fetching the JWT and Convex confirms auth.
		setAuthenticated(true);
		await act(async () => {
			rerender();
		});

		await expect(pending).resolves.toBe(true);
	});

	it("gives up and returns false when auth never arrives", async () => {
		setAuthenticated(false);
		const { ref } = renderWaiter();

		await expect(ref.current!(150)).resolves.toBe(false);
	});
});
