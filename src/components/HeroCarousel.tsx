"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface CarouselItem {
  id: number;
  profile_photo: string;
}

export default function HeroCarousel() {
  // ✅ Static data instead of API
  const items: CarouselItem[] = [
    {
      id: 1,
      profile_photo: "/banner.png",
    },
    {
      id: 2,
      profile_photo: "/banner.png",
    },
    {
      id: 3,
      profile_photo: "/banner.png",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <div className="relative h-[45vh] overflow-hidden">
      {items.map((item, idx) => (
        <div
          key={item.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
            idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={item.profile_photo}
            alt={item.profile_photo}
            fill
            priority={idx === 0} // first image loads fast (LCP fix)
            sizes="100vw"
            className="object-cover brightness-75"
          />
          
        </div>
      ))}

      {/* Indicators */}
      {/* <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2">
        {items.map((_, idx) => (
          <span
            key={idx}
            className={`w-3 h-3 rounded-full ${
              idx === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
          ></span>
        ))}
      </div> */}
    </div>
  );
}