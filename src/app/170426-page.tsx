"use client";

import HeroCarousel from "@/components/HeroCarousel";
import HomeCategories from "@/components/HomeCategories";
import ProfileCarousel from "@/components/ProfileCarousel";
import WeddingCarousel from "@/components/WeddingCarousel";
import { testimonials } from "@/lib/testimonials";
import Link from "next/link";

const weddingItems = [
  { src: "/wedding4.jpg", title: "Beautiful Weddings", desc: "Celebrate love with our expert services." },
  { src: "/wedding5.jpg", title: "Elite Matches", desc: "Connecting verified profiles for meaningful relationships." },
  { src: "/wedding-phere.jpeg", title: "Traditional Rituals", desc: "Experience weddings with cultural authenticity." },
  { src: "/wedding-rituals.jpg", title: "Traditional Rituals", desc: "Experience weddings with cultural authenticity." },
  { src: "/wedding-rings.webp", title: "Traditional Rituals", desc: "Experience weddings with cultural authenticity." },
  { src: "/wedding3.webp", title: "Traditional Rituals", desc: "Experience weddings with cultural authenticity." },
];

const planFeaturesFree = [
  { text: "Browse profiles", active: true },
  { text: "Shortlist & send interest", active: true },
  { text: "Message unlimited users", active: true },
  { text: "3× more daily matches", active: false },
  { text: "Advanced search filters", active: false },
  { text: "View contact details", active: false },
  { text: "Voice & video calls", active: false },
  { text: "3 free Spotlights", active: false },
];

const planFeaturesPremium = [
  "Browse profiles",
  "Shortlist & send interest",
  "Message unlimited users",
  "3× more daily matches",
  "Advanced search filters",
  "View contact details",
  "Voice & video calls",
  "3 free Spotlights",
];

const steps = [
  { img: "/consultancy-services.svg", num: "01.", title: "Define Your Partner Preferences" },
  { img: "/matchmaking1.svg", num: "02.", title: "Browse Profiles" },
  { img: "/send-interest.svg", num: "03.", title: "Send Interests & Connect" },
];

const exclusiveFeatures = [
  { icon: "ri-team-fill", title: "Meet Your Relationship Manager", desc: "Connect with our highly experienced advisor who manages your profile." },
  { icon: "ri-equalizer-fill", title: "Communicate your preferences", desc: "Consultation to understand your expectations in a prospective partner." },
  { icon: "ri-user-follow-fill", title: "Choose from handpicked profiles", desc: "We shortlist profiles matching your criteria for offline interactions." },
];

const distanceCards = [
  { src: "/jodi2.jpg", tags: [{ cls: "top-2 right-0", label: "Online Event", icon: "ri-bookmark-2-fill" }, { cls: "top-14 left-0", label: "Connect Easily", icon: "ri-chat-1-fill" }] },
  { src: "/wedcall2.jpg", tags: [{ cls: "top-2 right-0", label: "Complete Privacy", icon: "ri-lock-2-fill" }, { cls: "top-14 left-0", label: "HD Quality Calls", icon: "" }] },
  { src: "/wedspec.jpg", tags: [{ cls: "top-2 right-0", label: "Present Yourself", icon: "ri-camera-fill" }, { cls: "top-14 left-0", label: "", icon: "ri-music-fill" }] },
];

const distanceBlocks = [
  { title: "EliteWeds Match Hour", desc: "Join online community events designed to help you connect with matches quickly and from the comfort of your home." },
  { title: "Voice & Video Calling", desc: "Enjoy private conversations using secure voice and video calling without revealing your phone number." },
  { title: "Introducing Video Profiles", desc: "Make your profile stand out by adding a short video. Let your personality speak louder and get noticed faster." },
];

const languages = ["Assamese","Bengali","Bihari","Bodo","Dogri","Gujarati","Hindi","Hindi (Delhi)","Hindi (UP)","Hindi (MP)","Kannada","Kashmiri","Konkani","Maithili","Malayalam","Manipuri","Marathi","Nepali","Oriya","Punjabi","Sanskrit","Santali","Sindhi","Tamil","Telugu","Urdu","Tulu","Rajasthani","Garhwali","Haryanvi","Marwari","Chhattisgarhi","Awadhi","Magahi","Bhili","Kumaoni","Garo","Khasi","Mizo","Nagpuri","Bhojpuri"];

const browseCategories = ["Mother Tongue","Caste","Religion","City","Occupation","State","NRI","College"];

export default function Home() {
  return (
    <main className="font-['Lato',sans-serif] text-[#2c1810] overflow-x-hidden">

      {/* ══ HERO ══ */}
      <div className="relative w-full min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <HeroCarousel />
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/65 via-black/42 to-black/68" />

        {/* Floating hearts */}
        <div className="absolute right-20 top-1/2 -translate-y-1/2 z-[2] opacity-10 pointer-events-none" aria-hidden>
          <span className="text-white absolute text-[120px] -top-24 right-0 animate-[float_4s_ease-in-out_infinite]">♡</span>
          <span className="text-white absolute text-[60px] top-0 right-20 animate-[float_5s_ease-in-out_1s_infinite]">♡</span>
          <span className="text-white absolute text-[90px] top-20 -right-5 animate-[float_6s_ease-in-out_0.5s_infinite]">♡</span>
          <span className="text-white absolute text-[50px] top-[150px] right-[60px] animate-[float_4.5s_ease-in-out_1.5s_infinite]">♡</span>
        </div>

        <section className="relative z-[3] w-full px-6 py-[110px] pb-[130px]">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-12 flex-wrap">
            {/* Left */}
            <div className="flex-1 text-white">
              <div className="inline-block bg-white/[0.12] backdrop-blur-lg border border-white/[0.28] text-[#ffd9c8] text-[11px] font-bold tracking-[1.2px] uppercase px-[18px] py-[7px] rounded-full mb-7">
                India&apos;s Most Trusted Matrimonial Platform ✦
              </div>
              <h1 className="font-['Playfair_Display',Georgia,serif] text-[clamp(38px,5.5vw,68px)] font-bold leading-[1.15] text-white mb-5 [text-shadow:0_2px_20px_rgba(0,0,0,0.4)]">
                Now, Chat<br />
                <span className="text-[#ff8a70] italic">for Free!</span>
              </h1>
              <p className="text-[17px] text-white/80 leading-[1.75] max-w-[500px] [text-shadow:0_1px_8px_rgba(0,0,0,0.3)]">
                Find your perfect match just became easier.<br />
                Search from over 5 lakh verified profiles.
              </p>
            </div>

            {/* Right — Registration Form */}
            <div className="flex-shrink-0 w-[360px]">
              <div className="bg-black/75 backdrop-blur-xl border border-white/[0.14] rounded-[18px] p-[30px_26px] text-white">
                <h2 className="font-['Playfair_Display',serif] text-[20px] font-bold text-[#ffd9c8] mb-[22px]">
                  Create Profile Form
                </h2>
                <form className="flex flex-col gap-[14px]">
                  <div className="flex flex-col gap-[5px]">
                    <label className="text-[12px] text-white/70 font-semibold tracking-[0.4px]">Profile For</label>
                    <select className="w-full px-3 py-[10px] rounded-[9px] border border-white/[0.18] bg-white/95 text-[#2c1810] text-[14px] font-['Lato',sans-serif] outline-none focus:border-[#e74c3c] transition-colors">
                      <option>Select</option>
                      <option>Myself</option>
                      <option>Son</option>
                      <option>Daughter</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-[5px]">
                    <label className="text-[12px] text-white/70 font-semibold tracking-[0.4px]">Email Address</label>
                    <input type="email" placeholder="Email Address" className="w-full px-3 py-[10px] rounded-[9px] border border-white/[0.18] bg-white/95 text-[#2c1810] text-[14px] outline-none focus:border-[#e74c3c] transition-colors" />
                  </div>
                  <div className="flex flex-col gap-[5px]">
                    <label className="text-[12px] text-white/70 font-semibold tracking-[0.4px]">Mobile Number</label>
                    <input type="tel" placeholder="Mobile No." className="w-full px-3 py-[10px] rounded-[9px] border border-white/[0.18] bg-white/95 text-[#2c1810] text-[14px] outline-none focus:border-[#e74c3c] transition-colors" />
                  </div>
                  <div className="flex flex-col gap-[5px]">
                    <label className="text-[12px] text-white/70 font-semibold tracking-[0.4px]">Create Password</label>
                    <div className="relative">
                      <input type="password" placeholder="Create Password" className="w-full px-3 py-[10px] pr-9 rounded-[9px] border border-white/[0.18] bg-white/95 text-[#2c1810] text-[14px] outline-none focus:border-[#e74c3c] transition-colors" />
                      <i className="ri-eye-fill absolute right-[10px] top-1/2 -translate-y-1/2 text-[#7a5a50] cursor-pointer text-base" />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-br from-[#c0392b] to-[#e74c3c] text-white py-[13px] rounded-[9px] font-bold text-[15px] border-none cursor-pointer mt-1 transition-all hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(192,57,43,0.45)] hover:shadow-[0_8px_24px_rgba(192,57,43,0.55)]"
                  >
                    Register for Free
                  </button>
                </form>
                <p className="mt-3 text-[11px] text-white/50 leading-[1.5]">
                  By clicking &apos;Register Free&apos; you accept our Terms of Use and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ══ TRUST ══ */}
      <section className="relative z-20 -mt-10">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl px-10 py-14">
          <p className="text-[13px] text-gray-500 uppercase tracking-widest mb-1">MORE THAN 25 YEARS OF</p>
          <h2 className="text-[34px] font-bold text-gray-900 mb-14">
            Bringing People <span className="text-[#d63144]">Together</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: "ri-user-follow-line", title: "100% Screened Profiles", desc: "Search by location, community, profession & more from lakhs of active profiles." },
              { icon: "ri-shield-check-line", title: "Trusted Verification", desc: "Special listing for profiles verified by our agents through personal visits." },
              { icon: "ri-lock-2-line", title: "Privacy You Control", desc: "Restrict unwanted access to contact details & photos/videos." },
            ].map((item) => (
              <div key={item.title} className="flex flex-col text-left">
                <i className={`${item.icon} text-red-400 text-5xl mb-4`}></i>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                <div className="h-[2px] w-12 bg-red-300 mb-3"></div>
                <p className="text-gray-600 text-sm leading-6">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CATEGORIES ══ */}
      <HomeCategories />

      <ProfileCarousel items={testimonials} />

      {/* ══ DOWNLOAD APP ══ */}
      <section className="bg-[#fff8f0]">
        <div className="max-w-[1200px] mx-auto px-6 py-20 flex items-center gap-[60px] flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <p className="text-[11px] font-bold tracking-[2.5px] uppercase text-[#c0392b] mb-[10px]">Get the App</p>
            <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(26px,4vw,40px)] font-bold text-[#2c1810] mb-4 leading-[1.2]">
              Download the <span className="text-[#c0392b] italic">EliteWeds</span> App
            </h2>
            <p className="text-[15px] text-[#7a5a50] leading-[1.75] max-w-[600px]">
              Connect with your matches anytime, anywhere.
            </p>
            <div className="mt-7 bg-white border border-[#f0d9c8] rounded-2xl p-6 max-w-[420px]">
              <p className="text-[13px] text-[#7a5a50] mb-4 leading-[1.5]">
                Point your phone camera at the QR code or use the links below
              </p>
              <div className="flex items-center gap-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/qr.jpg" alt="QR Code" className="w-[110px] h-[110px] border border-[#f0d9c8] rounded-[10px] p-1" />
                <div className="flex flex-col gap-[10px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <a href="#"><img src="/googleStore.webp" alt="Google Play" className="w-[120px]" /></a>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <a href="#"><img src="/appleStore.png" alt="App Store" className="w-[120px]" /></a>
                </div>
              </div>
              <p className="mt-[14px] text-[13px] text-[#7a5a50]">
                Or <span className="text-[#c0392b] font-semibold">get a download link</span> on your SMS/EMAIL
              </p>
            </div>
          </div>

          <div className="flex-1 min-w-[280px] relative flex justify-center min-h-[340px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/wedscreen.jpg" className="w-[200px] rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.18)] z-[1] relative" alt="App screen" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/wedscreen.jpg" className="w-[155px] rounded-[14px] shadow-[0_12px_32px_rgba(0,0,0,0.14)] absolute top-6 right-10 hidden md:block" alt="App screen" />
            <span className="absolute top-[60px] left-[10px] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] px-[14px] py-[6px] rounded-full text-[12px] font-semibold text-[#2c1810] hidden md:block">Easy Verification</span>
            <span className="absolute top-[60px] right-[10px] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] px-[14px] py-[6px] rounded-full text-[12px] font-semibold text-[#2c1810] hidden md:block">Voice &amp; Video Calls</span>
            <span className="absolute bottom-[10px] left-[30px] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] px-[14px] py-[6px] rounded-full text-[12px] font-semibold text-[#2c1810] hidden md:block">10M+ Downloads</span>
          </div>
        </div>
      </section>

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

      {/* ══ THREE STEPS ══ */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <p className="text-[11px] font-bold tracking-[2.5px] uppercase text-[#c0392b] mb-[10px]">Three simple steps to</p>
          <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(26px,4vw,40px)] font-bold text-[#2c1810] mb-4 leading-[1.2]">
            Find the <span className="text-[#c0392b] italic">One for You</span>
          </h2>
          <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-10 mt-[52px]">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-40 h-40 mx-auto mb-5 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt={s.title} className="max-h-full" />
                </div>
                <p className="font-['Playfair_Display',serif] text-[18px] font-bold text-[#c0392b] mb-2">{s.num}</p>
                <h3 className="font-['Playfair_Display',serif] text-[17px] font-semibold text-[#2c1810]">{s.title}</h3>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-[52px]">
            <Link
              href="/register"
              className="inline-block bg-gradient-to-br from-[#c0392b] to-[#e74c3c] text-white px-9 py-[13px] rounded-full font-bold text-[14px] no-underline shadow-[0_4px_16px_rgba(192,57,43,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(192,57,43,0.45)]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* ══ MEMBERSHIP PLANS ══ */}
      <section className="bg-[#fdfaf7] py-20">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="text-center mb-[52px]">
            <p className="text-[11px] font-bold tracking-[2.5px] uppercase text-[#c0392b] mb-[10px]">Choose your plan</p>
            <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(26px,4vw,40px)] font-bold text-[#2c1810] mb-4 leading-[1.2]">
              <span className="text-[#c0392b] italic">Membership</span> Plans
            </h2>
            <p className="text-[15px] text-[#7a5a50] leading-[1.75] max-w-[600px] mx-auto">
              Upgrade as per your requirements. With a paid membership, connect seamlessly and get more responses.
            </p>
          </div>

          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-5">
            {/* FREE */}
            <div className="bg-white border border-[#f0d9c8]/50 rounded-[14px] px-8 py-9 flex flex-col relative">
              <div className="w-10 h-[2px] bg-[#e0d0c8] mb-[22px]" />
              <div className="mb-7 pb-6 border-b border-[#f0e0d6]/50">
                <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#9a7b6e] mb-[10px]">Free</p>
                <div className="font-['Playfair_Display',Georgia,serif] text-[42px] font-bold text-[#1a0a00] leading-none">
                  <sup className="text-[20px] align-top mt-2 inline-block">₹</sup>0
                  <span className="text-[14px] font-normal text-[#9a7b6e] ml-0.5 font-['Lato',sans-serif]">/ month</span>
                </div>
                <p className="text-[13px] text-[#9a7b6e] mt-[10px] leading-[1.65]">
                  Start your matchmaking journey with essentials — no cost, no commitment.
                </p>
              </div>
              <ul className="list-none p-0 m-0 flex flex-col gap-3 flex-1 mb-8">
                {planFeaturesFree.map((f) => (
                  <li key={f.text} className={`flex items-center gap-[9px] text-[13.5px] ${f.active ? "text-[#3d2b20]" : "text-[#bbb] line-through"}`}>
                    <i className={f.active ? "ri-checkbox-circle-fill text-[16px] text-[#22a06b] flex-shrink-0" : "ri-close-circle-fill text-[16px] text-[#ccc] flex-shrink-0"} />
                    {f.text}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block text-center px-6 py-[13px] rounded-full text-[13.5px] font-semibold no-underline transition-all border-[1.5px] border-[#c0392b] text-[#c0392b] bg-transparent hover:bg-[#c0392b] hover:text-white"
              >
                Register free
              </Link>
            </div>

            {/* PREMIUM */}
            <div className="bg-white border-2 border-[#c0392b] rounded-[14px] px-8 py-9 flex flex-col relative">
              <span className="absolute -top-[14px] left-1/2 -translate-x-1/2 bg-[#c0392b] text-white text-[11px] font-semibold px-[18px] py-1 rounded-full whitespace-nowrap tracking-[0.5px]">
                Most popular
              </span>
              <div className="w-10 h-[2px] bg-[#c0392b] mb-[22px]" />
              <div className="mb-7 pb-6 border-b border-[#f0e0d6]/50">
                <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#9a7b6e] mb-[10px]">Premium</p>
                <div className="font-['Playfair_Display',Georgia,serif] text-[42px] font-bold text-[#1a0a00] leading-none">
                  <sup className="text-[20px] align-top mt-2 inline-block">₹</sup>999
                  <span className="text-[14px] font-normal text-[#9a7b6e] ml-0.5 font-['Lato',sans-serif]">/ month</span>
                </div>
                <p className="text-[13px] text-[#9a7b6e] mt-[10px] leading-[1.65]">
                  Full access to all features, exclusive matches, and personalised assistance.
                </p>
              </div>
              <ul className="list-none p-0 m-0 flex flex-col gap-3 flex-1 mb-8">
                {planFeaturesPremium.map((f) => (
                  <li key={f} className="flex items-center gap-[9px] text-[13.5px] text-[#3d2b20]">
                    <i className="ri-checkbox-circle-fill text-[16px] text-[#c0392b] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/plans"
                className="block text-center px-6 py-[13px] rounded-full text-[13.5px] font-semibold no-underline transition-all border-[1.5px] border-[#c0392b] bg-[#c0392b] text-white shadow-[0_4px_14px_rgba(192,57,43,0.25)] hover:bg-[#a93224] hover:border-[#a93224] hover:-translate-y-0.5"
              >
                Browse membership plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ EXCLUSIVE ══ */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20 text-center">
          <p className="text-[11px] font-bold tracking-[2.5px] uppercase text-[#c0392b] mb-[10px]">Personalised Match-Making Service</p>
          <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(26px,4vw,40px)] font-bold text-[#2c1810] mb-4 leading-[1.2]">
            Introducing <span className="text-[#c0392b] italic">Exclusive</span>
          </h2>
          <Link
            href="/exclusive"
            className="inline-block bg-gradient-to-br from-[#c0392b] to-[#e74c3c] text-white px-9 py-[13px] rounded-full font-bold text-[14px] no-underline shadow-[0_4px_16px_rgba(192,57,43,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(192,57,43,0.45)]"
          >
            EXCLUSIVE
          </Link>
          <div className="mt-10 mx-auto max-w-[900px] rounded-[20px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/wedconsulting.jpg" alt="Matchmaking Service" className="w-full max-h-[400px] object-cover block" />
          </div>
          <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-10 mt-12 text-left">
            {exclusiveFeatures.map((f) => (
              <div key={f.title} className="flex flex-col">
                <i className={`${f.icon} text-[28px] text-[#c0392b] mb-3`} />
                <h3 className="font-['Playfair_Display',serif] text-[17px] font-bold text-[#2c1810] mb-2">{f.title}</h3>
                <p className="text-[13px] text-[#7a5a50] leading-[1.7]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WEDDING CAROUSEL ══ */}
      <WeddingCarousel items={weddingItems} />

      {/* ══ BROWSE BY LANGUAGE ══ */}
      <section className="bg-white py-12 pb-8">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <p className="text-[11px] font-bold tracking-[2.5px] uppercase text-[#c0392b] mb-[10px]">Browse</p>
          <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(26px,4vw,40px)] font-bold text-[#2c1810] mb-4 leading-[1.2]">
            <span className="text-[#c0392b] italic">Matrimonial</span> Profiles by
          </h2>
          <div className="flex flex-wrap justify-center gap-[10px] my-6 mb-5">
            {browseCategories.map((p, i) => (
              <span
                key={p}
                className={`px-[18px] py-2 rounded-full border-[1.5px] text-[13px] font-semibold cursor-pointer transition-all ${
                  i === 0
                    ? "bg-[#c0392b] border-[#c0392b] text-white"
                    : "border-[#f0d9c8] text-[#5a3e36] bg-[#fff8f0] hover:bg-[#c0392b] hover:border-[#c0392b] hover:text-white"
                }`}
              >
                {p}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap justify-center mt-3">
            {languages.map((l, i, arr) => (
              <span key={l} className="text-[13px] text-[#7a5a50] my-1 cursor-pointer hover:text-[#c0392b] transition-colors">
                {l}
                {i !== arr.length - 1 && <span className="mx-[6px] text-[#d4bfb8]">|</span>}
              </span>
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