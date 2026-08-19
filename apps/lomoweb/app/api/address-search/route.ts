import type { AddressSearchResult } from "@/lib/address-search";
import { NextResponse } from "next/server";

interface NominatimHit {
	place_id: number;
	display_name: string;
	lat: string;
	lon: string;
}

/** Bias toward Kitchener–Waterloo (west, north, east, south). */
const KW_VIEWBOX = "-80.75,43.55,-80.25,43.35";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const q = searchParams.get("q")?.trim() ?? "";

	if (q.length < 3) {
		return NextResponse.json({ results: [] satisfies AddressSearchResult[] });
	}

	const url = new URL("https://nominatim.openstreetmap.org/search");
	url.searchParams.set("format", "json");
	url.searchParams.set("addressdetails", "0");
	url.searchParams.set("limit", "6");
	url.searchParams.set("countrycodes", "ca");
	url.searchParams.set("viewbox", KW_VIEWBOX);
	url.searchParams.set("bounded", "0");
	url.searchParams.set("q", q);

	try {
		const response = await fetch(url.toString(), {
			headers: {
				"Accept": "application/json",
				"User-Agent": "LoMo/1.0 (community help platform)",
			},
			cache: "no-store",
		});

		if (!response.ok) {
			return NextResponse.json(
				{ error: "Address search failed", results: [] },
				{ status: 502 },
			);
		}

		const hits = (await response.json()) as NominatimHit[];
		const results: AddressSearchResult[] = hits.map(hit => ({
			id: String(hit.place_id),
			label: hit.display_name,
			lat: Number.parseFloat(hit.lat),
			lng: Number.parseFloat(hit.lon),
		}));

		return NextResponse.json({ results });
	}
	catch {
		return NextResponse.json(
			{ error: "Address search failed", results: [] },
			{ status: 502 },
		);
	}
}
