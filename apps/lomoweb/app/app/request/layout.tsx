import type { ReactNode } from "react";
import { RequestDraftProvider } from "./request-draft-context";
import { RequestFlowShell } from "./request-flow-shell";

export default function RequestLayout({ children }: { children: ReactNode }) {
	return (
		<RequestDraftProvider>
			<RequestFlowShell>{children}</RequestFlowShell>
		</RequestDraftProvider>
	);
}
