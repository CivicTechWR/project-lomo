"use client";

import type { ErrorInfo, ReactNode } from "react";
import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { Component } from "react";

type ErrorLevel = "page" | "section" | "panel";

interface AdminErrorBoundaryProps {
	children: ReactNode;
	/** Controls the visual treatment of the fallback UI */
	level?: ErrorLevel;
	/** Optional fallback to override the default error UI */
	fallback?: ReactNode;
}

interface AdminErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

/**
 * Reusable error boundary for the admin interface.
 *
 * Supports three levels:
 * - "page": Full-page error with reload button (for layout-level crashes)
 * - "section": Inline card with retry button (for view-level errors)
 * - "panel": Compact fallback for detail panels (avoids crashing the list)
 */
export class AdminErrorBoundary extends Component<
	AdminErrorBoundaryProps,
	AdminErrorBoundaryState
> {
	constructor(props: AdminErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): AdminErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		// Log to console in development; in production this could go to a service
		console.error("[AdminErrorBoundary]", error, errorInfo);
	}

	private handleReset = () => {
		this.setState({ hasError: false, error: null });
	};

	private handleReload = () => {
		window.location.reload();
	};

	render() {
		if (!this.state.hasError) {
			return this.props.children;
		}

		if (this.props.fallback) {
			return this.props.fallback;
		}

		const level = this.props.level ?? "section";

		if (level === "page") {
			return <PageErrorFallback onReload={this.handleReload} />;
		}

		if (level === "panel") {
			return <PanelErrorFallback onRetry={this.handleReset} />;
		}

		// Default: section level
		return (
			<SectionErrorFallback
				error={this.state.error}
				onRetry={this.handleReset}
			/>
		);
	}
}

function PageErrorFallback({ onReload }: { onReload: () => void }) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-surface-warm">
			<div className="mx-4 flex max-w-md flex-col items-center gap-4 rounded-4 border-2 border-terracotta-6 bg-white p-8 text-center shadow-sm">
				<Heading level={1} className="text-terracotta-9">
					Something went wrong
				</Heading>
				<Text className="text-terracotta-9">
					An unexpected error occurred in the admin interface. Please reload
					the page to try again.
				</Text>
				<Button variant="solid" onPress={onReload}>
					Reload Page
				</Button>
			</div>
		</div>
	);
}

function SectionErrorFallback({
	error,
	onRetry,
}: {
	error: Error | null;
	onRetry: () => void;
}) {
	return (
		<div className="mx-auto flex w-full max-w-lg flex-col items-center gap-3 rounded-4 border-2 border-terracotta-6 bg-white p-6 text-center shadow-sm">
			<Heading level={2} size={6} className="text-terracotta-9">
				Something went wrong
			</Heading>
			{error?.message && (
				<Text className="text-sm text-terracotta-8">
					{error.message}
				</Text>
			)}
			<Button variant="solid" size={2} onPress={onRetry}>
				Try Again
			</Button>
		</div>
	);
}

function PanelErrorFallback({ onRetry }: { onRetry: () => void }) {
	return (
		<div className="flex flex-col items-center gap-2 rounded-4 border-2 border-terracotta-6 bg-white p-4 text-center shadow-sm">
			<Text className="text-sm text-terracotta-9">
				Failed to load this panel.
			</Text>
			<Button variant="solid" size={1} onPress={onRetry}>
				Try Again
			</Button>
		</div>
	);
}
