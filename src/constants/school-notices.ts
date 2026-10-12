/**
 * AMPS School Foundation Notices & Circulars Data Model
 * Single Source of Truth for core institutional notices and circular categorization.
 */

export type NoticeCategory =
  | "admissions"
  | "academics"
  | "safety"
  | "events";

export interface CoreSchoolNotice {
  id: string;
  category: NoticeCategory;
  tag: string;
  badge: string;
  badgeType: "live" | "urgent" | "foundation" | "safety" | "event";
  title: string;
  dateBadge: string;
  description: string;
  highlights?: string[];
  quote?: string;
  actionLabel: string;
  actionType: "inquiry" | "curriculum" | "safety" | "general";
  createdBy?: string;
}

/**
 * Authentic School Notices — Exactly matches "Latest from the School"
 */
export const CORE_SCHOOL_NOTICES: CoreSchoolNotice[] = [
  {
    id: "notice-admission-2026",
    category: "admissions",
    tag: "ADMISSIONS",
    badge: "URGENT NOTICE",
    badgeType: "urgent",
    title: "Admission Open 2026–27",
    dateBadge: "Session 2026–27",
    description:
      "Admissions are officially open from Playgroup (P.G.) to Senior Secondary Class XII across English & Hindi mediums. Comprehensive streams in Science, Commerce, and Arts.",
    highlights: [
      "Classes: Playgroup (P.G.) to Senior Secondary Class XII",
      "Mediums: English & Hindi Medium cohorts available",
      "Streams: Science, Commerce, and Arts (Arts stream excels)",
    ],
    actionLabel: "Apply / Inquire Now",
    actionType: "inquiry",
    createdBy: "Admission Cell",
  },
  {
    id: "notice-jee-neet",
    category: "academics",
    tag: "FOUNDATION",
    badge: "FOUNDATION",
    badgeType: "foundation",
    title: "IIT-JEE & NEET Foundation",
    dateBadge: "Classes XI & XII",
    description:
      "Dedicated in-house coaching curriculum with separate research booklets, routine evaluation tests, and doubt clearing squads to boost scientific and engineering readiness.",
    quote:
      "No need to migrate to separate tuition centers — complete integration at school.",
    highlights: [
      "Integrated competitive curriculum during school hours",
      "Daily structured doubt clearing squads",
      "Specialized Science & Mathematics faculties",
    ],
    actionLabel: "Explore Curriculum",
    actionType: "curriculum",
    createdBy: "Academic Council",
  },
  {
    id: "notice-girls-safety",
    category: "safety",
    tag: "CAMPUS SAFETY",
    badge: "SAFETY NOTICE",
    badgeType: "safety",
    title: "Safe System for Girls",
    dateBadge: "SECURE Campus",
    description:
      "A thoroughly secure, CCTV-supervised school perimeter. We provide transport vigilance systems and highly dedicated administrative guardianship for absolute parental peace of mind.",
    highlights: [
      "24/7 CCTV surveillance across all corridors & gates",
      "Verified transport vigilance & designated female bus attendants",
      "Internal Student Redressal Committee headed by senior female teachers",
    ],
    actionLabel: "Our Safety Mandate",
    actionType: "safety",
    createdBy: "Administration",
  },
];
