import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Avoid cookie / auth host mismatch: use one origin in the browser, SITE_URL, and NEXT_PUBLIC_SITE_URL.
	async redirects() {
		return [
			{
				source: "/:path*",
				has: [{ type: "host", value: "127.0.0.1:3000" }],
				destination: "http://localhost:3000/:path*",
				permanent: false,
			},
		];
	},
};

export default nextConfig;
