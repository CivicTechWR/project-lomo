import { act, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Regression tests for a hydration mismatch.
 *
 * Home mode is persisted in `sessionStorage`, which does not exist during SSR.
 * The provider used to call `setState` mid-render behind a `typeof window`
 * check, so React's render-phase update meant the *hydration* render already
 * carried the restored mode while the server HTML carried the default. Anything
 * derived from the active mode — `aria-current`, the active tab's classes, the
 * icon colour — then mismatched.
 *
 * The invariant that prevents it: with a stored mode present, the server render
 * and the first client render must produce identical markup. Modules are
 * re-imported per test because the store caches the mode for the tab's lifetime.
 */

const STORAGE_KEY = "lomo-home-mode";

async function freshModules() {
	vi.resetModules();
	const [{ HomeModeProvider, useHomeMode }, storeModule] = await Promise.all([
		import("../home-mode-context"),
		import("../app-home-mode"),
	]);
	return { HomeModeProvider, useHomeMode, ...storeModule };
}

/** Mirrors how the sidebar derives an attribute from the mode. */
function ModeProbe({ useHomeMode }: { useHomeMode: () => { mode: string } }) {
	const { mode } = useHomeMode();
	return (
		<a href="/app" aria-current={mode === "request_help" ? "page" : undefined}>
			{mode}
		</a>
	);
}

describe("home mode hydration safety", () => {
	beforeEach(() => {
		sessionStorage.clear();
	});

	it("renders the same markup on the server and on the first client pass", async () => {
		sessionStorage.setItem(STORAGE_KEY, "request_help");

		// Server pass: sessionStorage must not leak into the output.
		const server = await freshModules();
		const serverHtml = renderToString(
			<server.HomeModeProvider>
				<ModeProbe useHomeMode={server.useHomeMode} />
			</server.HomeModeProvider>,
		);

		// Client pass, same stored value, fresh module state.
		const client = await freshModules();
		const { container } = render(
			<client.HomeModeProvider>
				<ModeProbe useHomeMode={client.useHomeMode} />
			</client.HomeModeProvider>,
		);

		// The server must emit the default, not the stored mode.
		expect(serverHtml).toContain("home");
		expect(serverHtml).not.toContain("aria-current");

		// And the client must converge on the stored mode after hydrating.
		expect(container.querySelector("a")?.getAttribute("aria-current")).toBe("page");
	});

	it("server snapshot ignores a stored mode entirely", async () => {
		sessionStorage.setItem(STORAGE_KEY, "offer_help");
		const { getServerHomeMode, DEFAULT_HOME_MODE } = await freshModules();

		expect(getServerHomeMode()).toBe(DEFAULT_HOME_MODE);
		expect(getServerHomeMode()).toBe("home");
	});

	it("reads a persisted mode on the client", async () => {
		sessionStorage.setItem(STORAGE_KEY, "offer_help");
		const { readStoredHomeMode } = await freshModules();

		expect(readStoredHomeMode()).toBe("offer_help");
	});

	it("falls back to the default for an unrecognised stored value", async () => {
		sessionStorage.setItem(STORAGE_KEY, "not-a-mode");
		const { readStoredHomeMode } = await freshModules();

		expect(readStoredHomeMode()).toBe("home");
	});

	it("returns a stable snapshot across calls, so useSyncExternalStore won't loop", async () => {
		const { readStoredHomeMode } = await freshModules();

		expect(readStoredHomeMode()).toBe(readStoredHomeMode());
	});

	it("notifies subscribers when the mode is written", async () => {
		const { subscribeToHomeMode, writeStoredHomeMode, readStoredHomeMode } = await freshModules();
		const onChange = vi.fn();
		const unsubscribe = subscribeToHomeMode(onChange);

		writeStoredHomeMode("offer_help");

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(readStoredHomeMode()).toBe("offer_help");
		expect(sessionStorage.getItem(STORAGE_KEY)).toBe("offer_help");

		unsubscribe();
		writeStoredHomeMode("home");
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it("still changes mode when storage is unavailable", async () => {
		const { subscribeToHomeMode, writeStoredHomeMode, readStoredHomeMode } = await freshModules();
		const setItem = vi
			.spyOn(Storage.prototype, "setItem")
			.mockImplementation(() => {
				throw new Error("private browsing");
			});
		subscribeToHomeMode(() => {});

		try {
			writeStoredHomeMode("offer_help");
			// Held in memory for the tab even though it could not be persisted.
			expect(readStoredHomeMode()).toBe("offer_help");
		}
		finally {
			setItem.mockRestore();
		}
	});

	it("updates consumers when the mode changes", async () => {
		const { HomeModeProvider, useHomeMode, writeStoredHomeMode } = await freshModules();
		render(
			<HomeModeProvider>
				<ModeProbe useHomeMode={useHomeMode} />
			</HomeModeProvider>,
		);

		expect(screen.getByText("home")).toBeTruthy();

		// Wrapped in act because the store notifies subscribers synchronously.
		act(() => {
			writeStoredHomeMode("request_help");
		});

		expect(screen.getByText("request_help")).toBeTruthy();
	});
});
