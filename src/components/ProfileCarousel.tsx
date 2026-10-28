"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ProfileItem {
  name: string;
  image: string;
  location: string;
  religion?: string;
  caste?: string;
  message: string;
}

interface CarouselProps {
  items: ProfileItem[];
}

export default function ProfileCarousel({ items }: CarouselProps) {
  const router = useRouter();
  const [index, setIndex] = useState(0);

  const cardsPerSlide = 3;
  const cardWidth = 300;
  const margin = 24;
  const fullCardWidth = cardWidth + margin;

  const totalSlides = Math.ceil(items.length / cardsPerSlide);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % totalSlides);
    }, 3000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const getTranslateX = () => -(index * cardsPerSlide * fullCardWidth);

  function goTo(slide: number) {
    setIndex(slide);
  }

  function openProfile(name: string) {
    router.push(`/profile/${encodeURIComponent(name)}`);
  }

  return (
    <section className="relative z-20 -mt-13 bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl p-8 px-6 md:px-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-6">
          Most Valuable Profiles
        </h2>

        <div className="overflow-hidden relative">
          <div
            className="flex transition-transform duration-700"
            style={{
              width: `${items.length * fullCardWidth}px`,
              transform: `translateX(${getTranslateX()}px)`,
            }}
          >
            {items.map((t, i) => (
              <div
                key={i}
                className="w-[300px] shrink-0 bg-[#5a0000] text-white rounded-xl shadow-xl p-6 mx-3 flex items-center justify-center cursor-pointer"
                onClick={() => openProfile(t.name)}
              >
                <div className="text-center">
                  <Image
                    src={t.image}
                    alt={t.name}
                    width={128}
                    height={128}
                    className="mx-auto rounded-full object-cover mb-4 border-4 border-white"
                  />
                  <h3 className="text-lg font-semibold text-green-400">{t.name}</h3>
                  <p className="text-sm text-yellow-200">{t.location}</p>
                  <p className="text-yellow-400 mt-2">★★★★★</p>
                  <p>
                    <span className="font-semibold">Religion:</span> {t.religion}
                  </p>
                  <p>
                    <span className="font-semibold">Caste:</span> {t.caste}
                  </p>
                  <p className="text-yellow-100 text-sm mt-4 italic">&quot;{t.message}&quot;</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-4 gap-2">
          {[...Array(totalSlides)].map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === index ? "bg-red-600 scale-125" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <div className="flex justify-end">
          <a
            href="/testimonials"
            className="inline-block text-red-400 font-semibold hover:text-white hover:bg-red-400 rounded px-1"
          >
            View All Profiles
          </a>
        </div>
      </div>
    </section>
  );
}