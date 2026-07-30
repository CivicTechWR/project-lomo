import Image from "next/image";

import { cardSurface, grayscaleImage, warmOverlay } from "./styles";

export interface CategoryImageCardProps {
	src: string;
	alt: string;
	sizes: string;
}

export function CategoryImageCard({ src, alt, sizes }: CategoryImageCardProps) {
	return (
		<div
			className={`relative w-full h-full ${cardSurface} overflow-hidden bg-white`}
		>
			<Image
				src={src}
				alt={alt}
				fill
				sizes={sizes}
				className={grayscaleImage}
			/>
			{/* Warm overlay */}
			<div className={warmOverlay} />
		</div>
	);
}
