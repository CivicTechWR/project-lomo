"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@repo/ui/button";
import { Text } from "@repo/ui/text";

const MOODS = [
	{ id: "energetic", label: "Energetic", icon: "/images/cherry.svg" },
	{ id: "rest", label: "Rest", icon: "/images/pine-bottom.svg" },
] as const;

type MoodId = (typeof MOODS)[number]["id"];

export function MoodSelector() {
	const [selected, setSelected] = useState<MoodId | null>(null);

	return (
		<div className="flex flex-col gap-3">
			<Text size={3} weight="medium" color="gray" highContrast>
				How are you feeling today?
			</Text>
			<div className="grid grid-cols-2 gap-2 sm:gap-3">
				{MOODS.map((mood) => {
					const isActive = selected === mood.id;
					return (
						<Button
							key={mood.id}
							variant={isActive ? "soft" : "outline"}
							color={isActive ? "terracotta" : "gray"}
							size={3}
							onPress={() => setSelected(mood.id)}
							className="flex flex-col items-center gap-2 h-auto py-3 sm:py-4"
						>
							<Image
								src={mood.icon}
								alt=""
								width={40}
								height={40}
								className="sm:w-[48px] sm:h-[48px]"
							/>
							<Text
								size={1}
								weight={isActive ? "bold" : "medium"}
								color={isActive ? "terracotta" : "gray"}
								highContrast={isActive}
							>
								{mood.label}
							</Text>
						</Button>
					);
				})}
			</div>
		</div>
	);
}
