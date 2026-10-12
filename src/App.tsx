/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, useInView } from "motion/react";
import {
  ShieldCheck,
  GraduationCap,
  ArrowRight,
  MapPin,
  Award,
  HeartHandshake
} from "lucide-react";

import { ScrollProgressBar } from "./components/ui/ScrollProgressBar";
import { TiltCard } from "./components/ui/TiltCard";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Gallery from "./components/Gallery";
import LeadershipSection from "./components/LeadershipSection";
import FaqModal from "./components/FaqModal";
import AdmissionInquiryForm from "./components/AdmissionInquiryForm";
import Footer from "./components/Footer";
import CurriculumModal from "./components/CurriculumModal";
import SafetyMandateModal from "./components/SafetyMandateModal";
import InquiryModal from "./components/InquiryModal";
import StreamAdvisoryModal from "./components/StreamAdvisoryModal";
import AboutSchoolModal from "./components/AboutSchoolModal";
import WhyAmpsSection from "./components/WhyAmpsSection";
import NoticesSection from "./components/NoticesSection";

// Design System Foundations
import { AppSection } from "./components/layout/AppSection";
import { AppContainer } from "./components/layout/AppContainer";
import { Card } from "./components/ui/Card";
import { Button } from "./components/ui/Button";
import {
  sectionContainerVariants,
  childItemVariants,
  cardHoverProps,
  buttonPressProps,
  MotionDuration,
  MotionEase,
} from "./utils/motion";

// Reusable Count-Up Counter Component
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      let startTime: number | null = null;
      const duration = 1200; // 1.2s

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easeProgress = progress * (2 - progress); // easeOutQuad
        setCount(Math.floor(easeProgress * value));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };

      window.requestAnimationFrame(step);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// Helper function to render notice content in structured Text + Bulleted Points format
function renderFormattedNoticeContent(text: string) {
  if (!text) return null;

  const rawLines = text.split(/\n+/).map(l => l.trim()).filter(l => l.length > 0 && l !== "•");

  const introLines: string[] = [];
  const bulletLines: string[] = [];

  rawLines.forEach(line => {
    if (line.startsWith("•") || line.startsWith("-") || line.startsWith("*")) {
      bulletLines.push(line);
    } else {
      introLines.push(line);
    }
  });

  return (
    <div className="text-left mb-4 font-sans text-sm leading-relaxed text-muted-text">
      {introLines.map((intro, idx) => (
        <p key={idx} className="mb-3 text-slate-800 text-[13.5px] leading-snug font-medium">
          {intro}
        </p>
      ))}

      {bulletLines.length > 0 && (
        <ul className="space-y-2 text-slate-700 bg-amber-50/50 p-3.5 rounded-lg border border-amber-200/60 mt-2">
          {bulletLines.map((line, idx) => {
            const cleanLine = line.replace(/^[•\-\*]\s*/, "");
            const colonIdx = cleanLine.indexOf(":");
            if (colonIdx > 0 && colonIdx < 35) {
              const key = cleanLine.substring(0, colonIdx);
              const val = cleanLine.substring(colonIdx + 1);
              return (
                <li key={idx} className="flex items-start gap-2 text-[13px] font-sans">
                  <span className="text-brass-gold font-bold shrink-0 mt-0.5">•</span>
                  <span>
                    <strong className="text-ink-navy font-bold">{key}:</strong>
                    {val}
                  </span>
                </li>
              );
            }
            return (
              <li key={idx} className="flex items-start gap-2 text-[13px] font-sans">
                <span className="text-brass-gold font-bold shrink-0 mt-0.5">•</span>
                <span>{cleanLine}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// Lazy load AdminPanel
const AdminPanel = React.lazy(() => import("./components/AdminPanel"));

export default function App() {
  const [logoError, setLogoError] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<any>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isStreamModalOpen, setIsStreamModalOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [inquiryPresetMessage, setInquiryPresetMessage] = useState("");
  const [inquiryFormContext, setInquiryFormContext] = useState<"admission" | "counselling">("admission");
  const [liveAnnouncements, setLiveAnnouncements] = useState<any[]>([]);

  React.useEffect(() => {
    fetch("/api/announcements")
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.announcements)) {
          setLiveAnnouncements(data.announcements);
        }
      })
      .catch(err => console.error("Error fetching live announcements:", err));
  }, []);

  const handleOpenAdmissionInquiry = () => {
    setInquiryFormContext("admission");
    setInquiryPresetMessage("");
    setIsInquiryModalOpen(true);
  };

  const handleRequestCounsellingSession = () => {
    setInquiryFormContext("counselling");
    setInquiryPresetMessage("Requesting a stream selection counselling session (Science/Commerce/Arts).");
    setIsStreamModalOpen(false);
    setIsInquiryModalOpen(true);
  };

  React.useEffect(() => {
    if (window.location.pathname === "/admin" || window.location.pathname === "/admin/") {
      setShowAdminPanel(true);
    }
  }, []);

  const handleCloseAdminPanel = () => {
    setShowAdminPanel(false);
    if (window.location.pathname === "/admin" || window.location.pathname === "/admin/") {
      window.history.pushState({}, "", "/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brass-gold selection:text-ink-navy bg-ivory-paper">
      {/* GLOBAL SCROLL PROGRESS BAR */}
      <ScrollProgressBar />

      {/* 1. STICKY NAVBAR */}
      <Header
        logoError={logoError}
        setLogoError={setLogoError}
        setIsMediaModalOpen={setIsMediaModalOpen}
        setIsFaqModalOpen={setIsFaqModalOpen}
      />

      {/* 2. HERO SECTION */}
      <Hero 
        setSelectedGalleryImg={setSelectedGalleryImg} 
        onOpenInquiryModal={handleOpenAdmissionInquiry} 
        onOpenAboutModal={() => setIsAboutModalOpen(true)} 
      />

      {/* 3. THIN DASHED GOLD DIVIDER LINE */}
      <AppContainer size="standard" padding="standard">
        <div className="dashed-divider h-0.5 w-full opacity-65 my-2 sm:my-4"></div>
      </AppContainer>

      {/* 4. NOTICE BOARD & CIRCULARS SECTION */}
      <NoticesSection
        liveAnnouncements={liveAnnouncements}
        onOpenInquiryModal={handleOpenAdmissionInquiry}
        onOpenCurriculumModal={() => setIsCurriculumModalOpen(true)}
        onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
      />

      {/* 5. WHY CHOOSE AMPS EXPANDING PANELS SECTION */}
      <WhyAmpsSection
        onOpenStreamModal={() => setIsStreamModalOpen(true)}
        onOpenInquiryModal={handleOpenAdmissionInquiry}
      />

      {/* 6. STATS STRIP */}
      <AppSection bg="muted" paddingY="sm" bordered animated={false}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-border-custom/80">
          <div className="text-center px-4 flex flex-col items-center justify-center pt-3 md:pt-0">
            <span className="font-serif text-3xl sm:text-4xl md:text-[44px] text-maroon font-bold mb-2">
              <Counter value={21} suffix="+" />
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.15em] text-muted-text uppercase text-center max-w-[160px] font-medium">
              Years since 2005
            </span>
          </div>

          <div className="text-center px-4 flex flex-col items-center justify-center pt-3 md:pt-0">
            <span className="font-serif text-3xl sm:text-4xl md:text-[44px] text-maroon font-bold mb-2">
              <Counter value={3} />
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.15em] text-muted-text uppercase text-center max-w-[160px] font-medium">
              Streams offered
            </span>
          </div>

          <div className="text-center px-4 flex flex-col items-center justify-center pt-3 md:pt-0">
            <span className="font-serif text-3xl sm:text-4xl md:text-[44px] text-maroon font-bold mb-2">
              <Counter value={2} />
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.15em] text-muted-text uppercase text-center max-w-[160px] font-medium">
              Mediums · Eng & Hindi
            </span>
          </div>

          <div className="text-center px-4 flex flex-col items-center justify-center pt-3 md:pt-0">
            <span className="font-serif text-3xl sm:text-4xl md:text-[44px] text-maroon font-bold mb-2">
              P.G–XII
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.15em] text-muted-text uppercase text-center max-w-[160px] font-medium">
              Rajasthan State Board
            </span>
          </div>
        </div>
      </AppSection>

      {/* 7. LEADERSHIP SECTION */}
      <LeadershipSection />

      {/* 8. PHOTO & EVENTS GALLERY SECTION */}
      <Gallery
        isMediaModalOpen={isMediaModalOpen}
        setIsMediaModalOpen={setIsMediaModalOpen}
        selectedGalleryImg={selectedGalleryImg}
        setSelectedGalleryImg={setSelectedGalleryImg}
      />

      {/* 9. ABOUT SECTION */}
      <AppSection id="about" bg="white" paddingY="lg" bordered>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <motion.div variants={childItemVariants} className="hidden lg:block lg:col-span-5">
            <Card variant="elevated" padding="sm" className="relative shadow-md">
              <div className="absolute inset-2 border border-border-custom pointer-events-none"></div>
              <div className="w-full bg-white rounded-sm overflow-hidden relative">
                <picture>
                  <source srcSet="/assets/school-building-1.webp" type="image/webp" />
                  <img
                    src="/assets/school-building-1.jpeg"
                    alt="Ashish Memorial School Campus & Activities"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto object-cover"
                  />
                </picture>
                <div className="absolute bottom-3 right-3 bg-white/95 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] font-bold border border-border-custom text-ink-navy shadow-sm">
                  Established 2005
                </div>
              </div>
              <p className="text-center font-serif text-xs italic text-muted-text mt-3">
                The primary academic block and front facade of AMPS Hindaun City.
              </p>
            </Card>
          </motion.div>

          <motion.div variants={childItemVariants} className="lg:col-span-7 flex flex-col space-y-5 text-left">
            <div>
              <span className="font-mono text-[11px] sm:text-xs tracking-[0.18em] text-brass-gold uppercase block mb-2 font-bold">
                About Our Institution
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink-navy font-bold leading-[1.22] tracking-tight">
                The district's No. 1 English medium school in results
              </h2>
            </div>

            <div className="space-y-4 text-muted-text text-sm md:text-[15px] leading-[1.75] font-sans max-w-2xl">
              <p>
                Ashish Memorial Public Sr. Sec. School (AMPS) in Hindaun City has established an unmatched legacy of educational brilliance. Serving students from Playgroup to Class XII, we are highly acclaimed for achieving top ranks under the Rajasthan Board. Our dual-medium approach ensures English and Hindi medium students flourish in a collaborative, supportive academic environment.
              </p>

              {/* Mobile Only: Photo positioned between text paragraphs */}
              <div className="block lg:hidden my-4">
                <Card variant="elevated" padding="sm" className="relative shadow-md">
                  <div className="absolute inset-1.5 border border-border-custom pointer-events-none"></div>
                  <div className="w-full bg-white rounded-sm overflow-hidden relative">
                    <picture>
                      <source srcSet="/assets/school-building-1.webp" type="image/webp" />
                      <img
                        src="/assets/school-building-1.jpeg"
                        alt="Ashish Memorial School Campus & Activities"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-auto object-cover max-h-64 sm:max-h-72"
                      />
                    </picture>
                    <div className="absolute bottom-2.5 right-2.5 bg-white/95 px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-[0.18em] font-bold border border-border-custom text-ink-navy shadow-sm">
                      Established 2005
                    </div>
                  </div>
                  <p className="text-center font-serif text-[11px] italic text-muted-text mt-2">
                    The primary academic block and front facade of AMPS Hindaun City.
                  </p>
                </Card>
              </div>

              <p>
                With dedicated streams in Science, Commerce, and Arts, combined with professional foundation guidance for IIT-JEE & NEET, we build a launching pad for future leaders, engineers, doctors, and scholars. Our campus is built around rigorous academic routines, secure premises with specialized safety systems for girls, and an experienced faculty committed to individual mentoring.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-center gap-2.5 text-body-text">
                <div className="w-5 h-5 rounded-full bg-brass-gold/15 flex items-center justify-center text-brass-gold shrink-0 font-bold">
                  <span className="text-xs">✓</span>
                </div>
                <span className="text-xs font-mono tracking-wider uppercase font-medium">Science, Commerce, Arts streams</span>
              </div>
              <div className="flex items-center gap-2.5 text-body-text">
                <div className="w-5 h-5 rounded-full bg-brass-gold/15 flex items-center justify-center text-brass-gold shrink-0 font-bold">
                  <span className="text-xs">✓</span>
                </div>
                <span className="text-xs font-mono tracking-wider uppercase font-medium">Rigorous State Board Preparation</span>
              </div>
              <div className="flex items-center gap-2.5 text-body-text">
                <div className="w-5 h-5 rounded-full bg-brass-gold/15 flex items-center justify-center text-brass-gold shrink-0 font-bold">
                  <span className="text-xs">✓</span>
                </div>
                <span className="text-xs font-mono tracking-wider uppercase font-medium">Safe, well-supervised campus</span>
              </div>
              <div className="flex items-center gap-2.5 text-body-text">
                <div className="w-5 h-5 rounded-full bg-brass-gold/15 flex items-center justify-center text-brass-gold shrink-0 font-bold">
                  <span className="text-xs">✓</span>
                </div>
                <span className="text-xs font-mono tracking-wider uppercase font-medium">Dual-Medium Academic Cohorts</span>
              </div>
            </div>
          </motion.div>
        </div>
      </AppSection>

      {/* 9.5. VISION & MISSION SECTION - Editorial Foundation Pass */}
      <AppSection id="vision-mission" className="bg-[#FAF9F6] py-18 sm:py-22 lg:py-28 border-t border-border-custom/60">
        <motion.div variants={childItemVariants} className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="font-mono text-[11px] sm:text-xs tracking-[0.18em] text-brass-gold font-bold uppercase block mb-2 sm:mb-2.5">
            Our Foundations
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink-navy font-bold tracking-tight leading-[1.2]">
            Vision, Mission & Values
          </h2>
          <p className="font-serif text-sm sm:text-base text-muted-text italic mt-3 leading-relaxed">
            हमारा दृष्टिकोण और उद्देश्य - शिक्षित, संस्कारित और सशक्त राष्ट्र निर्माण
          </p>
          <div className="w-16 h-1 bg-brass-gold mx-auto mt-4 rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Quote & Image Card Frame */}
          <motion.div variants={childItemVariants} className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-[440px] bg-white rounded-2xl p-3 sm:p-4 border-2 border-brass-gold/35 shadow-xl relative overflow-hidden text-slate-800">
              <div
                className="w-full rounded-xl overflow-hidden relative shadow-xs"
                style={{
                  background: "linear-gradient(160deg, #1F4A82, #0A1D3A)",
                }}
              >
                <img
                  src="/assets/principal-2.jpeg"
                  alt="Ashish Memorial Public School Inspirational Leadership"
                  loading="lazy"
                  className="w-full h-auto object-cover max-h-[460px] relative z-0"
                />
                {/* Duotone Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none z-1"
                  style={{
                    background: "linear-gradient(160deg, rgba(212,175,55,0.35), rgba(10,29,58,0.55))",
                    mixBlendMode: "multiply",
                  }}
                />
                {/* From the principal label pill */}
                <div
                  className="absolute bottom-3 left-3 text-white z-10 font-mono text-[9px] uppercase tracking-[0.05em] px-2 py-[3px] rounded-[4px] shadow-sm font-semibold"
                  style={{
                    background: "rgba(10,20,35,0.75)",
                  }}
                >
                  From the principal
                </div>
              </div>

              <div className="mt-5 sm:mt-6 text-center relative px-3 pb-2 text-slate-800">
                {/* Large decorative quotation mark background element */}
                <span
                  className="absolute -top-3.5 left-2 text-[48px] font-serif leading-none select-none pointer-events-none z-0"
                  style={{ color: "#F3E6C4", fontFamily: "Georgia, serif" }}
                >
                  “
                </span>
                <p className="font-serif text-sm sm:text-[15px] italic text-ink-navy/90 leading-[1.78] pt-2 max-w-sm mx-auto relative z-10">
                  Education is not merely the acquisition of knowledge, but the cultivation of moral character, self-discipline, and the relentless pursuit of excellence.
                </p>
                <div className="w-12 h-[1px] bg-brass-gold/40 mx-auto mt-4 relative z-10"></div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-text mt-2.5 font-bold relative z-10">
                  AMPS core philosophy
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Vision, Mission & Pillars */}
          <motion.div variants={childItemVariants} className="lg:col-span-7 flex flex-col space-y-6 sm:space-y-8 text-left">
            {/* Vision Card */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white border-l-4 border-l-brass-gold border-y border-r border-border-custom/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex gap-4.5 items-start">
                <div className="w-12 h-12 rounded-xl bg-brass-gold/10 border border-brass-gold/30 flex items-center justify-center text-brass-gold shrink-0 shadow-xs mt-0.5">
                  <span className="font-serif text-xl font-bold">V</span>
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-navy mb-2 flex items-center gap-2.5 tracking-tight">
                    Our Vision
                    <span className="text-xs font-mono font-normal text-muted-text italic">(हमारा दृष्टिकोण)</span>
                  </h3>
                  <p className="text-muted-text text-sm sm:text-[15px] leading-[1.78] font-sans">
                    To be a premier educational institution that nurtures young minds into academically accomplished, morally upright, and socially responsible citizens. We strive to foster a culture of lifelong learning, dynamic critical thinking, and inclusive excellence, guiding students to set benchmarks of success both regionally and nationally.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Mission Card */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white border-l-4 border-l-maroon border-y border-r border-border-custom/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex gap-4.5 items-start">
                <div className="w-12 h-12 rounded-xl bg-maroon/10 border border-maroon/30 flex items-center justify-center text-maroon shrink-0 shadow-xs mt-0.5">
                  <span className="font-serif text-xl font-bold">M</span>
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-navy mb-2 flex items-center gap-2.5 tracking-tight">
                    Our Mission
                    <span className="text-xs font-mono font-normal text-muted-text italic">(हमारा उद्देश्य)</span>
                  </h3>
                  <p className="text-muted-text text-sm sm:text-[15px] leading-[1.78] font-sans">
                    To deliver top-tier, bilingual (English & Hindi) instruction from kindergarten through Class XII. We commit to a highly structured academic routine, integrating deep board preparation with competitive exam (JEE/NEET) coaching. Through safe campuses, individual mentoring, and rich co-curricular initiatives, we empower every student to thrive.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Core Values Pillars */}
            <div className="pt-2">
              <h4 className="font-mono text-xs tracking-[0.18em] text-ink-navy uppercase font-bold mb-4">
                Our Pillars of Excellence
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
                {/* Pillar 1: Academic Rigor */}
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{ borderColor: "#EFD98F" }}
                  className="bg-white p-5 sm:p-6 border rounded-xl shadow-xs hover:shadow-[0_10px_20px_rgba(0,0,0,0.08)] transition-all text-center flex flex-col justify-between h-full group cursor-default"
                >
                  <div>
                    <div
                      style={{
                        background: "linear-gradient(140deg, #F0CD70, #B8791E)",
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white mx-auto mb-3 shadow-xs"
                    >
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <h5 className="font-serif text-base sm:text-lg font-bold text-ink-navy tracking-tight mb-1.5">
                      Academic Rigor
                    </h5>
                    <p className="text-muted-text text-xs leading-[1.65] font-sans">
                      Proven state merit list results and IIT/NEET foundation.
                    </p>
                  </div>
                </motion.div>

                {/* Pillar 2: Moral Ethics */}
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{ borderColor: "#EAC0C7" }}
                  className="bg-white p-5 sm:p-6 border rounded-xl shadow-xs hover:shadow-[0_10px_20px_rgba(0,0,0,0.08)] transition-all text-center flex flex-col justify-between h-full group cursor-default"
                >
                  <div>
                    <div
                      style={{
                        background: "linear-gradient(140deg, #C97D8E, #6B2038)",
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white mx-auto mb-3 shadow-xs"
                    >
                      <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                    <h5 className="font-serif text-base sm:text-lg font-bold text-ink-navy tracking-tight mb-1.5">
                      Moral Ethics
                    </h5>
                    <p className="text-muted-text text-xs leading-[1.65] font-sans">
                      Nurturing honesty, deep-rooted discipline, and mutual respect.
                    </p>
                  </div>
                </motion.div>

                {/* Pillar 3: Holistic Care */}
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{ borderColor: "#BBD3EA" }}
                  className="bg-white p-5 sm:p-6 border rounded-xl shadow-xs hover:shadow-[0_10px_20px_rgba(0,0,0,0.08)] transition-all text-center flex flex-col justify-between h-full group cursor-default"
                >
                  <div>
                    <div
                      style={{
                        background: "linear-gradient(140deg, #7DA6D2, #1F4A82)",
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white mx-auto mb-3 shadow-xs"
                    >
                      <HeartHandshake className="w-4 h-4 text-white" />
                    </div>
                    <h5 className="font-serif text-base sm:text-lg font-bold text-ink-navy tracking-tight mb-1.5">
                      Holistic Care
                    </h5>
                    <p className="text-muted-text text-xs leading-[1.65] font-sans">
                      CCTV protection, girls' safety, and active athletics.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </AppSection>

      {/* 10. CONTACT SECTION & INQUIRY FORM */}
      <AdmissionInquiryForm
        formContext="admission"
        onOpenInquiryModal={handleOpenAdmissionInquiry}
      />

      {/* 11. FOOTER SECTION */}
      <Footer
        logoError={logoError}
        setLogoError={setLogoError}
        setIsMediaModalOpen={setIsMediaModalOpen}
        setIsFaqModalOpen={setIsFaqModalOpen}
      />

      {/* 12. CURRICULUM DETAIL MODAL */}
      <CurriculumModal
        isOpen={isCurriculumModalOpen}
        onClose={() => setIsCurriculumModalOpen(false)}
        onOpenInquiryModal={handleOpenAdmissionInquiry}
      />

      {/* 13. SAFETY MANDATE DETAIL MODAL */}
      <SafetyMandateModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
        onOpenInquiryModal={handleOpenAdmissionInquiry}
      />

      {/* 14. ADMISSION INQUIRY POPUP MODAL */}
      <InquiryModal
        key={inquiryFormContext}
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        presetMessage={inquiryPresetMessage}
        prefillMessage={inquiryPresetMessage}
        formContext={inquiryFormContext}
      />

      {/* 15. STREAM SELECTION ADVISORY MODAL */}
      <StreamAdvisoryModal
        isOpen={isStreamModalOpen}
        onClose={() => setIsStreamModalOpen(false)}
        onRequestSession={handleRequestCounsellingSession}
      />

      {/* 16. ADMIN DASHBOARD MODAL */}
      {showAdminPanel && (
        <React.Suspense fallback={null}>
          <AdminPanel onClose={handleCloseAdminPanel} />
        </React.Suspense>
      )}

      {/* 17. FAQ DETAIL MODAL */}
      <FaqModal
        isOpen={isFaqModalOpen}
        onClose={() => setIsFaqModalOpen(false)}
        onOpenInquiryModal={handleOpenAdmissionInquiry}
      />

      {/* 18. ABOUT SCHOOL DETAIL MODAL */}
      <AboutSchoolModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        onOpenInquiryModal={handleOpenAdmissionInquiry}
      />

    </div>
  );
}
