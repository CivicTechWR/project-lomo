"use client";

/**
 * Last-resort boundary for failures in the root layout itself.
 *
 * This replaces the whole document when it renders, so it must supply its own
 * `<html>` and `<body>` — the root layout is exactly what failed. For the same
 * reason it deliberately avoids importing design-system components or global CSS:
 * whatever broke may be upstream of them, and a boundary that can itself throw is
 * worse than none. Hence the inline styles.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<html lang="en">
			<body
				style={{
					margin: 0,
					minHeight: "100vh",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					gap: "0.75rem",
					padding: "3rem 1.5rem",
					textAlign: "center",
					background: "#f5efe8",
					color: "#1c1917",
					fontFamily: "system-ui, sans-serif",
				}}
			>
				<h1 style={{ margin: 0, fontSize: "1.5rem" }}>LoMo couldn&apos;t load</h1>
				<p style={{ margin: 0, maxWidth: "38ch", lineHeight: 1.5 }}>
					Something failed while starting the app. Reloading usually fixes it.
				</p>
				<button
					type="button"
					onClick={reset}
					style={{
						marginTop: "0.5rem",
						minHeight: "2.75rem",
						padding: "0 1.5rem",
						borderRadius: "9999px",
						border: "2px solid #000",
						background: "#a3502f",
						color: "#fff",
						font: "inherit",
						cursor: "pointer",
					}}
				>
					Reload
				</button>
			</body>
		</html>
	);
}
