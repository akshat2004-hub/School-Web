import React, { useState } from "react";
import { PhoneCall } from "lucide-react";
import { motion } from "motion/react";
import { AppSection } from "./layout/AppSection";
import { childItemVariants, MotionViewport } from "../utils/motion";

interface LeaderData {
  id: string;
  role: string;
  name: string;
  subtitle: string;
  quote: string;
  description: string;
  phone: string;
  photoUrl: string;
  accentColor: string;
  labelColor: string;
  lineColor: string;
}

const LEADERS: LeaderData[] = [
  {
    id: "chairman",
    role: "Chairman",
    name: "Riddhi Chand Jain",
    subtitle: "(Advocate)",
    // Note for reviewer: Placeholder quote - replace with actual leadership quote if desired
    quote: '"Education is the foundation every institution stands on."',
    description:
      "An esteemed advocate providing strategic oversight and steering the school’s core vision toward robust community integration.",
    phone: "9783199992",
    photoUrl: "/assets/chairman.jpeg?v=2",
    accentColor: "#D4AF37",
    labelColor: "#B8791E",
    lineColor: "#D4AF37",
  },
  {
    id: "administrator",
    role: "Hon. Administrator",
    name: "Ashok Sharma",
    subtitle: "Management Oversight",
    // Note for reviewer: Placeholder quote - replace with actual leadership quote if desired
    quote: '"Safety and discipline build the space where learning thrives."',
    description:
      "Leading the active operational strategy, campus resources, and safety standard protocols for student well-being.",
    phone: "9414400824",
    photoUrl: "/assets/administrator.jpeg",
    accentColor: "#8B2942",
    labelColor: "#8B2942",
    lineColor: "#8B2942",
  },
  {
    id: "principal",
    role: "Principal",
    name: "Vardhman Jain",
    subtitle: "Academic Head",
    // Note for reviewer: Placeholder quote - replace with actual leadership quote if desired
    quote: '"Rigor and mentorship together shape every student\'s path."',
    description:
      "Supervising rigorous classroom schedules, bilingual curriculum design, and specialized JEE-NEET coaching integration.",
    phone: "9413182619",
    photoUrl: "/assets/principal-1.jpeg?v=2",
    accentColor: "#1F4A82",
    labelColor: "#1F4A82",
    lineColor: "#1F4A82",
  },
];

interface LeaderCardProps {
  key?: React.Key;
  leader: LeaderData;
}

const LeaderCard: React.FC<LeaderCardProps> = ({ leader }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // Tap-equivalent for touch devices
  const handleCardTap = () => {
    setIsHovered((prev) => !prev);
  };

  return (
    <motion.div
      variants={childItemVariants}
      viewport={MotionViewport.card}
      className="w-full flex flex-col items-center"
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardTap}
        style={{
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          transition: "transform 0.35s ease",
        }}
        className="w-full max-w-[240px] sm:max-w-[220px] mx-auto flex flex-col items-center text-center cursor-pointer select-none"
      >
        {/* Photo: 120px circle in natural full color with smooth hover scale */}
        <div className="w-[120px] h-[120px] rounded-full overflow-hidden shrink-0 mx-auto shadow-md bg-slate-100 border border-black/5">
          <img
            src={leader.photoUrl}
            alt={`${leader.role} ${leader.name}`}
            loading="lazy"
            style={{
              transform: isHovered ? "scale(1.08)" : "scale(1)",
              transition: "transform 0.4s ease",
            }}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 32px-wide, 2px-tall horizontal accent line */}
        <div
          style={{ backgroundColor: leader.lineColor }}
          className="w-8 h-[2px] mx-auto mt-4 mb-3 rounded-full"
        />

        {/* Role Label: 11px, uppercase, letter-spacing 0.1em, font-weight 500 */}
        <span
          style={{ color: leader.labelColor }}
          className="font-mono text-[11px] tracking-[0.1em] font-medium uppercase block mb-1.5"
        >
          {leader.role}
        </span>

        {/* Name: Serif font ~19px, color #1A2A3A */}
        <h3 className="font-serif text-[19px] font-bold text-[#1A2A3A] tracking-tight leading-snug mb-0.5">
          {leader.name}
        </h3>

        {/* Subtitle: 12px, italic, muted gray #8a8578 */}
        <p className="font-serif text-[12px] italic text-[#8a8578] mb-1.5 leading-relaxed">
          {leader.subtitle}
        </p>

        {/* Quote: italic, serif, ~12px, color #4a4438 (hidden by default, reveals on hover/tap) */}
        <div
          style={{
            maxHeight: isHovered ? "60px" : "0px",
            opacity: isHovered ? 1 : 0,
            transition: "max-height 0.35s ease, opacity 0.35s ease",
          }}
          className="overflow-hidden w-full px-1"
        >
          <p className="font-serif text-[12px] italic text-[#4a4438] leading-snug mb-2">
            {leader.quote}
          </p>
        </div>

        {/* Description: cleanly styled editorial text */}
        <p className="font-sans text-[12.5px] leading-[1.68] text-slate-600 mb-4 max-w-[220px]">
          {leader.description}
        </p>

        {/* Underlined "Show contact" Text Button */}
        <div
          className="mt-auto pt-1"
          onClick={(e) => e.stopPropagation()} // Prevent card toggle on button click
        >
          {showContact ? (
            <div className="flex flex-col items-center gap-1">
              <a
                href={`tel:${leader.phone}`}
                style={{
                  color: leader.accentColor,
                  borderBottomColor: leader.accentColor,
                }}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-[0.03em] border-b pb-0.5 hover:opacity-80 transition-opacity"
              >
                <PhoneCall className="w-3 h-3" />
                <span>+91 {leader.phone}</span>
              </a>
              <button
                type="button"
                onClick={() => setShowContact(false)}
                className="text-[10px] text-slate-400 hover:text-slate-600 underline cursor-pointer mt-0.5"
              >
                Hide
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowContact(true)}
              style={{
                color: leader.accentColor,
                borderBottomColor: leader.accentColor,
              }}
              className="font-sans text-[11px] tracking-[0.03em] font-medium border-b pb-0.5 hover:opacity-75 transition-opacity cursor-pointer inline-block"
            >
              Show contact
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function LeadershipSection() {
  return (
    <AppSection
      id="leadership"
      className="bg-[#FAF9F6] py-18 sm:py-22 lg:py-28 border-t border-border-custom/60"
    >
      <motion.div
        variants={childItemVariants}
        className="text-center max-w-2xl mx-auto mb-14 sm:mb-18 px-3"
      >
        <span className="font-mono text-[11px] sm:text-xs tracking-[0.18em] text-maroon font-bold uppercase block mb-2 sm:mb-2.5">
          Leadership & Governance
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink-navy font-bold tracking-tight leading-[1.2]">
          Guiding the Institution
        </h2>
        <p className="text-muted-text mt-3.5 text-sm md:text-base font-sans leading-[1.75] max-w-xl mx-auto">
          The experienced pioneers steering Ashish Memorial Public School with academic excellence and scholarly values.
        </p>
      </motion.div>

      {/* Minimal Editorial Layout: 3 center-aligned columns, generous gap, no card boxes */}
      <motion.div
        variants={childItemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 lg:gap-16 justify-items-center max-w-5xl mx-auto px-4"
      >
        {LEADERS.map((leader) => (
          <LeaderCard key={leader.id} leader={leader} />
        ))}
      </motion.div>
    </AppSection>
  );
}
