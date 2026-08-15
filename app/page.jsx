'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';

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

const FRIDGE_STICKERS = [
  { id: 'nyc', label: 'NYC', detail: 'home', className: 'fridge-sticker fridge-sticker-nyc', rotate: -10 },
  { id: 'postcard', label: 'AIR MAIL', detail: 'somewhere new', className: 'fridge-sticker fridge-sticker-postcard', rotate: 7 },
  { id: 'flower', label: '✿', detail: '', className: 'fridge-sticker fridge-sticker-flower', rotate: 12 },
  { id: 'mahjong', label: '發', detail: 'mahjong night', className: 'fridge-sticker fridge-sticker-mahjong', rotate: -6 },
  { id: 'note', label: 'don’t forget', detail: 'to make things', className: 'fridge-sticker fridge-sticker-note', rotate: 4 },
];

function RefrigeratorLanding() {
  const sceneRef = useRef(null);
  const fridgeRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ['start start', 'end end'],
  });
  const doorRotate = useTransform(scrollYProgress, [0, 0.68, 1], [0, 54, 72]);
  const doorX = useTransform(scrollYProgress, [0, 0.68, 1], ['0%', '0%', '-14%']);
  const doorOpacity = useTransform(scrollYProgress, [0, 0.72, 1], [1, 1, 0]);
  const doorPointerEvents = useTransform(scrollYProgress, (progress) => progress > 0.96 ? 'none' : 'auto');
  const stagePointerEvents = useTransform(scrollYProgress, (progress) => progress > 0.72 ? 'none' : 'auto');
  const doorShadow = useTransform(scrollYProgress, [0, 0.65, 1], [0, 0.25, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section ref={sceneRef} className="fridge-scene" aria-label="Introduction">
      <motion.div className="fridge-stage" style={{ pointerEvents: stagePointerEvents }}>
        <div className="fridge-reveal" aria-hidden="true" />

        <motion.div
          className="fridge-door"
          style={{
            rotateY: reduceMotion ? 0 : doorRotate,
            x: reduceMotion ? 0 : doorX,
            opacity: reduceMotion ? 1 : doorOpacity,
            pointerEvents: reduceMotion ? 'auto' : doorPointerEvents,
            '--door-shadow-opacity': reduceMotion ? 0 : doorShadow,
          }}
        >
          <div className="fridge-handle" aria-hidden="true" />
          <div ref={fridgeRef} className="fridge-canvas">
            <motion.article
              initial={{ opacity: 0, y: 24, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="fridge-polaroid"
            >
              <div className="fridge-photo">
                <Image
                  src="/erica-hot-air-balloons.jpeg"
                  alt="Erica standing in front of hot air balloons"
                  fill
                  priority
                  sizes="(max-width: 640px) 55vw, 390px"
                />
              </div>
              <div className="fridge-bio">
                <h1>Hi, my name is Erica.</h1>
                <p>
                  I was born and raised in Elmhurst, Queens, and have lived across New York
                  City, Seattle, and San Francisco. I’m usually chasing a new restaurant,
                  collecting Polaroids, planning solo trips, or hosting Mahjong and Catan nights.
                </p>
              </div>
            </motion.article>

            {FRIDGE_STICKERS.map((sticker, index) => (
              <motion.button
                key={sticker.id}
                type="button"
                drag
                dragConstraints={fridgeRef}
                dragElastic={0.08}
                dragMomentum={false}
                whileHover={{ scale: 1.05 }}
                whileDrag={{ scale: 1.08, rotate: 0, zIndex: 30 }}
                initial={{ opacity: 0, scale: 0.7, rotate: sticker.rotate }}
                animate={{ opacity: 1, scale: 1, rotate: sticker.rotate }}
                transition={{ delay: 0.25 + index * 0.1, duration: 0.5, ease: EASE }}
                className={sticker.className}
                aria-label={`Drag ${sticker.label} sticker`}
              >
                <span>{sticker.label}</span>
                {sticker.detail && <small>{sticker.detail}</small>}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div className="fridge-scroll-hint" style={{ opacity: hintOpacity }} aria-hidden="true">
          <span>scroll</span>
          <span>↓</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

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

// ─── TRAVEL TIMELINE ─────────────────────────────────────────────────────────
const MAP_TABS = [
  { id: 'hawaii',    emoji: '🌺', name: 'Hawaii',      year: '2022', mid: '1hJvs6LUrHri7-1qlNNZOsdKokraoI8w' },
  { id: 'pr',        emoji: '🌴', name: 'Puerto Rico', year: '2024', mid: '1icBup8BL9rA6TERHw3p8FHX5WDrMOrM' },
  { id: 'london',    emoji: '🎡', name: 'London',      year: '2025', mid: '1LIpFUbZBiUrVSZrg6DI2YRZ_qzMwnHs' },
  { id: 'amsterdam', emoji: '🌷', name: 'Amsterdam',   year: '2025', mid: '1T0tr5uquuFWoNMb86H7KEDwZIDeUuFs' },
  { id: 'paris',     emoji: '🗼', name: 'Paris',       year: '2025', mid: '15MiHjNGdIoT94uhCyL92uVWz0HYBYps' },
  { id: 'barcelona', emoji: '🇪🇸', name: 'Barcelona', year: '2026', mid: '1lRheNrPqX4CH1rMFg-oLg70v9YUqqEQ' },
  { id: 'madrid',    emoji: '🇪🇸', name: 'Madrid',    year: '2026', mid: '1yfpGj5cwwnKP1Zgyr6ac9ewPtDboGOU' },
  { id: 'mexico',    emoji: '🇲🇽', name: 'Mexico',    year: '2026', mid: '1ND0Bd8WQvY5byZT4h6e7Mh37PZS_1r4' },
  { id: 'taiwan',    emoji: '🇹🇼', name: 'Taiwan',    year: '2026', mid: '1OoskUz1mWLTGb8cwTisWWSKAZ_O2R9o' },
  { id: 'vietnam',   emoji: '🇻🇳', name: 'Vietnam',   year: '2026', mid: '17Rj0zq7sUalYA0VHn3frahJceE9FfNQ' },
];

function PlacesMap() {
  const [activeId, setActiveId] = useState(MAP_TABS[0].id);
  const activePlace = MAP_TABS.find((place) => place.id === activeId);

  // Track which years have already been shown
  const shownYears = new Set();

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.72fr)] lg:items-start">
      <div className="lg:sticky lg:top-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePlace.mid}
            className="mymaps-crop-shell home-map-square mx-auto rounded-xl shadow-md dark:shadow-black/30"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <iframe
              src={`https://www.google.com/maps/d/embed?mid=${activePlace.mid}&ehbc=2E312F`}
              className="mymaps-crop-frame"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={activePlace.name}
            />
          </motion.div>
        </AnimatePresence>
        <div className="mt-3 flex items-center justify-center gap-3 text-center">
          <p className="text-sm font-semibold text-pink-800 dark:text-pink-100">
            {activePlace.emoji} {activePlace.name}
          </p>
          <a
            href={`https://www.google.com/maps/d/viewer?mid=${activePlace.mid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-pink-700 underline-offset-4 hover:underline dark:text-pink-300"
          >
            Open map
          </a>
        </div>
      </div>

      <div className="relative rounded-2xl border border-pink-100 bg-white py-3 shadow-sm dark:border-pink-950 dark:bg-stone-900 dark:shadow-black/20">
        <div className="absolute bottom-4 left-[4.45rem] top-4 w-0.5 bg-pink-100 dark:bg-pink-950" />
        {MAP_TABS.map((place) => {
          const isActive = activeId === place.id;
          const showYear = place.year && !shownYears.has(place.year);
          if (place.year) shownYears.add(place.year);

          return (
            <button
              key={place.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveId(place.id)}
              className={`relative flex min-h-14 w-full items-center gap-3 px-4 py-2 text-left transition-colors ${
                isActive
                  ? 'bg-pink-50 text-pink-800 dark:bg-pink-950/50 dark:text-pink-100'
                  : 'text-pink-700 hover:bg-pink-50/60 dark:text-pink-200 dark:hover:bg-pink-950/30'
              }`}
            >
              <span className="w-9 flex-shrink-0 text-right text-xs font-semibold tabular-nums text-pink-700 dark:text-pink-300">
                {showYear ? place.year : ''}
              </span>
              <span className={`relative z-10 grid h-6 w-6 flex-shrink-0 place-items-center rounded-full border-2 text-[11px] ${
                isActive
                  ? 'border-pink-500 bg-pink-500 text-white'
                  : 'border-pink-300 bg-white text-pink-500 dark:border-pink-700 dark:bg-stone-900'
              }`}>
                {isActive ? '✈' : ''}
              </span>
              <span className="text-lg leading-none">{place.emoji}</span>
              <span className="text-sm font-medium">{place.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── FIRST SPACE ─── home & heart ──────────────────────────────────────────
function FirstSpace() {

  return (
    <div>
      {/* ── Travel timeline ── */}
      <Reveal>
        <PlacesMap />
      </Reveal>
    </div>
  );
}

// ─── SECOND SPACE ─── work & study ─────────────────────────────────────────

const EXPERIENCE = [
  {
    title: 'Technical Program Manager',
    company: 'Microsoft',
    location: 'Redmond, WA · Azure Core – Compute Control Plane',
    period: 'Nov 2024 – Present',
    logo: '/logos/microsoft.png',
    logoLabel: 'MS',
  },
  {
    title: 'Product Manager',
    company: 'Microsoft',
    location: 'Redmond, WA · Azure Core – Customer Supportability',
    period: 'May 2024 – Aug 2024',
    logo: '/logos/microsoft.png',
    logoLabel: 'MS',
  },
  {
    title: 'Software Engineering Intern · Full-time',
    company: 'Salesforce',
    location: 'San Francisco, CA · Tableau Dashboard AI Team',
    period: 'May 2023 – Aug 2023',
    logo: '/logos/salesforce.png',
    logoLabel: 'SF',
  },
  {
    title: 'Software Engineering Intern',
    company: 'Capital One',
    location: 'McLean, VA · Auto Loan Team',
    period: 'Jun 2022 – Aug 2022',
    logo: '/logos/capital-one.png',
    logoLabel: 'C1',
  },
  {
    title: 'Technical Product Manager',
    company: 'OroXYZ',
    location: 'New York, NY · Pre-Seed Startup @ Columbia Business School',
    period: 'Jan 2023 – May 2023',
    logo: '/logos/columbia-business-school.png',
    logoLabel: 'CBS',
  },
];

const EDUCATION = [
  {
    degree: 'M.S. Computer Science',
    school: 'Georgia Institute of Technology',
    period: 'In progress',
    logo: '/logos/georgia-tech.png',
    logoLabel: 'GT',
  },
  {
    degree: 'B.A. Computer Science & Statistics',
    school: 'Columbia University, Barnard College',
    period: 'Sept 2020 – May 2024',
    note: '3.9 GPA · McDonald\'s Multi-Year Academic Scholarship · Election Day translator in Mandarin (native) and Spanish.',
    logo: '/logos/barnard.png',
    logoLabel: 'BC',
  },
];

function LogoExperienceGrid({ items, activeId, setActiveId }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {items.map((item, index) => {
        const itemId = `${(item.company ?? item.school).replaceAll(' ', '-').toLowerCase()}-${index}`;
        const isActive = activeId === itemId;
        const align = index === 0 ? 'left-0' : index === items.length - 1 ? 'right-0' : 'left-1/2 -translate-x-1/2';

        return (
          <motion.div
            key={itemId}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.06, ease: EASE }}
            className="relative"
            onMouseEnter={() => setActiveId(itemId)}
            onMouseLeave={() => setActiveId(null)}
          >
            <button
              type="button"
              aria-label={`${item.company ?? item.school}: ${item.title ?? item.degree}`}
              aria-expanded={isActive}
              aria-controls={`${itemId}-details`}
              onFocus={() => setActiveId(itemId)}
              onBlur={() => setActiveId(null)}
              onClick={() => setActiveId(itemId)}
              className={`group mx-auto w-full max-w-36 aspect-square px-3 py-4 flex flex-col items-center justify-center gap-3 rounded-full border bg-white dark:bg-stone-900 transition-all duration-200 ${
                isActive
                  ? 'border-pink-400 dark:border-pink-500 shadow-lg -translate-y-1'
                  : 'border-pink-100 dark:border-pink-950 shadow-sm hover:border-pink-300 dark:hover:border-pink-700 hover:-translate-y-1'
              }`}
            >
              <span className="relative flex h-14 w-full items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.logo}
                  alt=""
                  className="max-h-12 max-w-[7rem] object-contain"
                  onError={(event) => {
                    event.currentTarget.classList.add('hidden');
                    event.currentTarget.nextElementSibling?.classList.remove('hidden');
                    event.currentTarget.nextElementSibling?.classList.add('flex');
                  }}
                />
                <span className="absolute inset-0 hidden items-center justify-center text-sm font-bold text-pink-800 dark:text-pink-200">
                  {item.logoLabel}
                </span>
              </span>
              <span className="text-xs font-medium text-stone-700 dark:text-stone-200 text-center">
                {item.company ?? item.school}
              </span>
            </button>

            <AnimatePresence>
              {isActive && (
                <motion.div
                  id={`${itemId}-details`}
                  role="tooltip"
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: EASE }}
                  style={{ width: 'min(18rem, calc(100vw - 3rem))' }}
                  className={`absolute ${align} top-[calc(100%+10px)] z-30 rounded-lg border border-pink-100 dark:border-pink-900 bg-white dark:bg-stone-900 p-4 text-left shadow-xl`}
                >
                  <p className="text-xs font-semibold uppercase text-pink-600 dark:text-pink-300 tabular-nums">
                    {item.period}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-stone-900 dark:text-stone-100">
                    {item.title ?? item.degree}
                  </h3>
                  <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
                    {item.company ?? item.school}
                  </p>
                  {item.location && <p className="mt-2 text-xs leading-relaxed text-stone-500 dark:text-stone-400">{item.location}</p>}
                  {item.note && <p className="mt-2 text-xs leading-relaxed text-stone-500 dark:text-stone-400">{item.note}</p>}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

function SecondSpace() {
  const [activeResumeItem, setActiveResumeItem] = useState(null);

  return (
    <div>
        {/* Experience section */}
        <Reveal>
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-pink-100 dark:border-pink-950 shadow-sm dark:shadow-black/20 mb-4">
            <div className="px-5 sm:px-8 pt-6 pb-2 border-b border-pink-50 dark:border-pink-950">
              <p className="text-xs font-semibold uppercase tracking-widest text-pink-700 dark:text-pink-300">
                Experience
              </p>
            </div>
            <div className="px-5 sm:px-8 py-6 sm:py-8">
              <LogoExperienceGrid items={EXPERIENCE} activeId={activeResumeItem} setActiveId={setActiveResumeItem} />
            </div>
          </div>
        </Reveal>

        {/* Education section */}
        <Reveal delay={0.1}>
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-pink-100 dark:border-pink-950 shadow-sm dark:shadow-black/20">
            <div className="px-5 sm:px-8 pt-6 pb-2 border-b border-pink-50 dark:border-pink-950">
              <p className="text-xs font-semibold uppercase tracking-widest text-pink-700 dark:text-pink-300">
                Education
              </p>
            </div>
            <div className="px-5 sm:px-8 py-6 sm:py-8">
              <LogoExperienceGrid items={EDUCATION} activeId={activeResumeItem} setActiveId={setActiveResumeItem} />
            </div>
          </div>
        </Reveal>
    </div>
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
            className="flex-shrink-0 rounded-2xl overflow-hidden border border-pink-100 dark:border-pink-950 shadow-md dark:shadow-black/20 block"
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
            className="flex-shrink-0 rounded-2xl overflow-hidden border border-pink-100 dark:border-pink-950 shadow-md dark:shadow-black/20 block"
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
      className="relative group aspect-[9/16] rounded-xl overflow-hidden bg-pink-50 dark:bg-pink-950/60 block"
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
      <div className="w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-950 flex items-center justify-center text-3xl mb-4">
        {platform === 'tiktok' ? '🎵' : '📸'}
      </div>
      <p className="text-pink-800 dark:text-pink-100 font-medium mb-1">
        {platform === 'tiktok' ? 'TikTok' : 'Instagram'} not connected yet
      </p>
      <p className="text-pink-700 dark:text-pink-200 text-sm mb-4 max-w-xs">
        Follow the steps in <code className="bg-pink-50 dark:bg-pink-950 px-1 rounded">SETUP.md</code> to add your API tokens, then{' '}
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
      {/* ── TikTok ── */}
      <Reveal className="mb-5">
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-6 border border-pink-100 dark:border-pink-950 shadow-sm dark:shadow-black/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-pink-800 dark:text-pink-100 text-sm sm:text-base">🎵 TikTok</h3>
            <a
              href="https://tiktok.com/@airwrecah"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-700 dark:text-pink-200 text-xs hover:text-pink-800 dark:hover:text-pink-100 transition-colors"
            >
              @airwrecah →
            </a>
          </div>
          <TikTokCarousel />
        </div>
      </Reveal>

      {/* ── Twitter ── */}
      <Reveal>
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-6 border border-pink-100 dark:border-pink-950 shadow-sm dark:shadow-black/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-pink-800 dark:text-pink-100 text-sm sm:text-base">𝕏 Twitter</h3>
            <a
              href="https://x.com/ericaachenn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-700 dark:text-pink-200 text-xs hover:text-pink-800 dark:hover:text-pink-100 transition-colors"
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
    activeBg: 'bg-pink-600',
    subBg: 'bg-pink-50 dark:bg-pink-950/30',
    subBorder: 'border-pink-100 dark:border-pink-950',
    subText: 'text-pink-700 dark:text-pink-200',
    subTagline: 'text-pink-700 dark:text-pink-300',
  },
  {
    id: 'second',
    emoji: '✨',
    label: 'Second Space',
    sub: 'work & study',
    tagline: "what i've learned and where i've been",
    activeBg: 'bg-pink-700',
    subBg: 'bg-pink-50 dark:bg-pink-950/30',
    subBorder: 'border-pink-100 dark:border-pink-950',
    subText: 'text-pink-700 dark:text-pink-200',
    subTagline: 'text-pink-700 dark:text-pink-300',
  },
  {
    id: 'third',
    emoji: '🎬',
    label: 'Third Space',
    sub: 'online & out there',
    tagline: 'where i show up for a wider world',
    activeBg: 'bg-pink-800',
    subBg: 'bg-pink-50 dark:bg-pink-950/30',
    subBorder: 'border-pink-100 dark:border-pink-950',
    subText: 'text-pink-700 dark:text-pink-200',
    subTagline: 'text-pink-700 dark:text-pink-300',
  },
];

const SITE_IN_PROGRESS = true;

function WorkInProgress() {
  const fridgeRef = useRef(null);

  return (
    <main className="work-in-progress-fridge relative h-svh overflow-hidden" aria-label="Work in progress">
      <div className="fridge-door" style={{ '--door-shadow-opacity': 0 }}>
        <div className="fridge-handle" aria-hidden="true" />
        <div ref={fridgeRef} className="fridge-canvas">
          <article className="fridge-polaroid">
            <div className="fridge-photo">
              <Image
                src="/erica-hot-air-balloons.jpeg"
                alt="Erica standing in front of hot air balloons"
                fill
                priority
                sizes="(max-width: 640px) 55vw, 390px"
              />
            </div>
            <div className="fridge-bio">
              <p className="mb-1 text-pink-700">Work in progress</p>
              <h1>Something thoughtful is taking shape.</h1>
              <p>Check back soon.</p>
            </div>
          </article>

          {FRIDGE_STICKERS.map((sticker) => (
            <motion.button
              key={sticker.id}
              type="button"
              drag
              dragConstraints={fridgeRef}
              dragElastic={0.08}
              dragMomentum={false}
              whileHover={{ scale: 1.05 }}
              whileDrag={{ scale: 1.08, rotate: 0, zIndex: 30 }}
              className={sticker.className}
              style={{ transform: `rotate(${sticker.rotate}deg)` }}
              aria-label={`Drag ${sticker.id === 'note' ? 'work in progress' : sticker.label} magnet`}
            >
              <span>{sticker.id === 'note' ? 'work in progress' : sticker.label}</span>
              <small>{sticker.id === 'note' ? 'check back soon' : sticker.detail}</small>
            </motion.button>
          ))}
        </div>
      </div>
    </main>
  );
}

// ─── PAGE ───────────────────────────────────────────────────────────────────
export default function Home() {
  const [active, setActive] = useState('landing');
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRefs = useRef({});
  const cursorClass = active === 'first'
    ? 'cursor-airplane'
    : active === 'second'
      ? 'cursor-book'
      : active === 'third'
        ? 'cursor-camera'
        : '';

  useEffect(() => {
    if (SITE_IN_PROGRESS) return undefined;

    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollable > 0 ? window.scrollY / scrollable : 0);

      const probe = window.scrollY + Math.min(window.innerHeight * 0.3, 240);
      const currentSection = [...TABS]
        .reverse()
        .find((tab) => sectionRefs.current[tab.id]?.offsetTop <= probe);
      setActive(currentSection?.id ?? 'landing');
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  function scrollToSpace(id) {
    setActive(id);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    sectionRefs.current[id]?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }

  if (SITE_IN_PROGRESS) return <WorkInProgress />;

  return (
    <div className={`min-h-screen bg-paper dark:bg-ink transition-colors duration-500 ${cursorClass}`}>

      <a href="#first-space" className="skip-link">Skip to First Space</a>

      <RefrigeratorLanding />

      {/* ── Sticky header ── */}
      <header className="site-header sticky top-0 z-20 bg-white/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-100 dark:border-stone-800">
        <div className={`${container} py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4`}>
          <div className="flex-shrink-0">
            <h1 className="font-semibold text-stone-800 dark:text-stone-100 text-base sm:text-lg leading-tight">
              Erica Chen
            </h1>
            <p className="text-stone-600 dark:text-stone-400 text-xs">three spaces · one person</p>
          </div>

          <nav aria-label="Spaces" className="flex gap-1.5 sm:ml-auto overflow-x-auto pb-0.5 sm:pb-0 no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-current={active === tab.id ? 'location' : undefined}
                onClick={() => scrollToSpace(tab.id)}
                className={`flex-shrink-0 min-w-11 min-h-11 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  active === tab.id
                    ? `${tab.activeBg} text-white`
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {tab.emoji}
                <span className="hidden sm:inline"> {tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="h-0.5 bg-stone-100/70 dark:bg-stone-800/70" aria-hidden="true">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-200 via-pink-400 to-pink-600 origin-left"
            style={{ scaleX: scrollProgress }}
          />
        </div>
      </header>

      {/* ── Content ── */}
      <main>
        {TABS.map((tab) => (
          <section
            id={`${tab.id}-space`}
            key={tab.id}
            ref={(node) => { sectionRefs.current[tab.id] = node; }}
            className={`space-section space-section-${tab.id}`}
            aria-labelledby={tab.id === 'second' ? `${tab.id}-space-label` : undefined}
            aria-label={tab.id !== 'second' ? `${tab.sub}: ${tab.tagline}` : undefined}
          >
            {tab.id === 'second' && (
              <div className={`space-banner border-b ${tab.subBorder}`}>
                <div className={`${container} py-4 sm:py-5`}>
                  <p id={`${tab.id}-space-label`} className={`text-sm font-medium ${tab.subText}`}>
                    {tab.emoji} {tab.sub}
                  </p>
                  <p className={`text-xs mt-0.5 ${tab.subTagline}`}>
                    {tab.tagline}
                  </p>
                </div>
              </div>
            )}
            <div className={`${container} py-8 sm:py-12 lg:py-16`}>
              {tab.id === 'first' && <FirstSpace />}
              {tab.id === 'second' && <SecondSpace />}
              {tab.id === 'third' && <ThirdSpace />}
            </div>
          </section>
        ))}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-stone-100 dark:border-stone-800">
        <div className={`${container} py-6 text-center text-stone-600 dark:text-stone-400 text-xs`}>
          made with 🤍 · erica chen · {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
