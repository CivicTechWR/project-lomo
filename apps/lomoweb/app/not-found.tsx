import { Button } from "@repo/ui/button";
import { RouteState } from "./route-state";

export default function NotFound() {
	return (
		<RouteState
			title="We couldn't find that page"
			description="The link may be out of date, or the request may have been closed."
			action={(
				<Button href="/" variant="solid" color="terracotta" size={2}>
					Back to home
				</Button>
			)}
		/>
	);
}
