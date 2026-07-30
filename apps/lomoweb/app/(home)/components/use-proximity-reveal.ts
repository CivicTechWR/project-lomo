"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Returns a 0–1 progress value based on cursor proximity (desktop)
 * or viewport intersection (mobile).
 *
 * - Desktop: 0 = cursor beyond `radius` px from element center, 1 = cursor at center.
 * - Mobile: snaps to 1 when element enters viewport (one-shot).
 * - Respects `prefers-reduced-motion`: immediately returns 1 (no animation).
 */
export function useProximityReveal(radius = 300) {
	const ref = useRef<HTMLDivElement>(null);
	const [progress, setProgress] = useState(0);
	const rafId = useRef<number>(0);
	const isTouchDevice = useRef(false);

	// Detect reduced motion preference
	const prefersReducedMotion = useRef(false);

	useEffect(() => {
		prefersReducedMotion.current = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (prefersReducedMotion.current) {
			setProgress(1);
			return;
		}

		// Detect touch device (no hover capability)
		isTouchDevice.current = window.matchMedia("(hover: none)").matches;
	}, []);

	// Desktop: mousemove proximity
	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (isTouchDevice.current || prefersReducedMotion.current)
				return;
			if (!ref.current)
				return;

			// Cancel any pending rAF to avoid stacking
			if (rafId.current)
				cancelAnimationFrame(rafId.current);

			rafId.current = requestAnimationFrame(() => {
				const el = ref.current;
				if (!el)
					return;

				const rect = el.getBoundingClientRect();
				const centerX = rect.left + rect.width / 2;
				const centerY = rect.top + rect.height / 2;

				const dx = e.clientX - centerX;
				const dy = e.clientY - centerY;
				const distance = Math.sqrt(dx * dx + dy * dy);

				// Clamp progress: 0 at ≥radius, 1 at center
				const p = Math.max(0, Math.min(1, 1 - distance / radius));
				setProgress(p);
			});
		},
		[radius],
	);

	// Desktop: attach mousemove to window
	useEffect(() => {
		if (prefersReducedMotion.current || isTouchDevice.current)
			return;

		window.addEventListener("mousemove", handleMouseMove, { passive: true });
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			if (rafId.current)
				cancelAnimationFrame(rafId.current);
		};
	}, [handleMouseMove]);

	// Mobile: IntersectionObserver one-shot
	useEffect(() => {
		if (prefersReducedMotion.current)
			return;
		if (!isTouchDevice.current)
			return;

		const el = ref.current;
		if (!el)
			return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					setProgress(1);
					observer.disconnect();
				}
			},
			{ threshold: 0.3 },
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return { ref, progress };
}
