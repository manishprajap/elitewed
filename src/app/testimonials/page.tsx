"use client";

interface Story {
  names: string;
  city: string;
  married: string;
  emoji: string;
  community: string;
  story: string;
}

const stories: Story[] = [
  {
    names: "Priya & Rahul Sharma",
    city: "Lucknow, UP",
    married: "March 2023",
    emoji: "🌸",
    community: "Hindu",
    story:
      "We both lived in the same city but never crossed paths. BandhanSaathi brought us together. The first time we chatted, we talked for 3 hours straight. We got married just 6 months later!",
  },
  {
    names: "Zara & Ahmed Khan",
    city: "Hyderabad, Telangana",
    married: "June 2023",
    emoji: "💐",
    community: "Muslim",
    story:
      "My parents suggested I try BandhanSaathi. I was skeptical at first, but meeting Ahmed changed everything. Today we are incredibly happy together and couldn't be more grateful.",
  },
  {
    names: "Harpreet & Gurdeep Singh",
    city: "Amritsar, Punjab",
    married: "November 2023",
    emoji: "🌺",
    community: "Sikh",
    story:
      "The smart matching feature connected us — our interests were identical! Both families were thrilled. We are truly thankful to BandhanSaathi from the bottom of our hearts.",
  },
  {
    names: "Ananya & Arjun Nair",
    city: "Kochi, Kerala",
    married: "January 2024",
    emoji: "🌻",
    community: "Hindu",
    story:
      "I registered here and found Arjun's profile within just 2 weeks. The verified badge gave me the confidence to reach out. Now we are starting a beautiful new life together.",
  },
  {
    names: "Maria & Thomas D'Souza",
    city: "Goa",
    married: "February 2024",
    emoji: "🌹",
    community: "Christian",
    story:
      "Finding a compatible match in Goa felt impossible. BandhanSaathi made it happen. Thomas is caring, understanding, and everything I ever hoped for. Our love story is perfect.",
  },
  {
    names: "Kavya & Rohan Joshi",
    city: "Pune, Maharashtra",
    married: "April 2024",
    emoji: "🌷",
    community: "Hindu",
    story:
      "After 3 months of conversations, we both knew this was it. Both families agreed. Even after marriage, we keep recommending BandhanSaathi to our friends and family!",
  },
];

interface StatItemProps {
  value: string;
  label: string;
}

function StatItem({ value, label }: StatItemProps) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="font-serif text-2xl font-bold text-red-700">{value}</span>
      <span className="text-xs font-semibold uppercase tracking-wide text-amber-800">
        {label}
      </span>
    </div>
  );
}

interface StoryCardProps {
  story: Story;
}

function StoryCard({ story }: StoryCardProps) {
  return (
    <article className="group flex flex-col gap-4 rounded-2xl border border-amber-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-red-100">
      {/* Top row */}
      <div className="flex items-start gap-4">
        <span className="text-5xl leading-none" role="img" aria-label="flower">
          {story.emoji}
        </span>
        <div className="flex flex-col gap-1.5">
          <h3 className="font-serif text-[17px] font-bold leading-snug text-stone-800">
            {story.names}
          </h3>
          <p className="text-[13px] text-stone-500">📍 {story.city}</p>
          <span className="w-fit rounded-full bg-red-50 px-3 py-0.5 text-[11px] font-bold tracking-wide text-red-700">
            {story.community} Matrimony
          </span>
        </div>
      </div>

      {/* Quote */}
      <p className="flex-1 text-sm italic leading-relaxed text-stone-500">
        &ldquo;{story.story}&rdquo;
      </p>

      {/* Footer */}
      <div className="border-t border-amber-100 pt-3">
        <span className="text-[13px] font-semibold text-red-700">
          💍 Married: {story.married}
        </span>
      </div>
    </article>
  );
}

export default function SuccessStoriesPage() {
  return (
    <main className="font-sans text-stone-800 antialiased">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-orange-50 to-amber-50 px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[3px] text-red-700">
            Real Couples, Real Joy
          </p>

          <h1 className="mb-5 font-serif text-4xl font-bold leading-tight text-stone-800 sm:text-5xl">
            Their{" "}
            <em className="italic text-red-700">Stories</em>,
            <br />
            Our Greatest Pride
          </h1>

          <p className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-amber-900/70">
            These are not just stories — they are real bonds built on trust in
            our platform. Every single one is proof of our dedication.
          </p>

          {/* Stats pill */}
          <div className="mx-auto inline-flex flex-wrap items-center justify-center gap-8 rounded-2xl border border-amber-100 bg-white px-10 py-5 shadow-lg shadow-red-100 sm:flex-nowrap">
            <StatItem value="50,000+" label="Successful Marriages" />
            <span className="hidden h-10 w-px bg-amber-100 sm:block" />
            <StatItem value="98%" label="Satisfaction Rate" />
            <span className="hidden h-10 w-px bg-amber-100 sm:block" />
            <StatItem value="200+" label="Cities Across India" />
          </div>
        </div>
      </section>

      {/* ── Stories Grid ── */}
      <section className="bg-orange-50/50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((s, i) => (
              <StoryCard key={i} story={s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gradient-to-br from-stone-900 to-red-950 px-6 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-4 font-serif text-3xl font-bold text-white sm:text-4xl">
            Write Your Own Love Story
          </h2>
          <p className="mb-9 text-base leading-relaxed text-white/60">
            Just like these couples, your perfect match is waiting here. All
            you need to do is take the first step.
          </p>
          <a
            href="/register"
            className="inline-block rounded-full bg-gradient-to-r from-red-600 to-red-500 px-10 py-4 text-[15px] font-bold text-white shadow-lg shadow-red-900/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-900/60"
          >
            Register Now — It&apos;s Completely Free! →
          </a>
        </div>
      </section>
    </main>
  );
}