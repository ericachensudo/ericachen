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

// ─── PLACES MAP ──────────────────────────────────────────────────────────────
const MAP_TABS = [
  { id: 'nyc',       emoji: '🗽', name: 'NYC',         mid: '1dbvFRxSDqDevDRlGx3rxi40wL7dvA84' },
  { id: 'pr',        emoji: '🌴', name: 'Puerto Rico', mid: '1icBup8BL9rA6TERHw3p8FHX5WDrMOrM' },
  { id: 'hawaii',    emoji: '🌺', name: 'Hawaii',      mid: '1hJvs6LUrHri7-1qlNNZOsdKokraoI8w' },
  { id: 'barcelona', emoji: '🇪🇸', name: 'Barcelona', mid: '1lRheNrPqX4CH1rMFg-oLg70v9YUqqEQ' },
  { id: 'mexico',    emoji: '🇲🇽', name: 'Mexico',    mid: '1ND0Bd8WQvY5byZT4h6e7Mh37PZS_1r4' },
  { id: 'taiwan',    emoji: '🇹🇼', name: 'Taiwan',    mid: '1OoskUz1mWLTGb8cwTisWWSKAZ_O2R9o' },
  { id: 'paris',     emoji: '🗼',  name: 'Paris',     mid: '15MiHjNGdIoT94uhCyL92uVWz0HYBYps' },
  { id: 'amsterdam', emoji: '🌷', name: 'Amsterdam', mid: '1T0tr5uquuFWoNMb86H7KEDwZIDeUuFs' },
];

function PlacesMap() {
  const [active, setActive] = useState('nyc');
  const tab = MAP_TABS.find((t) => t.id === active);
  const activeIdx = MAP_TABS.findIndex((t) => t.id === active);

  return (
    <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-5 pb-2 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-rose-800 text-sm sm:text-base">My places 📍</h3>
          <p className="text-rose-400 text-xs mt-0.5">Spots I keep coming back to</p>
        </div>
        <a
          href={`https://www.google.com/maps/d/viewer?mid=${tab.mid}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-rose-400 text-xs hover:text-rose-600 transition-colors"
        >
          Open →
        </a>
      </div>

      {/* Timeline pin selector — horizontally scrollable */}
      <div className="pt-4 pb-6 overflow-x-auto no-scrollbar">
        <div className="relative flex items-start px-8 min-w-max gap-10">

          {/* Dashed route line */}
          <div className="absolute top-5 left-8 right-8 flex items-center">
            <div className="w-full border-t-2 border-dashed border-rose-200" />
          </div>

          {/* Progress fill up to active pin */}
          <div
            className="absolute top-5 left-8 h-0.5 bg-rose-400 transition-all duration-500"
            style={{ width: `calc(${(activeIdx / (MAP_TABS.length - 1)) * 100}% - 2rem)` }}
          />

          {MAP_TABS.map((t, i) => {
            const isActive = t.id === active;
            const isPast   = i < activeIdx;
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className="relative z-10 flex flex-col items-center gap-2 group flex-shrink-0"
              >
                {/* Emoji floats above the pin */}
                <motion.span
                  animate={{ scale: isActive ? 1.2 : 1, y: isActive ? -2 : 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="text-xl leading-none"
                >
                  {t.emoji}
                </motion.span>

                {/* Pin dot */}
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.35 : 1,
                      backgroundColor: isActive || isPast ? '#f43f5e' : '#fff',
                      borderColor: isActive || isPast ? '#f43f5e' : '#fecdd3',
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                  />
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-rose-400 opacity-40 animate-ping" />
                  )}
                </div>

                {/* City name */}
                <span className={`text-xs font-medium transition-colors duration-200 ${
                  isActive ? 'text-rose-600' : 'text-rose-300 group-hover:text-rose-400'
                }`}>
                  {t.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map iframe */}
      <div className="px-4 sm:px-6 pb-5">
        <AnimatePresence mode="wait">
          <motion.iframe
            key={tab.mid}
            src={`https://www.google.com/maps/d/embed?mid=${tab.mid}&ehbc=2E312F`}
            className="w-full rounded-2xl border border-rose-100"
            style={{ height: 'clamp(300px, 45vw, 480px)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={tab.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE }}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

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
                Welcome to my little corner of the internet. I'm playing around
                with the idea of first space, second space, and third space online
                and figuring out what it means to share this part of my life with
                the world.
              </p>
            </div>
          </div>
        </div>
      </HeroReveal>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-5">
        {[
          {
            title: 'Things I love ❤️',
            body: (
              <ul className="space-y-2 text-sm text-rose-700">
                {[
                  '🍽️ Never eating at the same restaurant twice',
                  '📷 Polaroids & candid film photography',
                  '✈️ Solo travel & city-hopping',
                  '🀄 Hosting Mahjong & Catan nights',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ),
          },
          {
            title: 'Home base 🏡',
            body: (
              <>
                <p className="text-rose-500 text-xs mb-2">New York · Seattle · San Francisco</p>
                <p className="text-rose-700 text-sm leading-relaxed">
                  I've spent at least a year in Seattle, San Francisco, and New York
                  and I've taken a piece of each city with me everywhere I go. There's
                  something special about how a place can shape you, change you, and
                  help you grow into who you're becoming. It all started in Queens.
                </p>
              </>
            ),
          },
          {
            title: 'Right now 🌱',
            body: (
              <p className="text-rose-700 text-sm leading-relaxed">
                Growing my Polaroid collection, planning my next solo trip,
                and always scouting the next restaurant nobody's heard of yet.
              </p>
            ),
            xlOnly: true,
          },
        ].map((card, i) => (
          <Reveal key={i} delay={i * 0.08} className={card.xlOnly ? 'hidden xl:block' : ''}>
            <div className="h-full bg-white rounded-2xl p-4 sm:p-6 border border-rose-100 shadow-sm">
              <h3 className="font-semibold text-rose-800 mb-3 text-sm sm:text-base">{card.title}</h3>
              {card.body}
            </div>
          </Reveal>
        ))}
      </div>

      {/* ── My places map ── */}
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
    title: 'Technical Program Manager II',
    company: 'Microsoft',
    location: 'Redmond, WA · Azure Core – Compute Control Plane',
    period: 'Nov 2024 – Present',
    desc: 'Owns Azure VM provisioning quality at 135M-user scale, delivering 99.99% Linux success rates and a 50% boot-time reduction by driving cross-functional test strategy and automating incident-response pipelines across Networking, Storage, and Compute.',
    photo: null,
    accent: '#fef3c7',
  },
  {
    title: 'Product Manager',
    company: 'Microsoft',
    location: 'Redmond, WA · Azure Core – Customer Supportability',
    period: 'May 2024 – Aug 2024',
    desc: 'Defined product requirements and QA strategy for a quality tooling platform serving 15,000+ Azure Core stakeholders, designing a three-phase iterative feedback system that translated user pain points directly into test prioritization.',
    photo: null,
    accent: '#fde68a',
  },
  {
    title: 'Software Engineering Intern',
    company: 'Salesforce',
    location: 'San Francisco, CA · Tableau Dashboard AI Team',
    period: 'May 2023 – Aug 2023',
    desc: 'Cut Tableau API latency by 50% (3s → 1.5s) for 150,000+ customers by applying Chain-of-Thought prompt engineering to resolve performance regressions, then shipped a Connect API integration with end-to-end cross-functional test coverage.',
    photo: null,
    accent: '#fcd34d',
  },
  {
    title: 'Software Engineering Intern',
    company: 'Capital One',
    location: 'McLean, VA · Auto Loan Team',
    period: 'Jun 2022 – Aug 2022',
    desc: 'Rebuilt the auto loan reporting pipeline with FastAPI, cutting generation time from hours to seconds and saving 8 to 12 agent labor hours per cycle, then shipped a full-stack React analytics dashboard to surface real-time data quality signals.',
    photo: null,
    accent: '#fed7aa',
  },
  {
    title: 'Technical Product Manager',
    company: 'OroXYZ',
    location: 'New York, NY · Pre-Seed Startup @ Columbia Business School',
    period: 'Jan 2023 – May 2023',
    desc: 'Drove product roadmap and cross-functional execution for a blockchain-and-Stripe-integrated platform, from UI feature prioritization through authoring technical documentation that enabled partner onboarding during early user trials.',
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
                  TPM II at Microsoft Azure, where I keep cloud infrastructure
                  reliable for 135M weekly users. Built on a software engineering
                  foundation at Salesforce and Capital One, and a 3.9 GPA
                  CS&nbsp;+&nbsp;Statistics degree from Columbia Barnard.
                  I believe the best PMs never stop reading the code.
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
      <div className="tt-track flex gap-4" style={{ width: `calc(${track.length} * (220px + 16px))` }}>
        {track.map((id, i) => (
          <a
            key={`${id}-${i}`}
            href={`https://www.tiktok.com/@airwrecah/video/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 rounded-2xl overflow-hidden border border-violet-100 shadow-md block"
            style={{ width: 220 }}
            onClick={(e) => e.preventDefault()} // let iframe handle interaction
          >
            <iframe
              src={`https://www.tiktok.com/embed/v2/${id}`}
              style={{ width: 220, height: 390, display: 'block' }}
              allow="encrypted-media; picture-in-picture"
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
  const [igData, setIgData] = useState(null);
  const [igError, setIgError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/instagram')
      .then((r) => r.json())
      .catch(() => ({ error: 'fetch failed' }))
      .then((ig) => {
        if (ig.error) setIgError(ig.error);
        else setIgData(ig.media ?? []);
        setLoading(false);
      });
  }, []);

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
                somewhere on the internet ✶
              </h2>
              <p className="text-violet-700 leading-relaxed text-sm sm:text-base">
                One of my first videos was a high school welcome video I
                produced for the class of 2020. Something about it stuck.
                <br /><br />
                Your first space is home. Your second space is work. Your
                third space is where you go to just exist. For me that's here.
                The internet is my third space and I'm still figuring out
                what that means.
              </p>
            </div>
          </div>
        </div>
      </HeroReveal>

      {/* ── TikTok ── */}
      <Reveal className="mb-5">
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-violet-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-violet-800 text-sm sm:text-base">🎵 TikTok</h3>
            <a
              href="https://tiktok.com/@airwrecah"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 text-xs hover:text-violet-600 transition-colors"
            >
              @airwrecah →
            </a>
          </div>
          <TikTokCarousel />
        </div>
      </Reveal>

      {/* ── Instagram ── */}
      <Reveal>
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-violet-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-violet-800 text-sm sm:text-base">📸 Instagram</h3>
            <a
              href="https://instagram.com/airwrecah"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 text-xs hover:text-violet-600 transition-colors"
            >
              @airwrecah →
            </a>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square" />
              ))}
            </div>
          ) : igError ? (
            <a
              href="https://instagram.com/airwrecah"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center py-12 gap-4 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 via-pink-400 to-amber-400 flex items-center justify-center text-white text-2xl shadow-md group-hover:scale-105 transition-transform duration-300">
                📸
              </div>
              <div className="text-center">
                <p className="text-violet-800 font-medium text-sm">@airwrecah</p>
                <p className="text-violet-400 text-xs mt-0.5">View on Instagram →</p>
              </div>
            </a>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {igData.map((item, i) => (
                <IgTile key={item.id} item={item} index={i} />
              ))}
            </div>
          )}
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
