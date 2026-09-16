import { Button } from "@repo/ui/button";
import { RouteState } from "../route-state";

export default function AppNotFound() {
	return (
		<RouteState
			title="We couldn't find that"
			description="The request may have been closed or cancelled, or the link may be out of date."
			action={(
				<Button href="/app" variant="solid" color="terracotta" size={2}>
					Back to your requests
				</Button>
			)}
		/>
	);
}
