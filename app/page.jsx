'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Load the map client-side only (Google Maps requires browser APIs)
const CityMap = dynamic(() => import('./components/CityMap'), { ssr: false });

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

function usePrefersDarkMode() {
  const [prefersDark, setPrefersDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updatePreference = () => setPrefersDark(mediaQuery.matches);

    updatePreference();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updatePreference);
      return () => mediaQuery.removeEventListener('change', updatePreference);
    }

    mediaQuery.addListener(updatePreference);
    return () => mediaQuery.removeListener(updatePreference);
  }, []);

  return prefersDark;
}

// ─── PLACES I'VE LIVED ───────────────────────────────────────────────────────
const LIVED_PLACES = [
  { id: 'nyc', emoji: '🗽', name: 'New York', mid: '1dbvFRxSDqDevDRlGx3rxi40wL7dvA84' },
  { id: 'sf',  emoji: '🌉', name: 'San Francisco', mid: '1FnJeWiPAkBcXeEGrUANqGV6uCVtUBSg' },
  { id: 'seattle', emoji: '🌲', name: 'Seattle', mid: '1aCerRPp9BXyor-ShUl2p0issDmbt8fQ' },
];

function HomeMaps() {
  const [active, setActive] = useState('nyc');
  const tab = LIVED_PLACES.find((t) => t.id === active);

  return (
    <div className="rounded-2xl overflow-hidden">

      {/* City selector pills */}
      <div className="px-4 sm:px-6 pb-3 flex gap-2 flex-wrap">
        {LIVED_PLACES.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              active === t.id
                ? 'bg-rose-500 text-white'
                : 'bg-rose-50 text-rose-500 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-200 dark:hover:bg-rose-900/70'
            }`}
          >
            {t.emoji} {t.name}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="px-4 sm:px-6 pb-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab.mid}
            className="mymaps-crop-shell w-full rounded-xl"
            style={{ height: 'clamp(280px, 40vw, 400px)' }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <iframe
              src={`https://www.google.com/maps/d/embed?mid=${tab.mid}&ehbc=2E312F`}
              className="mymaps-crop-frame"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={tab.name}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── TRAVEL TIMELINE ─────────────────────────────────────────────────────────
const MAP_TABS = [
  { id: 'hawaii',    emoji: '🌺', name: 'Hawaii',      year: '2022', mid: '1hJvs6LUrHri7-1qlNNZOsdKokraoI8w' },
  { id: 'pr',        emoji: '🌴', name: 'Puerto Rico', year: '2024', mid: '1icBup8BL9rA6TERHw3p8FHX5WDrMOrM' },
  { id: 'london',    emoji: '🎡', name: 'London',      year: '2025', mid: '1LIpFUbZBiUrVSZrg6DI2YRZ_qzMwnHs' },
  { id: 'amsterdam', emoji: '🌷', name: 'Amsterdam',   year: '2025', mid: '1T0tr5uquuFWoNMb86H7KEDwZIDeUuFs' },
  { id: 'paris',     emoji: '🗼', name: 'Paris',       year: '2025', mid: '15MiHjNGdIoT94uhCyL92uVWz0HYBYps' },
  { id: 'barcelona', emoji: '🇪🇸', name: 'Barcelona', year: '2026', mid: '1lRheNrPqX4CH1rMFg-oLg70v9YUqqEQ' },
  { id: 'mexico',    emoji: '🇲🇽', name: 'Mexico',    year: '2026', mid: '1ND0Bd8WQvY5byZT4h6e7Mh37PZS_1r4' },
  { id: 'taiwan',    emoji: '🇹🇼', name: 'Taiwan',    year: '2026', mid: '1OoskUz1mWLTGb8cwTisWWSKAZ_O2R9o' },
  { id: 'vietnam',   emoji: '🇻🇳', name: 'Vietnam',   year: '2026', mid: '17Rj0zq7sUalYA0VHn3frahJceE9FfNQ' },
];

// Height per collapsed row in the timeline (px)
const ROW_HEIGHT = 56;
// Height added when a row is expanded to show the map
const MAP_HEIGHT = 300;

function PlacesMap() {
  const [expanded, setExpanded] = useState(null);

  // Total height scales with city count; grows when one is expanded
  const totalHeight = MAP_TABS.length * ROW_HEIGHT + (expanded ? MAP_HEIGHT : 0);

  // Track which years have already been shown
  const shownYears = new Set();

  return (
    <motion.div
      animate={{ height: totalHeight }}
      transition={{ duration: 0.45, ease: EASE }}
      className="bg-white dark:bg-stone-900 rounded-2xl border border-rose-100 dark:border-rose-950 shadow-sm dark:shadow-black/20 overflow-hidden relative"
    >
      {/* Vertical timeline line */}
      <div className="absolute left-16 sm:left-20 top-0 bottom-0 w-0.5 bg-rose-100 dark:bg-rose-950" />

      <div className="py-4">
        {MAP_TABS.map((t, i) => {
          const isExpanded = expanded === t.id;
          const showYear = t.year && !shownYears.has(t.year);
          if (t.year) shownYears.add(t.year);

          return (
            <div key={t.id}>
              {/* Row */}
              <button
                onClick={() => setExpanded(isExpanded ? null : t.id)}
                className="relative w-full flex items-center gap-3 px-4 sm:px-6 py-3 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 transition-colors text-left"
              >
                {/* Year label on the left — only shown once per year */}
                <span className="w-8 sm:w-10 flex-shrink-0 text-xs font-semibold text-rose-300 dark:text-rose-700 text-right tabular-nums">
                  {showYear ? t.year : ''}
                </span>

                {/* Pin dot on the line */}
                <div className="relative z-10 flex-shrink-0 w-5 h-5 rounded-full border-2 border-rose-300 dark:border-rose-700 bg-white dark:bg-stone-900 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: isExpanded ? 1 : 0,
                      backgroundColor: '#f43f5e',
                    }}
                    transition={{ duration: 0.2 }}
                    className="w-2.5 h-2.5 rounded-full"
                  />
                </div>

                {/* Emoji */}
                <span className="text-lg leading-none">{t.emoji}</span>

                {/* Name */}
                <span className={`text-sm font-medium transition-colors ${
                  isExpanded ? 'text-rose-700 dark:text-rose-200' : 'text-rose-500 dark:text-rose-300'
                }`}>
                  {t.name}
                </span>

                {/* Open link + chevron */}
                <span className="ml-auto flex items-center gap-2">
                  <a
                    href={`https://www.google.com/maps/d/viewer?mid=${t.mid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-rose-300 dark:text-rose-600 text-xs hover:text-rose-500 dark:hover:text-rose-300 transition-colors hidden sm:inline"
                  >
                    Open →
                  </a>
                  <motion.svg
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="w-4 h-4 text-rose-300 dark:text-rose-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </span>
              </button>

              {/* Expandable map */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: MAP_HEIGHT, opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="overflow-hidden px-4 sm:px-6 pl-20 sm:pl-24"
                  >
                    <div className="mymaps-crop-shell w-full h-full rounded-xl">
                      <iframe
                        src={`https://www.google.com/maps/d/embed?mid=${t.mid}&ehbc=2E312F`}
                        className="mymaps-crop-frame"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={t.name}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── FIRST SPACE ─── home & heart ──────────────────────────────────────────
function FirstSpace() {

  return (
    <div>
      {/* Hero */}
      <HeroReveal className="mb-5">
        <div className="bg-rose-50 dark:bg-rose-950/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-rose-100 dark:border-rose-900">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-rose-200 dark:bg-rose-900 flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0">
              🌸
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-rose-900 dark:text-rose-100 mb-2">
                Hi, I'm Erica 👋
              </h2>
              <p className="text-rose-700 dark:text-rose-200/90 leading-relaxed text-sm sm:text-base">
                Welcome to my little corner of the internet. I'm playing around
                with the idea of first space, second space, and third space online
                and figuring out what it means to share different parts of my life.
                I grew up in Queens and have lived in New York, Seattle, and San
                Francisco, and right now I am usually chasing a new restaurant,
                growing my Polaroid collection, planning solo trips, or hosting
                Mahjong and Catan nights.
              </p>
            </div>
          </div>
        </div>
      </HeroReveal>

      {/* ── Places I've lived ── */}
      <Reveal className="mb-5">
        <HomeMaps />
      </Reveal>

      {/* ── Travel timeline ── */}
      <Reveal>
        <PlacesMap />
      </Reveal>
    </div>
  );
}

// ─── SECOND SPACE ─── work & study ─────────────────────────────────────────

// Each entry has a `photo` field — null for now, swap in a real URL or
// import from your CMS/database once it's set up.
const EXPERIENCE = [
  {
    title: 'Technical Program Manager',
    company: 'Microsoft',
    location: 'Redmond, WA · Azure Core – Compute Control Plane',
    period: 'Nov 2024 – Present',
    photo: null,
    accent: '#fef3c7',
  },
  {
    title: 'Product Manager',
    company: 'Microsoft',
    location: 'Redmond, WA · Azure Core – Customer Supportability',
    period: 'May 2024 – Aug 2024',
    photo: null,
    accent: '#fde68a',
  },
  {
    title: 'Software Engineering Intern',
    company: 'Salesforce',
    location: 'San Francisco, CA · Tableau Dashboard AI Team',
    period: 'May 2023 – Aug 2023',
    photo: null,
    accent: '#fcd34d',
  },
  {
    title: 'Software Engineering Intern',
    company: 'Capital One',
    location: 'McLean, VA · Auto Loan Team',
    period: 'Jun 2022 – Aug 2022',
    photo: null,
    accent: '#fed7aa',
  },
  {
    title: 'Technical Product Manager',
    company: 'OroXYZ',
    location: 'New York, NY · Pre-Seed Startup @ Columbia Business School',
    period: 'Jan 2023 – May 2023',
    photo: null,
    accent: '#fef9c3',
  },
];

const EDUCATION = [
  {
    degree: 'B.A. Computer Science & Statistics',
    school: 'Columbia University, Barnard College',
    period: 'Sept 2020 – May 2024',
    note: '3.9 GPA · McDonald\'s Multi-Year Academic Scholarship · Election Day translator in Mandarin (native) and Spanish.',
    photo: null,
    accent: '#fef3c7',
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
      className="w-36 rounded-2xl overflow-hidden shadow-xl border border-white/60 dark:border-stone-700"
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
      <div className="bg-white dark:bg-stone-900 px-3 py-2">
        <p className="text-amber-900 dark:text-amber-100 text-xs font-medium truncate">{item.title}</p>
        <p className="text-amber-400 dark:text-amber-300 text-xs truncate">{item.company}</p>
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
            className="font-semibold text-amber-900 dark:text-amber-100 text-base sm:text-lg leading-tight hover:text-amber-700 dark:hover:text-amber-300 transition-colors cursor-default"
          >
            {item.title ?? item.degree}
          </h3>
          <span className="text-amber-400 dark:text-amber-500 text-xs hidden sm:inline">·</span>
          <span className="text-amber-600 dark:text-amber-300 text-sm">{item.company ?? item.school}</span>
          {(item.location) && (
            <>
              <span className="text-amber-300 dark:text-amber-700 text-xs hidden sm:inline">·</span>
              <span className="text-amber-400 dark:text-amber-500 text-xs">{item.location}</span>
            </>
          )}
        </div>
        {(item.desc ?? item.note) && (
          <p className="text-amber-700/80 dark:text-amber-200/80 text-sm leading-relaxed">
            {item.desc ?? item.note}
          </p>
        )}
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
          <div className="bg-amber-50 dark:bg-amber-950/35 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-amber-100 dark:border-amber-900">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-200 dark:bg-amber-900 flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0">
                ✨
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  What I do
                </h2>
                <p className="text-amber-700 dark:text-amber-200/90 leading-relaxed text-sm sm:text-base">
                  TPM at Microsoft Azure, where I keep cloud infrastructure
                  reliable for 135M weekly users. Built on a software engineering
                  foundation at Salesforce and Capital One, and a
                  CS&nbsp;+&nbsp;Statistics degree from Columbia Barnard.
                  I believe the best PMs never stop reading the code.
                </p>
              </div>
            </div>
          </div>
        </HeroReveal>

        {/* Experience section */}
        <Reveal>
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-amber-100 dark:border-amber-950 shadow-sm dark:shadow-black/20 overflow-hidden mb-4">
            <div className="px-5 sm:px-8 pt-6 pb-2 border-b border-amber-50 dark:border-amber-950">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 dark:text-amber-500">
                Experience
              </p>
            </div>
            <div className="px-5 sm:px-8 divide-y divide-amber-50 dark:divide-amber-950">
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
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-amber-100 dark:border-amber-950 shadow-sm dark:shadow-black/20 overflow-hidden">
            <div className="px-5 sm:px-8 pt-6 pb-2 border-b border-amber-50 dark:border-amber-950">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 dark:text-amber-500">
                Education
              </p>
            </div>
            <div className="px-5 sm:px-8 divide-y divide-amber-50 dark:divide-amber-950">
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

// ── TikTok video carousel ─────────────────────────────────────────────────────
// Uses TikTok's public embed player — no API key required.
const FEATURED_VIDEOS = [
  '7640241221117562125',
  '7604124661743488270',
  '7610547152384822542',
  '7602792356059925774',
  '7492456252912569643',
  '7603211623867747598',
  '7617511729555098893',
];

const TIKTOK_EMBED_WIDTH = 325;
const TIKTOK_EMBED_HEIGHT = 575;

// Infinite scrolling marquee of TikTok embeds.
// Duplicates the list so the loop is seamless.
// Hover pauses the scroll so visitors can interact with a video.
function TikTokCarousel({ videoIds = FEATURED_VIDEOS }) {
  // Duplicate for seamless infinite loop
  const track = [...videoIds, ...videoIds];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: EASE }}
      className="overflow-hidden w-full"
    >
      <div
        className="tt-track flex gap-4"
        style={{ width: `calc(${track.length} * (${TIKTOK_EMBED_WIDTH}px + 16px))` }}
      >
        {track.map((id, i) => (
          <a
            key={`${id}-${i}`}
            href={`https://www.tiktok.com/@airwrecah/video/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 rounded-2xl overflow-hidden border border-violet-100 dark:border-violet-950 shadow-md dark:shadow-black/20 block"
            style={{ width: TIKTOK_EMBED_WIDTH }}
            onClick={(e) => e.preventDefault()} // let iframe handle interaction
          >
            <iframe
              src={`https://www.tiktok.com/embed/v2/${id}`}
              style={{ width: TIKTOK_EMBED_WIDTH, height: TIKTOK_EMBED_HEIGHT, display: 'block', border: 'none' }}
              allow="encrypted-media; picture-in-picture"
              scrolling="no"
              loading="lazy"
              allowFullScreen
              frameBorder="0"
              title={`TikTok ${i % videoIds.length + 1}`}
            />
          </a>
        ))}
      </div>
    </motion.div>
  );
}

// ── Twitter tweet carousel ────────────────────────────────────────────────────
// Ordered by engagement (likes + replies), most popular first.
const TWEET_IDS = [
  '1935560037717651868',
  '1892695508726296758',
  '1898625371098190263',
  '1941750861266551099',
  '1899152262251135053',
  '1896111308950601842',
  '1894807150087881156',
  '1915564965978923476',
  '1893016707599606187',
  '1897052947735044573',
  '1896796154966487266',
  '1895215030804832487',
  '1894628936547799549',
  '1894106286184100260',
  '1893867077326262745',
  '1893522220494004714',
  '1938098272385831417',
  '1904250402654089298',
  '1902050872072532047',
  '1899581109589172419',
  '1896445092959039656',
];

const TWEET_EMBED_WIDTH = 390;
const TWEET_EMBED_HEIGHT = 700;

// Infinite scrolling marquee of tweet embeds.
// Duplicates the list so the loop is seamless.
// Hover pauses the scroll so visitors can interact with a post.
function TwitterCarousel({ tweetIds = TWEET_IDS }) {
  const prefersDark = usePrefersDarkMode();
  const track = [...tweetIds, ...tweetIds];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: EASE }}
      className="overflow-hidden w-full"
    >
      <div
        className="tw-track flex gap-4"
        style={{ width: `calc(${track.length} * (${TWEET_EMBED_WIDTH}px + 16px))` }}
      >
        {track.map((id, i) => (
          <a
            key={`${id}-${i}`}
            href={`https://x.com/ericaachenn/status/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 rounded-2xl overflow-hidden border border-violet-100 dark:border-violet-950 shadow-md dark:shadow-black/20 block"
            style={{ width: TWEET_EMBED_WIDTH }}
            onClick={(e) => e.preventDefault()}
          >
            <iframe
              src={`https://platform.twitter.com/embed/Tweet.html?id=${id}&theme=${prefersDark ? 'dark' : 'light'}&dnt=true&conversation=none&cards=hidden&align=center`}
              style={{
                width: TWEET_EMBED_WIDTH,
                height: TWEET_EMBED_HEIGHT,
                display: 'block',
                border: 'none',
              }}
              scrolling="no"
              loading="lazy"
              allowFullScreen
              title={`Tweet ${i % tweetIds.length + 1}`}
            />
          </a>
        ))}
      </div>
    </motion.div>
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
      className="relative group aspect-[9/16] rounded-xl overflow-hidden bg-violet-50 dark:bg-violet-950/60 block"
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
      <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-950 flex items-center justify-center text-3xl mb-4">
        {platform === 'tiktok' ? '🎵' : '📸'}
      </div>
      <p className="text-violet-800 dark:text-violet-100 font-medium mb-1">
        {platform === 'tiktok' ? 'TikTok' : 'Instagram'} not connected yet
      </p>
      <p className="text-violet-400 dark:text-violet-300 text-sm mb-4 max-w-xs">
        Follow the steps in <code className="bg-violet-50 dark:bg-violet-950 px-1 rounded">SETUP.md</code> to add your API tokens, then{' '}
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
  return (
    <div>
      {/* Hero */}
      <HeroReveal className="mb-5">
        <div className="bg-violet-50 dark:bg-violet-950/35 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-violet-100 dark:border-violet-900">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-violet-200 dark:bg-violet-900 flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0">
              🎬
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-violet-900 dark:text-violet-100 mb-2">
                somewhere on the internet ✶
              </h2>
            </div>
          </div>
        </div>
      </HeroReveal>

      {/* ── TikTok ── */}
      <Reveal className="mb-5">
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-6 border border-violet-100 dark:border-violet-950 shadow-sm dark:shadow-black/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-violet-800 dark:text-violet-100 text-sm sm:text-base">🎵 TikTok</h3>
            <a
              href="https://tiktok.com/@airwrecah"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 dark:text-violet-300 text-xs hover:text-violet-600 dark:hover:text-violet-100 transition-colors"
            >
              @airwrecah →
            </a>
          </div>
          <TikTokCarousel />
        </div>
      </Reveal>

      {/* ── Twitter ── */}
      <Reveal>
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-6 border border-violet-100 dark:border-violet-950 shadow-sm dark:shadow-black/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-violet-800 dark:text-violet-100 text-sm sm:text-base">𝕏 Twitter</h3>
            <a
              href="https://x.com/ericaachenn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 dark:text-violet-300 text-xs hover:text-violet-600 dark:hover:text-violet-100 transition-colors"
            >
              @ericaachenn →
            </a>
          </div>
          <TwitterCarousel />
        </div>
      </Reveal>
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
    subBg: 'bg-rose-50 dark:bg-rose-950/30',
    subBorder: 'border-rose-100 dark:border-rose-950',
    subText: 'text-rose-400 dark:text-rose-300',
    subTagline: 'text-rose-300 dark:text-rose-400',
  },
  {
    id: 'second',
    emoji: '✨',
    label: 'Second Space',
    sub: 'work & study',
    tagline: "what i've learned and where i've been",
    activeBg: 'bg-amber-500',
    subBg: 'bg-amber-50 dark:bg-amber-950/30',
    subBorder: 'border-amber-100 dark:border-amber-950',
    subText: 'text-amber-400 dark:text-amber-300',
    subTagline: 'text-amber-300 dark:text-amber-400',
  },
  {
    id: 'third',
    emoji: '🎬',
    label: 'Third Space',
    sub: 'online & out there',
    tagline: 'where i show up for a wider world',
    activeBg: 'bg-violet-500',
    subBg: 'bg-violet-50 dark:bg-violet-950/30',
    subBorder: 'border-violet-100 dark:border-violet-950',
    subText: 'text-violet-400 dark:text-violet-300',
    subTagline: 'text-violet-300 dark:text-violet-400',
  },
];

// ─── PAGE ───────────────────────────────────────────────────────────────────
export default function Home() {
  const [active, setActive] = useState('first');
  const current = TABS.find((t) => t.id === active);
  const cursorClass = active === 'first'
    ? 'cursor-airplane'
    : active === 'second'
      ? 'cursor-book'
      : 'cursor-camera';

  return (
    <div className={`min-h-screen bg-stone-50 dark:bg-stone-950 ${cursorClass}`}>

      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-100 dark:border-stone-800">
        <div className={`${container} py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4`}>
          <div className="flex-shrink-0">
            <h1 className="font-semibold text-stone-800 dark:text-stone-100 text-base sm:text-lg leading-tight">
              Erica Chen
            </h1>
            <p className="text-stone-400 dark:text-stone-500 text-xs">three spaces · one person</p>
          </div>

          <nav className="flex gap-1.5 sm:ml-auto overflow-x-auto pb-0.5 sm:pb-0 no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  active === tab.id
                    ? `${tab.activeBg} text-white`
                    : 'text-stone-500 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
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
      <footer className="border-t border-stone-100 dark:border-stone-800">
        <div className={`${container} py-6 text-center text-stone-400 dark:text-stone-500 text-xs`}>
          made with 🤍 · erica chen · {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
