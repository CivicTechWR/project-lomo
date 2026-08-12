import Image from "next/image";

export function HeroIllustration() {
	return (
		<div className="relative w-full h-full min-h-60 sm:h-80 md:h-100 lg:h-130">
			<Image
				src="/hero.png"
				alt=""
				fill
				sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
				priority
				className="object-cover select-none pointer-events-none"
				aria-hidden="true"
			/>
		</div>
	);
}
