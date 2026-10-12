import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Trophy,
  Users2,
  Building2,
  Sparkles,
  ArrowRight,
  GraduationCap,
  ChevronDown,
} from "lucide-react";
import { AppSection } from "./layout/AppSection";
import { Button } from "./ui/Button";
import { childItemVariants } from "../utils/motion";

export interface WhyChoosePanelItem {
  id: string;
  period: string;
  title: string;
  shortLabel: string;
  description: string;
  icon: React.ElementType;
  photoUrl: string;
  gradient: string;
  textColor: "dark" | "light";
  darkTextColor: string;
  darkEyebrowColor: string;
}

const PANELS: WhyChoosePanelItem[] = [
  {
    id: "academic-record",
    period: "PERIOD 01",
    title: "Academic Record",
    shortLabel: "Academic Record",
    description:
      "Consistent district #1 board merit track record, 100% first division pass rate, and integrated competitive foundations.",
    icon: Trophy,
    photoUrl: "https://picsum.photos/seed/academic-record/800/600",
    gradient:
      "radial-gradient(circle at 25% 20%, rgba(255,255,255,0.35), transparent 55%), linear-gradient(150deg, rgba(233, 184, 75, 0.92) 0%, rgba(184, 121, 30, 0.92) 60%, rgba(140, 86, 19, 0.92) 100%)",
    textColor: "dark",
    darkTextColor: "#241503",
    darkEyebrowColor: "#3a2405",
  },
  {
    id: "experienced-faculty",
    period: "PERIOD 02",
    title: "Experienced Faculty",
    shortLabel: "Experienced Faculty",
    description:
      "Over 21+ years of proven mentorship, individual doubt squads, and dedicated subject master educators across English & Hindi mediums.",
    icon: Users2,
    photoUrl: "https://picsum.photos/seed/experienced-faculty/800/600",
    gradient:
      "radial-gradient(circle at 70% 15%, rgba(255,255,255,0.2), transparent 55%), linear-gradient(160deg, rgba(156, 58, 84, 0.92) 0%, rgba(107, 32, 56, 0.92) 60%, rgba(74, 22, 38, 0.92) 100%)",
    textColor: "light",
    darkTextColor: "#ffffff",
    darkEyebrowColor: "rgba(255,255,255,0.85)",
  },
  {
    id: "modern-campus",
    period: "PERIOD 03",
    title: "Modern Campus",
    shortLabel: "Modern Campus",
    description:
      "State-of-the-art multimedia classrooms, advanced science and computer labs, with 24/7 CCTV perimeter security for girls and students.",
    icon: Building2,
    photoUrl: "https://picsum.photos/seed/modern-campus/800/600",
    gradient:
      "radial-gradient(circle at 70% 15%, rgba(255,255,255,0.2), transparent 55%), linear-gradient(160deg, rgba(31, 74, 130, 0.92) 0%, rgba(18, 48, 88, 0.92) 60%, rgba(10, 29, 58, 0.92) 100%)",
    textColor: "light",
    darkTextColor: "#ffffff",
    darkEyebrowColor: "rgba(255,255,255,0.85)",
  },
  {
    id: "holistic-growth",
    period: "PERIOD 04",
    title: "Holistic Growth",
    shortLabel: "Holistic Growth",
    description:
      "Comprehensive sports coaching, inter-school cultural fests, leadership seminars, and ethical values fostering all-round excellence.",
    icon: Sparkles,
    photoUrl: "https://picsum.photos/seed/holistic-growth/800/600",
    gradient:
      "radial-gradient(circle at 70% 15%, rgba(255,255,255,0.2), transparent 55%), linear-gradient(160deg, rgba(138, 106, 60, 0.92) 0%, rgba(92, 69, 38, 0.92) 60%, rgba(58, 44, 24, 0.92) 100%)",
    textColor: "light",
    darkTextColor: "#ffffff",
    darkEyebrowColor: "rgba(255,255,255,0.85)",
  },
];

interface WhyAmpsSectionProps {
  onOpenStreamModal: () => void;
  onOpenInquiryModal: () => void;
}

export default function WhyAmpsSection({
  onOpenStreamModal,
  onOpenInquiryModal,
}: WhyAmpsSectionProps) {
  // At rest on desktop, panel 0 is active. On mobile, tracks which accordion is open (or -1 if closed)
  const [activePanel, setActivePanel] = useState<number>(0);

  const handlePanelTap = (index: number) => {
    setActivePanel((prev) => (prev === index ? -1 : index));
  };

  return (
    <AppSection id="why-amps" bg="navy" paddingY="lg" className="overflow-x-hidden">
      {/* Section Header */}
      <motion.div
        variants={childItemVariants}
        className="mb-8 sm:mb-14 border-b border-brass-gold/20 pb-6 sm:pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 text-left"
      >
        <div>
          <span className="font-mono text-[11px] sm:text-xs tracking-[0.18em] text-brass-gold uppercase block mb-2 font-bold">
            Why Choose AMPS
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-bold tracking-tight leading-[1.2]">
            Our Core Distinctions
          </h2>
        </div>
        <p className="text-slate-300 max-w-md font-sans text-sm md:text-[15px] leading-[1.75]">
          Hover on desktop or tap on mobile to explore our 4 core pillars of educational excellence and character building.
        </p>
      </motion.div>

      {/* 4-Panel Expand Gallery */}
      <motion.div variants={childItemVariants} className="w-full">
        {/* DESKTOP (md: & above): Horizontal Flex Row with smooth flex transitions */}
        <div className="hidden md:flex flex-row items-stretch gap-3.5 h-[310px] w-full">
          {PANELS.map((panel, index) => {
            const isExpanded = activePanel === index;
            const Icon = panel.icon;
            const isDarkTheme = panel.textColor === "dark";

            const titleColor = isDarkTheme ? panel.darkTextColor : "#ffffff";
            const eyebrowColor = isDarkTheme ? panel.darkEyebrowColor : "rgba(255,255,255,0.85)";
            const descColor = isDarkTheme ? "#3a2405" : "rgba(255,255,255,0.92)";
            const linkColor = isDarkTheme ? "#241503" : "#ffffff";

            return (
              <motion.div
                key={panel.id}
                onMouseEnter={() => setActivePanel(index)}
                onFocus={() => setActivePanel(index)}
                onClick={() => setActivePanel(index)}
                tabIndex={0}
                role="button"
                aria-expanded={isExpanded}
                aria-label={`${panel.title} panel`}
                animate={{
                  flex: isExpanded ? 3.2 : 1,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1], // cubic-bezier(0.22, 1, 0.36, 1)
                }}
                style={{
                  backgroundImage: `${panel.gradient}, url(${panel.photoUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className={`relative rounded-2xl p-6 overflow-hidden cursor-pointer text-left transition-shadow duration-300 focus-visible:outline-2 focus-visible:outline-brass-gold flex flex-col justify-between ${
                  isExpanded
                    ? "shadow-2xl shadow-black/50 ring-1 ring-white/30"
                    : "shadow-md hover:shadow-xl opacity-90 hover:opacity-100 ring-1 ring-black/20"
                }`}
              >
                {/* Collapsed State: Top Icon + Vertical Title Strip */}
                {!isExpanded && (
                  <div className="w-full h-full flex flex-col items-center justify-between py-2 select-none">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isDarkTheme ? "bg-black/10 text-[#241503]" : "bg-white/15 text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 flex items-center justify-center my-auto">
                      <span
                        style={{
                          color: isDarkTheme ? "#241503" : "#ffffff",
                          writingMode: "vertical-rl",
                        }}
                        className="rotate-180 font-mono text-xs sm:text-[13px] font-bold tracking-[0.08em] uppercase whitespace-nowrap drop-shadow-sm"
                      >
                        {panel.shortLabel}
                      </span>
                    </div>

                    <span
                      style={{ color: isDarkTheme ? "#3a2405" : "rgba(255,255,255,0.75)" }}
                      className="font-mono text-[10px] font-bold tracking-wider"
                    >
                      0{index + 1}
                    </span>
                  </div>
                )}

                {/* Expanded State: Eyebrow + Title + Description + Link */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      key="expanded-content"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
                      className="w-full h-full flex flex-col justify-between select-text"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            style={{ color: eyebrowColor }}
                            className="font-mono text-[11px] font-bold tracking-[0.16em] uppercase block"
                          >
                            {panel.period}
                          </span>
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${
                              isDarkTheme ? "bg-black/10 text-[#241503]" : "bg-white/20 text-white"
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                        </div>

                        <h3
                          style={{ color: titleColor }}
                          className="font-serif text-2xl lg:text-3xl font-bold tracking-tight leading-snug mb-3 drop-shadow-xs"
                        >
                          {panel.title}
                        </h3>

                        <p
                          style={{ color: descColor }}
                          className="font-sans text-sm sm:text-[14.5px] leading-relaxed max-w-xl line-clamp-3 font-medium drop-shadow-xs"
                        >
                          {panel.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/20 mt-auto flex items-center justify-between">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenInquiryModal();
                          }}
                          style={{ color: linkColor }}
                          className="group/link font-mono text-xs sm:text-[13px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-transform duration-200 hover:translate-x-1 cursor-pointer"
                        >
                          <span>Learn more</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>

                        <span
                          style={{ color: eyebrowColor }}
                          className="font-mono text-[11px] font-bold tracking-widest uppercase opacity-75"
                        >
                          AMPS DISTINCT
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* MOBILE & TABLET (<md:): Vertical Stacked Accordion with tap-to-expand */}
        <div className="flex md:hidden flex-col gap-3 w-full">
          {PANELS.map((panel, index) => {
            const isExpanded = activePanel === index;
            const Icon = panel.icon;
            const isDarkTheme = panel.textColor === "dark";

            const titleColor = isDarkTheme ? panel.darkTextColor : "#ffffff";
            const eyebrowColor = isDarkTheme ? panel.darkEyebrowColor : "rgba(255,255,255,0.85)";
            const descColor = isDarkTheme ? "#3a2405" : "rgba(255,255,255,0.92)";
            const linkColor = isDarkTheme ? "#241503" : "#ffffff";

            return (
              <div
                key={panel.id}
                onClick={() => handlePanelTap(index)}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                style={{
                  backgroundImage: `${panel.gradient}, url(${panel.photoUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className={`relative rounded-xl p-4 sm:p-5 overflow-hidden transition-all duration-300 text-left shadow-md cursor-pointer select-none ${
                  isExpanded ? "ring-2 ring-white/40 shadow-xl" : "opacity-95 hover:opacity-100"
                }`}
              >
                {/* Collapsed Header Bar (~80-90px fixed clean touch area) */}
                <div className="flex items-center justify-between gap-3 min-h-[56px]">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                        isDarkTheme ? "bg-black/10 text-[#241503]" : "bg-white/20 text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span
                        style={{ color: eyebrowColor }}
                        className="font-mono text-[10px] font-bold uppercase tracking-wider block"
                      >
                        {panel.period}
                      </span>
                      <h3
                        style={{ color: titleColor }}
                        className="font-serif text-base sm:text-lg font-bold leading-tight truncate"
                      >
                        {panel.title}
                      </h3>
                    </div>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : ""
                    } ${isDarkTheme ? "bg-black/10 text-[#241503]" : "bg-white/20 text-white"}`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>

                {/* Expanded Body: Revealed Smoothly with height transition */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key="mobile-expanded-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden pt-3 border-t border-white/20 mt-3"
                    >
                      <p
                        style={{ color: descColor }}
                        className="text-xs sm:text-[13.5px] font-sans leading-relaxed mb-4 font-medium"
                      >
                        {panel.description}
                      </p>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenInquiryModal();
                          }}
                          style={{ color: linkColor }}
                          className="font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer py-1"
                        >
                          <span>Learn more</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <span
                          style={{ color: eyebrowColor }}
                          className="font-mono text-[10px] font-bold uppercase tracking-widest opacity-80"
                        >
                          0{index + 1} / 04
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Stream Selection Advisory Callout Banner */}
      <motion.div
        variants={childItemVariants}
        className="mt-8 sm:mt-14 bg-navy-surface border border-brass-gold/25 p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-5 text-left shadow-lg relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-40 h-40 bg-brass-gold/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex gap-3.5 sm:gap-4 items-start relative z-10">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-brass-gold/10 border border-brass-gold/30 flex items-center justify-center text-brass-gold shrink-0 shadow-xs mt-0.5">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-white leading-snug">
              Stream Selection Guidance & Counselling
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 font-sans leading-relaxed max-w-2xl">
              Our academic directors hold personalized 1-on-1 counseling sessions to guide students and parents in selecting between Science, Commerce, and Arts streams with integrated IIT-JEE/NEET roadmap planning.
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onOpenStreamModal}
          className="uppercase font-mono font-bold tracking-wider shrink-0 text-xs relative z-10 w-full sm:w-auto"
        >
          Contact Advisory
        </Button>
      </motion.div>
    </AppSection>
  );
}
