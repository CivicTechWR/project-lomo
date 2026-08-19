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
	const elementRef = useRef<HTMLDivElement>(null);
	const rafIdRef = useRef<number>(0);
	const isTouchDeviceRef = useRef(false);

	// Detect reduced motion preference
	const prefersReducedMotionRef = useRef(false);

	const [progress, setProgress] = useState(() => {
		// Can't access window here (SSR), so start at 0; the effect handles reduced-motion.
		return 0;
	});

	// Initialization effect — detects preferences and sets initial progress.
	// Intentionally sets state here since it's a one-time mount initialization
	// that can't be expressed as lazy initial state (requires window access).
	useEffect(() => {
		prefersReducedMotionRef.current = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (prefersReducedMotionRef.current) {
			setProgress(1); // eslint-disable-line react-hooks-extra/no-direct-set-state-in-use-effect
			return;
		}

		// Detect touch device (no hover capability)
		isTouchDeviceRef.current = window.matchMedia("(hover: none)").matches;
	}, []);

	// Desktop: mousemove proximity
	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (isTouchDeviceRef.current || prefersReducedMotionRef.current)
				return;
			if (!elementRef.current)
				return;

			// Cancel any pending rAF to avoid stacking
			if (rafIdRef.current)
				cancelAnimationFrame(rafIdRef.current);

			rafIdRef.current = requestAnimationFrame(() => {
				const el = elementRef.current;
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
		if (prefersReducedMotionRef.current || isTouchDeviceRef.current)
			return;

		window.addEventListener("mousemove", handleMouseMove, { passive: true });
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			if (rafIdRef.current)
				cancelAnimationFrame(rafIdRef.current);
		};
	}, [handleMouseMove]);

	// Mobile: IntersectionObserver one-shot
	useEffect(() => {
		if (prefersReducedMotionRef.current)
			return;
		if (!isTouchDeviceRef.current)
			return;

		const el = elementRef.current;
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

	return { ref: elementRef, progress };
}
