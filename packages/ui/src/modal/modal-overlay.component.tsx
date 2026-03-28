import type { ModalOverlayProps as AriaModalOverlayProps } from "react-aria-components";
import { ModalOverlay as AriaModalOverlay, composeRenderProps } from "react-aria-components";
import { modalOverlayVariants } from "./modal-overlay.variants.ts";

export type ModalOverlayProps = AriaModalOverlayProps;

export function ModalOverlay({ className, ...props }: ModalOverlayProps) {
	return (
		<AriaModalOverlay
			{...props}
			className={composeRenderProps(className, cls =>
				modalOverlayVariants({ class: cls }))}
		/>
	);
}
