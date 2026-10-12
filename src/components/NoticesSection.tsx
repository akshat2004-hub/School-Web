import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Sparkles,
  CalendarDays,
  ShieldCheck,
  ArrowRight,
  Clock,
  Layers,
  X,
  Pin,
} from "lucide-react";
import { AppSection } from "./layout/AppSection";
import { Button } from "./ui/Button";
import { childItemVariants, MotionEase } from "../utils/motion";
import {
  CORE_SCHOOL_NOTICES,
  NoticeCategory,
} from "../constants/school-notices";

interface CategoryMeta {
  id: NoticeCategory;
  name: string;
  hindiName: string;
  icon: React.ElementType;
  themeColor: "gold" | "navy" | "maroon";
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  accentGlow: string;
}

const CATEGORIES: CategoryMeta[] = [
  {
    id: "admissions",
    name: "Admissions",
    hindiName: "प्रवेश 2026-27",
    icon: Sparkles,
    themeColor: "gold",
    badgeBg: "bg-brass-gold text-ink-navy",
    badgeBorder: "border-brass-gold/60 hover:border-brass-gold",
    badgeText: "text-brass-gold",
    accentGlow: "shadow-brass-gold/30",
  },
  {
    id: "academics",
    name: "Academics",
    hindiName: "शैक्षणिक सूचनाएं",
    icon: BookOpen,
    themeColor: "navy",
    badgeBg: "bg-ink-navy text-white",
    badgeBorder: "border-brass-gold/40 hover:border-brass-gold",
    badgeText: "text-ink-navy",
    accentGlow: "shadow-ink-navy/30",
  },
  {
    id: "safety",
    name: "Campus Safety",
    hindiName: "सुरक्षा एवं परिसर",
    icon: ShieldCheck,
    themeColor: "navy",
    badgeBg: "bg-navy-surface text-white",
    badgeBorder: "border-navy-light/40 hover:border-brass-gold",
    badgeText: "text-navy-light",
    accentGlow: "shadow-navy-surface/30",
  },
  {
    id: "events",
    name: "Events & Days",
    hindiName: "सांस्कृतिक व उत्सव",
    icon: CalendarDays,
    themeColor: "maroon",
    badgeBg: "bg-maroon text-white",
    badgeBorder: "border-maroon/40 hover:border-maroon",
    badgeText: "text-maroon",
    accentGlow: "shadow-maroon/30",
  },
];

export interface FormattedNotice {
  id: string | number;
  category: NoticeCategory;
  title: string;
  dateBadge: string;
  badge: string;
  badgeType: "live" | "urgent" | "foundation" | "safety" | "event";
  description: string;
  introLines?: string[];
  bulletLines?: string[];
  highlights?: string[];
  quote?: string;
  actionLabel: string;
  actionType: "inquiry" | "curriculum" | "safety" | "general";
  createdBy: string;
}

interface NoticesSectionProps {
  liveAnnouncements?: any[];
  onOpenInquiryModal: () => void;
  onOpenCurriculumModal: () => void;
  onOpenSafetyModal: () => void;
}

export default function NoticesSection({
  liveAnnouncements = [],
  onOpenInquiryModal,
  onOpenCurriculumModal,
  onOpenSafetyModal,
}: NoticesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<NoticeCategory>("admissions");
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);

  // Parse raw notice text into intro and bullet points
  const parseNoticeContent = (text: string) => {
    if (!text) return { introLines: [], bulletLines: [] };
    const rawLines = text
      .split(/\n+/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && l !== "•");

    const introLines: string[] = [];
    const bulletLines: string[] = [];

    rawLines.forEach((line) => {
      if (line.startsWith("•") || line.startsWith("-") || line.startsWith("*")) {
        bulletLines.push(line.replace(/^[•\-\*]\s*/, ""));
      } else {
        introLines.push(line);
      }
    });

    return { introLines, bulletLines };
  };

  // Compile unified notices from single source of truth (Core Notices + Live DB Announcements)
  const allCategorizedNotices = useMemo(() => {
    const map: Record<NoticeCategory, FormattedNotice[]> = {
      admissions: [],
      academics: [],
      safety: [],
      events: [],
    };

    // 1. Process Live Announcements from Database (e.g. "Ganesh Chaturthi", "Happy Teachers Day")
    liveAnnouncements.forEach((ann) => {
      const titleLower = (ann.title || "").toLowerCase();
      const validCategories: NoticeCategory[] = ["events", "admissions", "academics", "safety"];

      // ── Priority 1: Use explicit category field set by admin in the panel ──
      let cat: NoticeCategory = validCategories.includes(ann.category as NoticeCategory)
        ? (ann.category as NoticeCategory)
        : "events"; // default to events

      // ── Priority 2: Fallback keyword detection only if no explicit category ──
      if (!validCategories.includes(ann.category as NoticeCategory)) {
        if (
          titleLower.includes("admission") ||
          titleLower.includes("apply") ||
          titleLower.includes("registration")
        ) {
          cat = "admissions";
        } else if (
          titleLower.includes("safe") ||
          titleLower.includes("cctv") ||
          titleLower.includes("security") ||
          titleLower.includes("guard")
        ) {
          cat = "safety";
        } else if (
          titleLower.includes("curriculum") ||
          titleLower.includes("jee") ||
          titleLower.includes("neet") ||
          titleLower.includes("syllabus") ||
          titleLower.includes("exam") ||
          titleLower.includes("test") ||
          titleLower.includes("assessment") ||
          titleLower.includes("class")
        ) {
          cat = "academics";
        }
      }

      const isLive = ann.priority === "live";
      const isHigh = ann.priority === "high";
      const { introLines, bulletLines } = parseNoticeContent(ann.content);

      map[cat].push({
        id: `ann-${ann.id}`,
        category: cat,
        title: ann.title.trim(),
        dateBadge: new Date(ann.created_at || Date.now()).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        badge: isLive ? "⚡ LIVE ANNOUNCEMENT" : isHigh ? "URGENT NOTICE" : "SCHOOL ANNOUNCEMENT",
        badgeType: isLive ? "live" : isHigh ? "urgent" : "event",
        description: introLines.join(" ") || ann.content,
        introLines,
        bulletLines,
        actionLabel: "Inquire Notice",
        actionType: "inquiry",
        createdBy: ann.created_by || "Principal Office",
      });
    });

    // 2. Add Core Institutional Notices from single source of truth
    CORE_SCHOOL_NOTICES.forEach((cn) => {
      if (!map[cn.category].some((x) => x.title.toLowerCase() === cn.title.toLowerCase())) {
        map[cn.category].push({
          id: cn.id,
          category: cn.category,
          title: cn.title,
          dateBadge: cn.dateBadge,
          badge: cn.badge,
          badgeType: cn.badgeType,
          description: cn.description,
          highlights: cn.highlights,
          quote: cn.quote,
          actionLabel: cn.actionLabel,
          actionType: cn.actionType,
          createdBy: cn.createdBy || "AMPS Administration",
        });
      }
    });

    return map;
  }, [liveAnnouncements]);

  const currentNotices = allCategorizedNotices[activeCategory] || [];
  const currentCategoryMeta = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];

  const handleAction = (type?: string) => {
    if (type === "curriculum") {
      onOpenCurriculumModal();
    } else if (type === "safety") {
      onOpenSafetyModal();
    } else {
      onOpenInquiryModal();
    }
  };

  return (
    <AppSection id="notices" className="bg-[#FAF9F6] py-14 sm:py-20 lg:py-24 border-y border-border-custom/60 overflow-x-hidden">
      {/* Section Header */}
      <motion.div variants={childItemVariants} className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 px-2">
        <span className="font-mono text-[11px] sm:text-xs tracking-[0.18em] text-brass-gold font-bold uppercase block mb-2 sm:mb-2.5">
          Official Notice Board
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink-navy font-bold tracking-tight leading-[1.2]">
          Notices & Circulars
        </h2>
        <p className="text-muted-text mt-3 font-sans text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto">
          Tap on mobile or hover on desktop across any category badge to reveal official school circulars and schedules.
        </p>
      </motion.div>

      {/* Row of Circular Icon Badges (Single horizontal row of 4 on all viewports) */}
      <motion.div variants={childItemVariants} className="w-full mb-8 sm:mb-12">
        <div className="grid grid-cols-4 gap-1.5 xs:gap-2.5 sm:gap-6 lg:gap-8 max-w-3xl mx-auto px-2 sm:px-4 w-full">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const Icon = cat.icon;
            const count = allCategorizedNotices[cat.id]?.length || 0;

            const borderRing =
              cat.themeColor === "navy"
                ? "ring-ink-navy/40"
                : cat.themeColor === "maroon"
                ? "ring-maroon/40"
                : "ring-brass-gold/60";

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                onMouseEnter={() => {
                  if (typeof window !== "undefined" && window.innerWidth >= 768) {
                    setActiveCategory(cat.id);
                  }
                }}
                className="group flex flex-col items-center justify-start cursor-pointer focus-visible:outline-2 focus-visible:outline-brass-gold rounded-xl p-1 sm:p-2 transition-transform duration-200 min-w-0"
                aria-label={`Category ${cat.name}`}
                aria-pressed={isActive}
              >
                {/* Circular Badge */}
                <div
                  className={`relative w-12 h-12 xs:w-13 xs:h-13 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-md shrink-0 ${
                    cat.badgeBg
                  } ${
                    isActive
                      ? `scale-105 sm:scale-110 ring-2 sm:ring-4 ${borderRing} shadow-xl`
                      : "hover:scale-105 opacity-85 hover:opacity-100 ring-1 sm:ring-2 ring-black/5"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 xs:w-5.5 xs:h-5.5 sm:w-8 sm:h-8 md:w-9 md:h-9 transition-transform duration-300 ${
                      isActive ? "scale-105 sm:scale-110" : "group-hover:scale-105"
                    }`}
                  />

                  {/* Active Count Badge */}
                  {count > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-brass-gold text-ink-navy text-[9px] sm:text-[10px] font-mono font-bold flex items-center justify-center shadow-xs border border-white z-10">
                      {count}
                    </span>
                  )}

                  {/* Active Pin Dot Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryDot"
                      className="absolute -bottom-1.5 sm:-bottom-2 w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-brass-gold shadow-md"
                      transition={{ duration: 0.25, ease: MotionEase.out }}
                    />
                  )}
                </div>

                {/* Category Label */}
                <span
                  className={`mt-1.5 sm:mt-2.5 font-sans text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-bold tracking-tight text-center transition-colors duration-200 leading-tight w-full max-w-[70px] xs:max-w-[76px] sm:max-w-[110px] break-words [text-wrap:balance] ${
                    isActive ? "text-ink-navy font-extrabold" : "text-slate-600 group-hover:text-ink-navy"
                  }`}
                >
                  {cat.name}
                </span>
                <span className="text-[9.5px] sm:text-[10px] font-sans text-muted-text hidden sm:block text-center mt-0.5">
                  {cat.hindiName}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Notice Cards Reveal Container */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: MotionEase.out }}
            className="w-full"
          >
            {/* Active Category Header Bar */}
            <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-border-custom/80 px-1">
              <div className="flex items-center gap-2 text-left min-w-0">
                <div
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    currentCategoryMeta.themeColor === "navy"
                      ? "bg-ink-navy"
                      : currentCategoryMeta.themeColor === "maroon"
                      ? "bg-maroon"
                      : "bg-brass-gold"
                  }`}
                />
                <h3 className="font-serif text-base sm:text-lg lg:text-xl font-bold text-ink-navy truncate">
                  {currentCategoryMeta.name}
                </h3>
                <span className="font-mono text-[11px] sm:text-xs text-muted-text font-semibold hidden sm:inline shrink-0">
                  ({currentNotices.length} active {currentNotices.length === 1 ? "notice" : "notices"})
                </span>
              </div>
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-brass-gold font-bold shrink-0">
                {currentCategoryMeta.hindiName}
              </span>
            </div>

            {/* Grid of Revealed Notice Cards */}
            {currentNotices.length > 0 ? (
              <div
                className={`grid gap-4 items-stretch ${
                  currentNotices.length === 1
                    ? "grid-cols-1 max-w-2xl mx-auto"
                    : "grid-cols-1 md:grid-cols-2"
                }`}
              >
                {currentNotices.map((notice, idx) => {
                  const isUrgent = notice.badgeType === "urgent" || notice.badgeType === "live";
                  const isSafety = notice.badgeType === "safety";

                  return (
                    <motion.div
                      key={notice.id || idx}
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={`bg-white rounded-xl p-4 sm:p-6 border transition-all flex flex-col justify-between text-left shadow-sm hover:shadow-md relative ${
                        isUrgent
                          ? "border-maroon/30 shadow-maroon/5 bg-gradient-to-b from-rose-50/20 to-white"
                          : isSafety
                          ? "border-emerald-200 shadow-emerald-50/30"
                          : "border-border-custom hover:border-brass-gold/50"
                      }`}
                    >
                      <div>
                        {/* Badge and Date Header */}
                        <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
                          <span
                            className={`font-mono text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                              notice.badgeType === "live"
                                ? "bg-rose-600 text-white border-rose-700 animate-pulse"
                                : notice.badgeType === "urgent"
                                ? "bg-rose-50 text-rose-800 border-rose-200"
                                : notice.badgeType === "safety"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : notice.badgeType === "foundation"
                                ? "bg-navy-light/10 text-navy-light border-navy-light/25"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            {notice.badge}
                          </span>
                          <span className="font-mono text-[10.5px] sm:text-[11px] text-muted-text flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {notice.dateBadge}
                          </span>
                        </div>

                        {/* Notice Title */}
                        <h4 className="font-serif text-base sm:text-[17px] font-bold text-ink-navy leading-snug mb-2">
                          {notice.title}
                        </h4>

                        {/* Notice Description */}
                        <p className="text-muted-text text-xs sm:text-[13px] font-sans leading-relaxed mb-3">
                          {notice.description}
                        </p>

                        {/* Dynamic Bullet Points / Highlights */}
                        {notice.bulletLines && notice.bulletLines.length > 0 && (
                          <ul className="space-y-1.5 mb-3 bg-amber-50/50 p-2.5 sm:p-3 rounded-lg border border-amber-200/60">
                            {notice.bulletLines.map((b, i) => (
                              <li
                                key={i}
                                className="text-[11.5px] sm:text-[12px] text-slate-700 font-sans flex items-start gap-1.5 leading-snug"
                              >
                                <span className="text-brass-gold font-bold shrink-0">•</span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {notice.highlights && notice.highlights.length > 0 && (
                          <ul className="space-y-1.5 mb-3 bg-amber-50/40 p-2.5 rounded-lg border border-amber-200/50">
                            {notice.highlights.map((h, i) => (
                              <li
                                key={i}
                                className="text-[11.5px] sm:text-[12px] text-slate-700 font-sans flex items-start gap-1.5 leading-snug"
                              >
                                <span className="text-brass-gold font-bold shrink-0">•</span>
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Quote Box */}
                        {notice.quote && (
                          <div className="bg-white/90 p-2.5 rounded border border-border-custom/60 text-[11px] sm:text-[11.5px] text-body-text font-serif italic mb-3">
                            "{notice.quote}"
                          </div>
                        )}
                      </div>

                      {/* Bottom Action Footer */}
                      <div className="pt-3 border-t border-dashed border-border-custom flex items-center justify-between mt-auto">
                        <span className="text-[10px] sm:text-[11px] font-mono text-muted-text truncate max-w-[150px]">
                          By <strong className="text-ink-navy">{notice.createdBy}</strong>
                        </span>
                        <button
                          onClick={() => handleAction(notice.actionType)}
                          className="font-sans text-xs text-maroon hover:text-ink-navy font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer py-1"
                        >
                          <span>{notice.actionLabel}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-dashed border-border-custom text-center max-w-lg mx-auto">
                <Pin className="w-7 h-7 text-slate-300 mx-auto mb-2" />
                <p className="font-serif text-slate-700 text-sm font-semibold">
                  No circulars currently active in this category.
                </p>
                <p className="text-xs text-muted-text mt-1">
                  New official circulars posted by the Principal's Desk will appear here automatically.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* View All Notices & Admission CTA */}
        <motion.div
          variants={childItemVariants}
          className="mt-8 sm:mt-12 text-center flex flex-row items-center justify-center gap-2 sm:gap-4 w-full max-w-lg sm:max-w-none mx-auto px-1 sm:px-0"
        >
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsViewAllOpen(true)}
            className="border-ink-navy/30 text-ink-navy hover:bg-ink-navy hover:text-white uppercase font-mono font-bold tracking-tight sm:tracking-wider text-[11px] sm:text-xs px-2.5 py-2 sm:px-6 sm:py-3 flex items-center justify-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial whitespace-nowrap"
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden sm:inline">View All Notices & Archive</span>
            <span className="sm:hidden">Notices Archive</span>
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={onOpenInquiryModal}
            className="uppercase font-mono font-bold tracking-tight sm:tracking-wider text-[11px] sm:text-xs px-2.5 py-2 sm:px-6 sm:py-3 flex items-center justify-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial whitespace-nowrap"
          >
            <span className="hidden sm:inline">Admission Inquiries 2026–27</span>
            <span className="sm:hidden">Admissions 2026–27</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          </Button>
        </motion.div>
      </div>

      {/* View All Notices Archive Modal */}
      <AnimatePresence>
        {isViewAllOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="all-notices-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.25, ease: MotionEase.out }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[88vh] overflow-hidden flex flex-col shadow-2xl border border-border-custom text-slate-800"
            >
              {/* Modal Header */}
              <div className="bg-ink-navy text-white px-5 py-3.5 sm:px-8 sm:py-5 flex items-center justify-between border-b border-brass-gold/30">
                <div className="text-left">
                  <span className="font-mono text-[9.5px] sm:text-[10px] text-brass-gold uppercase tracking-[0.2em] font-bold">
                    Official Notice Archive
                  </span>
                  <h3 id="all-notices-title" className="font-serif text-lg sm:text-2xl font-bold text-white leading-tight">
                    All School Circulars
                  </h3>
                </div>
                <button
                  onClick={() => setIsViewAllOpen(false)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Modal Filter Tabs & Body */}
              <div className="p-4 sm:p-8 overflow-y-auto flex-1 text-left space-y-4 sm:space-y-6">
                {/* Category Pills */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 pb-2 border-b border-border-custom">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                        activeCategory === cat.id
                          ? "bg-gradient-to-r from-ink-navy via-[#142B54] to-ink-navy text-white shadow-sm border border-white/20"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-ink-navy border border-transparent"
                      }`}
                    >
                      {cat.name} ({allCategorizedNotices[cat.id]?.length || 0})
                    </button>
                  ))}
                </div>

                {/* List of Notices for active filter */}
                <div className="space-y-3 sm:space-y-4">
                  {currentNotices.map((notice, i) => (
                    <div
                      key={notice.id || i}
                      className="p-3.5 sm:p-5 rounded-xl border border-border-custom bg-[#FAF9F6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:border-brass-gold/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-border-custom text-ink-navy">
                            {notice.badge}
                          </span>
                          <span className="text-[11px] sm:text-xs text-muted-text font-mono">{notice.dateBadge}</span>
                        </div>
                        <h4 className="font-serif text-sm sm:text-base font-bold text-ink-navy">
                          {notice.title}
                        </h4>
                        <p className="text-xs text-muted-text font-sans max-w-2xl">
                          {notice.description}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setIsViewAllOpen(false);
                          handleAction(notice.actionType);
                        }}
                        className="font-mono text-xs font-bold text-maroon hover:text-ink-navy uppercase tracking-wider shrink-0 flex items-center gap-1 cursor-pointer self-start sm:self-center"
                      >
                        <span>{notice.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 px-5 py-3 sm:px-6 sm:py-4 border-t border-border-custom flex items-center justify-between text-[11px] sm:text-xs font-sans text-muted-text">
                <span>Principal's Office · AMPS</span>
                <Button variant="secondary" size="sm" onClick={() => setIsViewAllOpen(false)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppSection>
  );
}
