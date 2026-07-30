import { ProximityImage } from "./proximity-image";
import { cardSurface, warmOverlay } from "./styles";

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
			<ProximityImage
				src={src}
				alt={alt}
				fill
				sizes={sizes}
			/>
			{/* Warm overlay */}
			<div className={warmOverlay} />
		</div>
	);
}
