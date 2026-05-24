import { useState } from "react";

// ─── FIRST SPACE ─── home & heart ──────────────────────────────────────────
function FirstSpace() {
  return (
    <div>
      {/* Hero card */}
      <div className="bg-rose-50 rounded-3xl p-8 mb-5 border border-rose-100">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-rose-200 flex items-center justify-center text-4xl flex-shrink-0">
            🌸
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-rose-900 mb-2">
              Hi, I'm Erica 👋
            </h2>
            <p className="text-rose-700 leading-relaxed text-sm">
              [A warm, personal intro — who you are when you're off the clock.
              What makes you, you. Two or three sentences that feel like home.]
            </p>
          </div>
        </div>
      </div>

      {/* Two-col grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm">
          <h3 className="font-semibold text-rose-800 mb-3">Things I love ❤️</h3>
          <ul className="space-y-2 text-sm text-rose-700">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-rose-300">•</span>
                [Hobby or interest {i}]
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm">
          <h3 className="font-semibold text-rose-800 mb-3">Home base 🏡</h3>
          <p className="text-rose-500 text-xs mb-2">[City, State]</p>
          <p className="text-rose-700 text-sm leading-relaxed">
            [A little something about where you're from, where you live, or
            what home means to you.]
          </p>
        </div>
      </div>

      {/* Photo row */}
      <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100">
        <h3 className="font-semibold text-rose-800 mb-4">
          A few of my favorite things 📸
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-xl bg-rose-100 flex flex-col items-center justify-center text-rose-300 text-xs gap-1"
            >
              <span className="text-2xl">🌸</span>
              Photo {i}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SECOND SPACE ─── work & study ─────────────────────────────────────────
function SecondSpace() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-amber-50 rounded-3xl p-8 mb-5 border border-amber-100">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-amber-200 flex items-center justify-center text-4xl flex-shrink-0">
            ✨
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-amber-900 mb-2">
              What I do
            </h2>
            <p className="text-amber-700 leading-relaxed text-sm">
              [A short professional bio — your current role, what you're
              focused on, and what you bring. Keep it human, not corporate.]
            </p>
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm mb-4">
        <h3 className="font-semibold text-amber-800 mb-4">Experience 💼</h3>
        <div className="space-y-5">
          {[
            {
              title: "[Job Title]",
              company: "[Company Name]",
              years: "[Year – Present]",
              desc: "[What you did, built, or are proud of in this role.]",
            },
            {
              title: "[Previous Role]",
              company: "[Company Name]",
              years: "[Year – Year]",
              desc: "[What you did, built, or are proud of in this role.]",
            },
          ].map((job, i) => (
            <div key={i} className="border-l-2 border-amber-200 pl-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-amber-900 text-sm">
                    {job.title}
                  </p>
                  <p className="text-amber-500 text-xs">{job.company}</p>
                </div>
                <span className="text-amber-400 text-xs whitespace-nowrap ml-4">
                  {job.years}
                </span>
              </div>
              <p className="text-amber-700 text-xs mt-1 leading-relaxed">
                {job.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm mb-4">
        <h3 className="font-semibold text-amber-800 mb-4">Education 🎓</h3>
        <div className="border-l-2 border-amber-200 pl-4">
          <p className="font-medium text-amber-900 text-sm">
            [Degree · e.g. B.S. Computer Science]
          </p>
          <p className="text-amber-500 text-xs">[University Name]</p>
          <p className="text-amber-400 text-xs mt-0.5">[Year – Year]</p>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
        <h3 className="font-semibold text-amber-800 mb-3">Skills & tools 🛠</h3>
        <div className="flex flex-wrap gap-2">
          {["[Skill 1]", "[Skill 2]", "[Skill 3]", "[Skill 4]", "[Skill 5]", "[Skill 6]"].map(
            (s) => (
              <span
                key={s}
                className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs"
              >
                {s}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// ─── THIRD SPACE ─── online & out there ────────────────────────────────────
function ThirdSpace() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-violet-50 rounded-3xl p-8 mb-5 border border-violet-100">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-violet-200 flex items-center justify-center text-4xl flex-shrink-0">
            🎬
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-violet-900 mb-2">
              Online & out there
            </h2>
            <p className="text-violet-700 leading-relaxed text-sm">
              [The story of your online presence — what you make, who it's for,
              why you started, and what it means to you.]
            </p>
          </div>
        </div>
      </div>

      {/* TikTok card */}
      <div className="bg-white rounded-2xl p-6 border border-violet-100 shadow-sm mb-4">
        <h3 className="font-semibold text-violet-800 mb-4">TikTok 🎵</h3>
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-2xl">
            🎵
          </div>
          <div>
            <p className="font-medium text-violet-900 text-sm">
              @[yourtiktokhandle]
            </p>
            <p className="text-violet-400 text-xs">[X followers · X likes]</p>
          </div>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto bg-violet-500 text-white px-4 py-1.5 rounded-full text-xs hover:bg-violet-600 transition-colors"
          >
            Follow
          </a>
        </div>
        <p className="text-violet-500 text-xs italic">
          [What your TikTok is about — the vibe, the niche, the energy]
        </p>
      </div>

      {/* Recent content */}
      <div className="bg-white rounded-2xl p-6 border border-violet-100 shadow-sm mb-4">
        <h3 className="font-semibold text-violet-800 mb-4">
          Recent content 📲
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-video rounded-xl bg-violet-50 border border-violet-100 flex flex-col items-center justify-center text-violet-300 text-xs gap-1"
            >
              <span className="text-2xl">🎬</span>
              Video {i}
            </div>
          ))}
        </div>
      </div>

      {/* Links grid */}
      <div className="bg-violet-50 rounded-2xl p-6 border border-violet-100">
        <h3 className="font-semibold text-violet-800 mb-4">
          Find me elsewhere 🌐
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "📸", label: "Instagram", handle: "@yourhandle" },
            { icon: "𝕏", label: "Twitter / X", handle: "@yourhandle" },
            { icon: "💼", label: "LinkedIn", handle: "Erica Chen" },
            { icon: "✉️", label: "Email", handle: "your@email.com" },
          ].map((link) => (
            <div
              key={link.label}
              className="bg-white rounded-xl p-3 border border-violet-100 flex items-center gap-3"
            >
              <span className="text-xl">{link.icon}</span>
              <div>
                <p className="text-violet-800 text-xs font-medium">
                  {link.label}
                </p>
                <p className="text-violet-400 text-xs">{link.handle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── APP ────────────────────────────────────────────────────────────────────
const TABS = [
  {
    id: "first",
    emoji: "🏡",
    label: "First Space",
    sub: "home & heart",
    tagline: "the space where i'm most myself",
    activeBg: "bg-rose-500",
    subBg: "bg-rose-50",
    subBorder: "border-rose-100",
    subText: "text-rose-400",
    subTagline: "text-rose-300",
  },
  {
    id: "second",
    emoji: "✨",
    label: "Second Space",
    sub: "work & study",
    tagline: "what i've learned and where i've been",
    activeBg: "bg-amber-500",
    subBg: "bg-amber-50",
    subBorder: "border-amber-100",
    subText: "text-amber-400",
    subTagline: "text-amber-300",
  },
  {
    id: "third",
    emoji: "🎬",
    label: "Third Space",
    sub: "online & out there",
    tagline: "where i show up for a wider world",
    activeBg: "bg-violet-500",
    subBg: "bg-violet-50",
    subBorder: "border-violet-100",
    subText: "text-violet-400",
    subTagline: "text-violet-300",
  },
];

export default function App() {
  const [active, setActive] = useState("first");
  const current = TABS.find((t) => t.id === active);

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-10 bg-white border-b border-stone-100 px-5 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="font-semibold text-stone-800">Erica Chen</h1>
            <p className="text-stone-400 text-xs">three spaces · one person</p>
          </div>

          <nav className="flex gap-1.5 flex-wrap justify-end">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  active === tab.id
                    ? `${tab.activeBg} text-white`
                    : "text-stone-500 hover:bg-stone-100"
                }`}
              >
                {tab.emoji} {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Space banner ── */}
      <div
        className={`py-5 px-5 border-b ${current.subBg} ${current.subBorder}`}
      >
        <div className="max-w-2xl mx-auto">
          <p className={`text-sm font-medium ${current.subText}`}>
            {current.emoji} {current.sub}
          </p>
          <p className={`text-xs mt-0.5 ${current.subTagline}`}>
            {current.tagline}
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="max-w-2xl mx-auto px-5 py-8">
        {active === "first" && <FirstSpace />}
        {active === "second" && <SecondSpace />}
        {active === "third" && <ThirdSpace />}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-stone-100 py-6 px-5 text-center text-stone-400 text-xs">
        made with 🤍 · erica chen · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
