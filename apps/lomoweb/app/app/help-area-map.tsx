"use client";

import type L from "leaflet";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

/**
 * Leaflet paints the radius circle through JS options rather than CSS, so it
 * can't take a Tailwind class. Resolving the token at runtime keeps the circle
 * in step with the centre dot's `bg-sage-9` instead of pinning a second copy of
 * the value here. The literal is only a pre-stylesheet fallback.
 */
const SAGE_9_FALLBACK = "#4f9162";

function resolveSage9(): string {
	if (typeof window === "undefined") {
		return SAGE_9_FALLBACK;
	}
	const resolved = getComputedStyle(document.documentElement)
		.getPropertyValue("--sage-9")
		.trim();
	return resolved || SAGE_9_FALLBACK;
}

interface HelpAreaMapProps {
	centerLat: number;
	centerLng: number;
	radiusKm: number;
	onCenterChange: (centerLat: number, centerLng: number) => void;
}

export function HelpAreaMap({
	centerLat,
	centerLng,
	radiusKm,
	onCenterChange,
}: HelpAreaMapProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<L.Map | null>(null);
	const circleRef = useRef<L.Circle | null>(null);
	const onCenterChangeRef = useRef(onCenterChange);

	useEffect(() => {
		onCenterChangeRef.current = onCenterChange;
	}, [onCenterChange]);

	useEffect(() => {
		let cancelled = false;

		async function initMap() {
			if (!containerRef.current || mapRef.current) {
				return;
			}

			const leaflet = await import("leaflet");
			if (cancelled || !containerRef.current) {
				return;
			}

			const map = leaflet.map(containerRef.current, {
				center: [centerLat, centerLng],
				zoom: 11,
				zoomControl: true,
			});

			leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution:
					"&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
				maxZoom: 19,
			}).addTo(map);

			const accent = resolveSage9();

			circleRef.current = leaflet.circle([centerLat, centerLng], {
				radius: radiusKm * 1000,
				color: accent,
				fillColor: accent,
				fillOpacity: 0.15,
				weight: 2,
			}).addTo(map);

			map.on("moveend", () => {
				const center = map.getCenter();
				onCenterChangeRef.current(center.lat, center.lng);
			});

			mapRef.current = map;
		}

		void initMap();

		return () => {
			cancelled = true;
			mapRef.current?.remove();
			mapRef.current = null;
			circleRef.current = null;
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps -- map is created once on mount
	}, []);

	useEffect(() => {
		const map = mapRef.current;
		if (!map) {
			return;
		}
		const current = map.getCenter();
		const delta
			= Math.abs(current.lat - centerLat) + Math.abs(current.lng - centerLng);
		if (delta > 0.0001) {
			map.setView([centerLat, centerLng], map.getZoom(), { animate: false });
		}
	}, [centerLat, centerLng]);

	useEffect(() => {
		const circle = circleRef.current;
		if (!circle) {
			return;
		}
		circle.setLatLng([centerLat, centerLng]);
		circle.setRadius(radiusKm * 1000);
	}, [centerLat, centerLng, radiusKm]);

	return (
		<div className="relative h-64 w-full overflow-hidden rounded-3 border border-gray-6 lg:h-80">
			<div
				ref={containerRef}
				aria-label={`Map of your help area, centred on ${centerLat.toFixed(3)}, ${centerLng.toFixed(3)} with a ${radiusKm} kilometre radius. Drag the map to move the centre.`}
				className="absolute inset-0 z-0"
			/>
			{/*
			  The centre marker is decorative — the radius it represents is already
			  described on the container above and restated in the live region below.
			*/}
			<div
				className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
				aria-hidden
			>
				<div className="size-3 rounded-full border-2 border-white bg-sage-9 shadow-md" />
			</div>
			{/*
			  Dragging the map is a pointer-only interaction, so announce the resulting
			  centre for assistive tech instead of leaving the change silent.
			*/}
			<p aria-live="polite" className="sr-only">
				{`Help area centred on ${centerLat.toFixed(3)}, ${centerLng.toFixed(3)}, ${radiusKm} kilometre radius.`}
			</p>
		</div>
	);
}
