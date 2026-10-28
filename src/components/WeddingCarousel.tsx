"use client";

import { useState, useEffect } from "react";

interface WeddingItem {
  src: string;
  title: string;
  desc: string;
}

interface WeddingCarouselProps {
  items: WeddingItem[];
  cardsPerSlide?: number;
  cardWidth?: number;
  gap?: number;
  autoPlayInterval?: number;
}

export default function WeddingCarousel({
  items,
  cardsPerSlide = 3,
  cardWidth = 300,
  gap = 16,
  autoPlayInterval = 3000,
}: WeddingCarouselProps) {

  const [currentIndex, setCurrentIndex] = useState(0);

  // Total slides based on cardsPerSlide
  const totalSlides = Math.ceil(items.length / cardsPerSlide);

  // Reliable width of a full slide
  const fullSlideWidth = cardsPerSlide * (cardWidth + gap);

  // ⭐ FIXED AUTOPLAY — Now dynamic based on totalSlides
  useEffect(() => {
    if (totalSlides < 2) return; // no autoplay if only 1 slide

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [totalSlides, autoPlayInterval]);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="text-left mb-6">
          <p className="text-sm text-gray-500 uppercase mb-1">
            Lakhs Of Happy Customer
          </p>
          <h2 className="text-3xl font-bold text-gray-900">
            Matched By EliteWeds
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden rounded-xl">

          <div
            className="flex transition-transform duration-500"
            style={{
              transform: `translateX(-${currentIndex * fullSlideWidth}px)`,
              width: `${items.length * (cardWidth + gap)}px`,
            }}
          >
            {items.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 relative rounded-lg overflow-hidden shadow-lg"
                style={{
                  width: `${cardWidth}px`,
                  marginRight: `${gap}px`,
                  height: "16rem",
                }}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white px-4 text-center">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-sm mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Left Arrow */}
          <button
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === 0 ? totalSlides - 1 : prev - 1
              )
            }
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
          >
            <i className="ri-arrow-left-s-line text-xl"></i>
          </button>

          {/* Right Arrow */}
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % totalSlides)
            }
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
          >
            <i className="ri-arrow-right-s-line text-xl"></i>
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentIndex ? "bg-red-600 scale-125" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
