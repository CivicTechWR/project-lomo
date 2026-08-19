"use client";

import type L from "leaflet";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

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

			circleRef.current = leaflet.circle([centerLat, centerLng], {
				radius: radiusKm * 1000,
				color: "#4f9162",
				fillColor: "#4f9162",
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
		<div className="relative h-64 w-full overflow-hidden rounded-[max(var(--radius-3),12px)] border border-gray-6 lg:h-80">
			<div ref={containerRef} className="absolute inset-0 z-0" />
			<div
				className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
				aria-hidden
			>
				<div className="size-3 rounded-full border-2 border-white bg-sage-9 shadow-md" />
			</div>
		</div>
	);
}
