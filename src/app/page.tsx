"use client";
import HeroCarousel from "@/components/HeroCarousel";
import HomeCategories from "@/components/HomeCategories";
import Link from "next/link";

const distanceCards = [
  {
    src: "/jodi2.jpg",
    tags: [
      { cls: "top-2 right-0", label: "Online Event", icon: "ri-bookmark-2-fill" },
      { cls: "top-14 left-0", label: "Connect Easily", icon: "ri-chat-1-fill" },
    ],
  },
  {
    src: "/wedcall2.jpg",
    tags: [
      { cls: "top-2 right-0", label: "Complete Privacy", icon: "ri-lock-2-fill" },
      { cls: "top-14 left-0", label: "HD Quality Calls", icon: "" },
    ],
  },
  {
    src: "/wedspec.jpg",
    tags: [
      { cls: "top-2 right-0", label: "Present Yourself", icon: "ri-camera-fill" },
      { cls: "top-14 left-0", label: "", icon: "ri-music-fill" },
    ],
  },
];

const distanceBlocks = [
  {
    title: "EliteWeds Match Hour",
    desc: "Join online community events designed to help you connect with matches quickly and from the comfort of your home.",
  },
  {
    title: "Voice & Video Calling",
    desc: "Enjoy private conversations using secure voice and video calling without revealing your phone number.",
  },
  {
    title: "Introducing Video Profiles",
    desc: "Make your profile stand out by adding a short video. Let your personality speak louder and get noticed faster.",
  },
];

export default function Home() {
  return (
    <main className="font-['Lato',sans-serif] text-[#2c1810] overflow-x-hidden">

      {/* ══ HERO ══ */}
      <div className="relative w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <HeroCarousel />
        </div>

        {/* Floating hearts */}
        <div className="absolute right-20 top-1/2 -translate-y-1/2 z-[2] opacity-10 pointer-events-none" aria-hidden>
          <span className="text-white absolute text-[120px] -top-24 right-0 animate-[float_4s_ease-in-out_infinite]">♡</span>
          <span className="text-white absolute text-[60px] top-0 right-20 animate-[float_5s_ease-in-out_1s_infinite]">♡</span>
          <span className="text-white absolute text-[90px] top-20 -right-5 animate-[float_6s_ease-in-out_0.5s_infinite]">♡</span>
          <span className="text-white absolute text-[50px] top-[150px] right-[60px] animate-[float_4.5s_ease-in-out_1.5s_infinite]">♡</span>
        </div>

        <section className="relative z-[3] w-full px-6 pb-[130px]">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-12 flex-wrap">
            {/* Left */}
            <div className="flex-1 text-white mt-20">
              <div className="inline-block bg-white/[0.12] backdrop-blur-lg border border-white/[0.28] text-[#ffd9c8] text-[11px] font-bold tracking-[1.2px] uppercase rounded-full mb-7">
                India&apos;s Most Trusted Matrimonial Platform ✦
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ══ HOME CATEGORIES ══ */}
      <HomeCategories />

      {/* ══ IMPRESS OVER DISTANCE ══ */}
      <section className="bg-[#fffdf9]">
        <div className="max-w-[1200px] mx-auto px-6 py-20 flex gap-[60px] flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <p className="text-[11px] font-bold tracking-[2.5px] uppercase text-[#c0392b] mb-[10px]">Meet From Home</p>
            <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(26px,4vw,40px)] font-bold text-[#2c1810] mb-4 leading-[1.2]">
              Impress them Over the <span className="text-[#c0392b] italic">Distance</span>
            </h2>
            <div className="w-12 h-[2px] bg-[#c0392b] my-3 mb-7" />
            {distanceBlocks.map((b) => (
              <div key={b.title} className="mb-8">
                <h3 className="font-['Playfair_Display',serif] text-[19px] font-bold text-[#2c1810]">{b.title}</h3>
                <div className="w-8 h-[2px] bg-[#c0392b] my-[6px] mb-[14px]" />
                <p className="text-[14px] text-[#7a5a50] leading-[1.75]">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="w-[280px] flex-shrink-0 max-h-[580px] overflow-y-auto flex flex-col gap-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {distanceCards.map((c, i) => (
              <div key={i} className="bg-white border border-[#f0d9c8] rounded-2xl p-4">
                <div className="relative flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.src} alt="" className="w-[190px] rounded-xl border border-[#f0d9c8]" />
                  {c.tags.map((t, j) => (
                    <span
                      key={j}
                      className={`absolute ${t.cls} bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)] px-3 py-1 rounded-full text-[11px] font-semibold text-[#2c1810] whitespace-nowrap`}
                    >
                      {t.icon && <i className={`${t.icon} text-[#c0392b] mr-1`} />}
                      {t.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="bg-gradient-to-br from-[#c0392b] to-[#e74c3c] py-20 px-6">
        <div className="max-w-[680px] mx-auto text-center">
          <div className="text-[22px] text-white/35 tracking-[12px] mb-6">♡ ♡ ♡</div>
          <h2 className="font-['Playfair_Display',serif] text-[clamp(26px,4vw,40px)] text-white font-bold mb-4 leading-[1.25]">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-white/80 text-[16px] mb-9 leading-[1.6]">
            Join today and browse lakhs of verified profiles — absolutely free!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/register"
              className="bg-white text-[#c0392b] px-9 py-[14px] rounded-full font-bold text-[15px] no-underline shadow-[0_6px_24px_rgba(0,0,0,0.2)] transition-all hover:-translate-y-[3px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
            >
              Register for Free
            </Link>
            <Link
              href="/login"
              className="border-2 border-white/45 text-white px-9 py-[14px] rounded-full font-semibold text-[15px] no-underline transition-all hover:bg-white/15 hover:border-white"
            >
              I Already Have an Account
            </Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,500&family=Lato:wght@300;400;500;700&display=swap');
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </main>
  );
}