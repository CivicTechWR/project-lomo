import Image from "next/image";

import { cardSurface } from "./styles";

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
				className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-500"
			/>
			{/* Warm overlay */}
			<div className="absolute inset-0 bg-terracotta-9/5 mix-blend-multiply pointer-events-none" />
		</div>
	);
}
