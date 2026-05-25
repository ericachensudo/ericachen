'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── ANIMATION SYSTEM ────────────────────────────────────────────────────────
// Apple uses a very particular cubic-bezier: fast start, smooth deceleration.
const EASE = [0.22, 1, 0.36, 1];

// Every card/section fades in and drifts up slightly when it enters the viewport.
// `delay` lets grid children cascade in one after another.
function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-48px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Hero sections get a slightly larger drift and a subtle scale, just like
// Apple product heroes.
function HeroReveal({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-32px' }}
      transition={{ duration: 0.8, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Shared container
const container = 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10';

// ─── FIRST SPACE ─── home & heart ──────────────────────────────────────────
function FirstSpace() {
  return (
    <div>
      {/* Hero */}
      <HeroReveal className="mb-5">
        <div className="bg-rose-50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-rose-100">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-rose-200 flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0">
              🌸
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-rose-900 mb-2">
                Hi, I'm Erica 👋
              </h2>
              <p className="text-rose-700 leading-relaxed text-sm sm:text-base">
                [A warm, personal intro — who you are when you're off the clock.
                What makes you, you. Two or three sentences that feel like home.]
              </p>
            </div>
          </div>
        </div>
      </HeroReveal>

      {/* Cards — cascade in with 80 ms between each */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-5">
        {[
          {
            title: 'Things I love ❤️',
            body: (
              <ul className="space-y-2 text-sm text-rose-700">
                {[1, 2, 3, 4].map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-rose-300">•</span>
                    [Hobby or interest {i}]
                  </li>
                ))}
              </ul>
            ),
          },
          {
            title: 'Home base 🏡',
            body: (
              <>
                <p className="text-rose-500 text-xs mb-2">[City, State]</p>
                <p className="text-rose-700 text-sm leading-relaxed">
                  [A little something about where you're from, where you live,
                  or what home means to you.]
                </p>
              </>
            ),
          },
          {
            title: 'Right now 🌱',
            body: (
              <p className="text-rose-700 text-sm leading-relaxed">
                [What you're into lately — a book, a project, a feeling, a
                season of life. Keep it fresh and you.]
              </p>
            ),
            xlOnly: true,
          },
        ].map((card, i) => (
          <Reveal key={i} delay={i * 0.08} className={card.xlOnly ? 'hidden xl:block' : ''}>
            <div className="h-full bg-white rounded-2xl p-4 sm:p-6 border border-rose-100 shadow-sm">
              <h3 className="font-semibold text-rose-800 mb-3 text-sm sm:text-base">
                {card.title}
              </h3>
              {card.body}
            </div>
          </Reveal>
        ))}
      </div>

      {/* Photos — cascade grid */}
      <Reveal>
        <div className="bg-rose-50 rounded-2xl p-4 sm:p-6 border border-rose-100">
          <h3 className="font-semibold text-rose-800 mb-4 text-sm sm:text-base">
            A few of my favorite things 📸
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                className={`aspect-square rounded-xl bg-rose-100 flex flex-col items-center justify-center text-rose-300 text-xs gap-1
                  ${i > 2 ? 'hidden sm:flex' : ''}
                  ${i > 4 ? 'hidden xl:flex' : ''}
                  ${i === 4 ? 'hidden lg:flex' : ''}
                `}
              >
                <span className="text-xl sm:text-2xl">🌸</span>
                <span>Photo {i}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

// ─── SECOND SPACE ─── work & study ─────────────────────────────────────────

// Each entry has a `photo` field — null for now, swap in a real URL or
// import from your CMS/database once it's set up.
const EXPERIENCE = [
  {
    title: '[Job Title]',
    company: '[Company Name]',
    location: '[City, State]',
    period: '[Year – Present]',
    desc: '[What you did, built, or are most proud of. Two or three sentences that capture the impact, not just the tasks.]',
    photo: null, // e.g. '/images/company-a.jpg' or a CDN URL
    accent: '#fef3c7', // placeholder tint used until a real photo is added
  },
  {
    title: '[Previous Role]',
    company: '[Company Name]',
    location: '[City, State]',
    period: '[Year – Year]',
    desc: '[What you did, built, or are most proud of. Two or three sentences that capture the impact, not just the tasks.]',
    photo: null,
    accent: '#fde68a',
  },
  {
    title: '[Earlier Role]',
    company: '[Company Name]',
    location: '[City, State]',
    period: '[Year – Year]',
    desc: '[What you did, built, or are most proud of. Two or three sentences that capture the impact, not just the tasks.]',
    photo: null,
    accent: '#fcd34d',
  },
];

const EDUCATION = [
  {
    degree: '[Degree · e.g. B.S. Computer Science]',
    school: '[University Name]',
    period: '[Year – Year]',
    note: '[Honors, relevant coursework, clubs, or anything worth calling out.]',
    photo: null,
    accent: '#fed7aa',
  },
];

// Cursor-following photo popup — renders fixed so it floats above everything.
function CursorPopup({ item, pos }) {
  // Nudge right and up from the cursor tip so it never covers what you're reading.
  const x = pos.x + 20;
  const y = pos.y - 140;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 8 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      style={{ left: x, top: y, pointerEvents: 'none', position: 'fixed', zIndex: 9999 }}
      className="w-36 rounded-2xl overflow-hidden shadow-xl border border-white/60"
    >
      {item.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.photo}
          alt={item.company}
          className="w-full h-36 object-cover"
        />
      ) : (
        // Placeholder until a real photo is connected
        <div
          className="w-full h-36 flex flex-col items-center justify-center gap-1"
          style={{ background: item.accent }}
        >
          <span className="text-3xl">🏢</span>
          <span className="text-amber-700 text-xs font-medium px-2 text-center leading-tight">
            {item.company}
          </span>
        </div>
      )}
      <div className="bg-white px-3 py-2">
        <p className="text-amber-900 text-xs font-medium truncate">{item.title}</p>
        <p className="text-amber-400 text-xs truncate">{item.company}</p>
      </div>
    </motion.div>
  );
}

// A single hoverable row used for both experience and education entries.
function ResumeRow({ item, index, onEnter, onMove, onLeave }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 py-6 cursor-default"
    >
      {/* Period — left column on sm+, small label on mobile */}
      <div className="flex-shrink-0 sm:w-32 sm:text-right">
        <span className="text-amber-400 text-xs tabular-nums">
          {item.period ?? item.years}
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 mb-1">
          <h3
            onMouseEnter={(e) => onEnter(e, item)}
            onMouseMove={(e) => onMove(e)}
            onMouseLeave={onLeave}
            className="font-semibold text-amber-900 text-base sm:text-lg leading-tight hover:text-amber-700 transition-colors cursor-default"
          >
            {item.title ?? item.degree}
          </h3>
          <span className="text-amber-400 text-xs hidden sm:inline">·</span>
          <span className="text-amber-600 text-sm">{item.company ?? item.school}</span>
          {(item.location) && (
            <>
              <span className="text-amber-300 text-xs hidden sm:inline">·</span>
              <span className="text-amber-400 text-xs">{item.location}</span>
            </>
          )}
        </div>
        <p className="text-amber-700/80 text-sm leading-relaxed">
          {item.desc ?? item.note}
        </p>
      </div>
    </motion.div>
  );
}

function SecondSpace() {
  const [hovered, setHovered] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  function handleEnter(e, item) {
    setCursorPos({ x: e.clientX, y: e.clientY });
    setHovered(item);
  }
  function handleMove(e) {
    setCursorPos({ x: e.clientX, y: e.clientY });
  }
  function handleLeave() {
    setHovered(null);
  }

  return (
    <>
      {/* Cursor popup — lives outside the layout flow */}
      <AnimatePresence>
        {hovered && <CursorPopup item={hovered} pos={cursorPos} />}
      </AnimatePresence>

      <div>
        {/* Hero */}
        <HeroReveal className="mb-8">
          <div className="bg-amber-50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-amber-100">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-200 flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0">
                ✨
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-amber-900 mb-2">
                  What I do
                </h2>
                <p className="text-amber-700 leading-relaxed text-sm sm:text-base">
                  [A short professional bio — your current role, what you're
                  focused on, and what you bring. Keep it human, not corporate.]
                </p>
              </div>
            </div>
          </div>
        </HeroReveal>

        {/* Experience section */}
        <Reveal>
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden mb-4">
            <div className="px-5 sm:px-8 pt-6 pb-2 border-b border-amber-50">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                Experience
              </p>
            </div>
            <div className="px-5 sm:px-8 divide-y divide-amber-50">
              {EXPERIENCE.map((job, i) => (
                <ResumeRow
                  key={i}
                  item={job}
                  index={i}
                  onEnter={handleEnter}
                  onMove={handleMove}
                  onLeave={handleLeave}
                />
              ))}
            </div>
          </div>
        </Reveal>

        {/* Education section */}
        <Reveal delay={0.1}>
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
            <div className="px-5 sm:px-8 pt-6 pb-2 border-b border-amber-50">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                Education
              </p>
            </div>
            <div className="px-5 sm:px-8 divide-y divide-amber-50">
              {EDUCATION.map((edu, i) => (
                <ResumeRow
                  key={i}
                  item={edu}
                  index={i}
                  onEnter={handleEnter}
                  onMove={handleMove}
                  onLeave={handleLeave}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}

// ─── THIRD SPACE HELPERS ────────────────────────────────────────────────────

// Skeleton shimmer shown while fetching
function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-violet-100 rounded-xl ${className}`} />
  );
}

// Single Instagram tile
function IgTile({ item, index }) {
  const isVideo = item.media_type === 'VIDEO';
  const src = isVideo ? item.thumbnail_url : item.media_url;
  return (
    <motion.a
      href={item.permalink}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.93 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: EASE }}
      className="relative group aspect-square rounded-xl overflow-hidden bg-violet-50 block"
    >
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={item.caption ?? 'Instagram post'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
    </motion.a>
  );
}

// Single TikTok tile
function TtTile({ video, index }) {
  return (
    <motion.a
      href={video.share_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.93 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: EASE }}
      className="relative group aspect-[9/16] rounded-xl overflow-hidden bg-violet-50 block"
    >
      {video.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={video.cover_image_url}
          alt={video.title ?? 'TikTok video'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      {/* Play overlay */}
      <div className="absolute inset-0 flex items-end p-3 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-white text-xs line-clamp-2 leading-snug">
          {video.video_description || video.title}
        </p>
      </div>
      <div className="absolute top-2 right-2">
        <div className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </motion.a>
  );
}

// "Not connected" prompt card
function NotConnected({ platform, connectPath }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center text-3xl mb-4">
        {platform === 'tiktok' ? '🎵' : '📸'}
      </div>
      <p className="text-violet-800 font-medium mb-1">
        {platform === 'tiktok' ? 'TikTok' : 'Instagram'} not connected yet
      </p>
      <p className="text-violet-400 text-sm mb-4 max-w-xs">
        Follow the steps in <code className="bg-violet-50 px-1 rounded">SETUP.md</code> to add your API tokens, then{' '}
        {platform === 'tiktok' && (
          <a href={connectPath} className="underline">visit /api/tiktok/connect</a>
        )}
        {platform === 'instagram' && 'add your INSTAGRAM_ACCESS_TOKEN to Vercel.'}
      </p>
    </div>
  );
}

// ─── THIRD SPACE ─── online & out there ────────────────────────────────────
function ThirdSpace() {
  const [platform, setPlatform] = useState('tiktok'); // 'tiktok' | 'instagram' | 'both'
  const [igData, setIgData] = useState(null);
  const [ttData, setTtData] = useState(null);
  const [igError, setIgError] = useState(null);
  const [ttError, setTtError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/instagram').then((r) => r.json()).catch(() => ({ error: 'fetch failed' })),
      fetch('/api/tiktok').then((r) => r.json()).catch(() => ({ error: 'fetch failed' })),
    ]).then(([ig, tt]) => {
      if (ig.error) setIgError(ig.error); else setIgData(ig.media ?? []);
      if (tt.error) setTtError(tt.error); else setTtData(tt.videos ?? []);
      setLoading(false);
    });
  }, []);

  const showTt = platform === 'tiktok' || platform === 'both';
  const showIg = platform === 'instagram' || platform === 'both';

  const platformBtn = (id, label) => (
    <button
      key={id}
      onClick={() => setPlatform(id)}
      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
        platform === id
          ? 'bg-violet-500 text-white'
          : 'text-violet-500 hover:bg-violet-50 border border-violet-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      {/* Hero */}
      <HeroReveal className="mb-5">
        <div className="bg-violet-50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-violet-100">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-violet-200 flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0">
              🎬
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-violet-900 mb-2">
                Online & out there
              </h2>
              <p className="text-violet-700 leading-relaxed text-sm sm:text-base mb-4">
                [The story of your online presence — what you make, who it's
                for, why you started, and what it means to you.]
              </p>
              {/* Platform switcher */}
              <div className="flex gap-2 flex-wrap">
                {platformBtn('tiktok', '🎵 TikTok')}
                {platformBtn('instagram', '📸 Instagram')}
                {platformBtn('both', '✨ Both')}
              </div>
            </div>
          </div>
        </div>
      </HeroReveal>

      {/* ── TikTok feed ── */}
      {showTt && (
        <Reveal className="mb-5">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-violet-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-violet-800 text-sm sm:text-base">🎵 TikTok</h3>
              <a
                href="https://tiktok.com/@yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 text-xs hover:text-violet-600 transition-colors"
              >
                View profile →
              </a>
            </div>

            {loading ? (
              /* Skeleton grid — portrait ratio for TikTok */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[9/16]" />
                ))}
              </div>
            ) : ttError ? (
              <NotConnected platform="tiktok" connectPath="/api/tiktok/connect" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {ttData.map((video, i) => (
                  <TtTile key={video.id} video={video} index={i} />
                ))}
              </div>
            )}
          </div>
        </Reveal>
      )}

      {/* ── Instagram feed ── */}
      {showIg && (
        <Reveal>
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-violet-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-violet-800 text-sm sm:text-base">📸 Instagram</h3>
              <a
                href="https://instagram.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 text-xs hover:text-violet-600 transition-colors"
              >
                View profile →
              </a>
            </div>

            {loading ? (
              /* Skeleton grid — square ratio for Instagram */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square" />
                ))}
              </div>
            ) : igError ? (
              <NotConnected platform="instagram" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {igData.map((item, i) => (
                  <IgTile key={item.id} item={item} index={i} />
                ))}
              </div>
            )}
          </div>
        </Reveal>
      )}
    </div>
  );
}

// ─── CONFIG ─────────────────────────────────────────────────────────────────
const TABS = [
  {
    id: 'first',
    emoji: '🏡',
    label: 'First Space',
    sub: 'home & heart',
    tagline: "the space where i'm most myself",
    activeBg: 'bg-rose-500',
    subBg: 'bg-rose-50',
    subBorder: 'border-rose-100',
    subText: 'text-rose-400',
    subTagline: 'text-rose-300',
  },
  {
    id: 'second',
    emoji: '✨',
    label: 'Second Space',
    sub: 'work & study',
    tagline: "what i've learned and where i've been",
    activeBg: 'bg-amber-500',
    subBg: 'bg-amber-50',
    subBorder: 'border-amber-100',
    subText: 'text-amber-400',
    subTagline: 'text-amber-300',
  },
  {
    id: 'third',
    emoji: '🎬',
    label: 'Third Space',
    sub: 'online & out there',
    tagline: 'where i show up for a wider world',
    activeBg: 'bg-violet-500',
    subBg: 'bg-violet-50',
    subBorder: 'border-violet-100',
    subText: 'text-violet-400',
    subTagline: 'text-violet-300',
  },
];

// ─── PAGE ───────────────────────────────────────────────────────────────────
export default function Home() {
  const [active, setActive] = useState('first');
  const current = TABS.find((t) => t.id === active);

  return (
    <div className="min-h-screen bg-stone-50">

      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className={`${container} py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4`}>
          <div className="flex-shrink-0">
            <h1 className="font-semibold text-stone-800 text-base sm:text-lg leading-tight">
              Erica Chen
            </h1>
            <p className="text-stone-400 text-xs">three spaces · one person</p>
          </div>

          <nav className="flex gap-1.5 sm:ml-auto overflow-x-auto pb-0.5 sm:pb-0 no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  active === tab.id
                    ? `${tab.activeBg} text-white`
                    : 'text-stone-500 hover:bg-stone-100'
                }`}
              >
                {tab.emoji}
                <span className="hidden sm:inline"> {tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Space banner ── */}
      <div className={`border-b ${current.subBg} ${current.subBorder}`}>
        <div className={`${container} py-4 sm:py-5`}>
          <p className={`text-sm font-medium ${current.subText}`}>
            {current.emoji} {current.sub}
          </p>
          <p className={`text-xs mt-0.5 ${current.subTagline}`}>
            {current.tagline}
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <main className={`${container} py-6 sm:py-8 lg:py-10`}>
        {active === 'first' && <FirstSpace />}
        {active === 'second' && <SecondSpace />}
        {active === 'third' && <ThirdSpace />}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-stone-100">
        <div className={`${container} py-6 text-center text-stone-400 text-xs`}>
          made with 🤍 · erica chen · {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
