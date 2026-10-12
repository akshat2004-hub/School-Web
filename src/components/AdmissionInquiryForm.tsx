import React, { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Mail,
  User,
  GraduationCap,
  Clock,
  Headphones,
  BookOpen,
  Users,
  ShieldCheck,
  FileText,
  ArrowRight,
  ExternalLink,
  Lock,
  Compass,
  Check,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AppSection } from "./layout/AppSection";
import { MagneticButton } from "./ui/MagneticButton";
import { childItemVariants } from "../utils/motion";
import InquiryModal from "./InquiryModal";

const HIGHLIGHT_BADGES = [
  {
    icon: GraduationCap,
    title: "RBSE Curriculum",
    subtitle: "Rajasthan State Board"
  },
  {
    icon: Users,
    title: "Experienced Faculty",
    subtitle: "Student Focused"
  },
  {
    icon: ShieldCheck,
    title: "Safe & Nurturing",
    subtitle: "Environment"
  }
];

interface AdmissionInquiryFormProps {
  presetMessage?: string;
  prefillMessage?: string;
  formContext?: "admission" | "counselling";
  onOpenInquiryModal?: () => void;
}

export default function AdmissionInquiryForm({
  presetMessage,
  prefillMessage,
  formContext = "admission",
  onOpenInquiryModal
}: AdmissionInquiryFormProps = {}) {
  const initialMsg = prefillMessage || presetMessage || "";

  // Mobile Rotating Highlights State (changes every 2.2s)
  const [activeBadgeIndex, setActiveBadgeIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBadgeIndex((prev) => (prev + 1) % HIGHLIGHT_BADGES.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  // Mobile Popup Modal State
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  const handleOpenAdmissionModal = () => {
    if (onOpenInquiryModal) {
      onOpenInquiryModal();
    } else {
      setIsMobileModalOpen(true);
    }
  };

  // Contact Inquiry State
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState(initialMsg);

  // Validation State & Helpers
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const cleanPhoneNumber = (val: string) => {
    return val.replace(/[\s\-\+\(\)]/g, "").replace(/^91(?=\d{10}$)/, "");
  };

  const validatePhone = (val: string): string | null => {
    const cleaned = cleanPhoneNumber(val);
    if (!cleaned) return "Mobile number is required.";
    if (!/^[6-9]\d{9}$/.test(cleaned)) {
      return "Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.";
    }
    return null;
  };

  const COMMON_DOMAIN_TYPOS: Record<string, string> = {
    "gmai.com": "gmail.com",
    "gmial.com": "gmail.com",
    "gamil.com": "gmail.com",
    "gmail.co": "gmail.com",
    "gmail.cm": "gmail.com",
    "gmal.com": "gmail.com",
    "yaho.com": "yahoo.com",
    "yahoo.co": "yahoo.com",
    "hotmai.com": "hotmail.com",
    "outlok.com": "outlook.com"
  };

  const validateEmail = (val: string): string | null => {
    const trimmed = val.trim().toLowerCase();
    if (!trimmed) return "Email address is required.";

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      return "Please enter a valid email address (e.g. name@gmail.com).";
    }

    const parts = trimmed.split("@");
    const domain = parts[1] || "";
    if (domain.includes("..") || domain.startsWith(".") || domain.endsWith(".")) {
      return "Email domain format is invalid.";
    }

    if (COMMON_DOMAIN_TYPOS[domain]) {
      return `Did you mean ${parts[0]}@${COMMON_DOMAIN_TYPOS[domain]}?`;
    }

    const tld = domain.split(".").pop();
    if (!tld || tld.length < 2 || !/^[a-z]+$/.test(tld)) {
      return "Please enter a valid domain extension (e.g. .com, .in, .org).";
    }

    return null;
  };

  React.useEffect(() => {
    const msg = prefillMessage || presetMessage;
    if (msg !== undefined) {
      setInquiryMessage(msg);
    }
  }, [prefillMessage, presetMessage]);

  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquiryError, setInquiryError] = useState<string | null>(null);

  // Advanced dispatch fallback states
  const [emailSent, setEmailSent] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState("Pending");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  // OTP Verification States
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  React.useEffect(() => {
    let interval: any = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOtp = async () => {
    setPhoneTouched(true);
    setEmailTouched(true);
    const pErr = validatePhone(inquiryPhone);
    const eErr = validateEmail(inquiryEmail);
    setPhoneError(pErr);
    setEmailError(eErr);

    if (!inquiryName || pErr || eErr) {
      setOtpError("Please enter a valid Name, Mobile number, and Email address first.");
      return;
    }

    setOtpSending(true);
    setOtpError(null);
    setOtpSuccess(null);

    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inquiryEmail.trim(),
          name: inquiryName,
          formContext
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setOtpSent(true);
        setResendTimer(60);
        setOtpSuccess(`OTP code sent to ${inquiryEmail.trim()}. Please check your email inbox.`);
      } else {
        throw new Error(data.message || "Failed to send OTP code.");
      }
    } catch (err: any) {
      console.error("[OTP Send Error]", err);
      setOtpError(err.message || "Could not send OTP. Please try again.");
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.trim().length !== 6) {
      setOtpError("Please enter the 6-digit OTP verification code.");
      return;
    }

    setOtpVerifying(true);
    setOtpError(null);
    setOtpSuccess(null);

    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inquiryEmail.trim(),
          otp: otpCode.trim()
        })
      });
      const data = await response.json();
      if (response.ok && (data.verified || data.success)) {
        setOtpVerified(true);
        setOtpError(null);
        setOtpSuccess("Email address verified successfully!");
      } else {
        throw new Error(data.message || "Incorrect OTP code.");
      }
    } catch (err: any) {
      console.error("[OTP Verification Error]", err);
      setOtpError(err.message || "Invalid OTP code. Please try again.");
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneTouched(true);
    setEmailTouched(true);

    const pErr = validatePhone(inquiryPhone);
    const eErr = validateEmail(inquiryEmail);
    setPhoneError(pErr);
    setEmailError(eErr);

    if (!inquiryName || pErr || eErr) return;

    let isVerified = otpVerified;

    if (!isVerified) {
      if (!otpSent) {
        handleSendOtp();
        return;
      }

      if (!otpCode || otpCode.trim().length !== 6) {
        setOtpError("Please enter the 6-digit OTP code sent to your email.");
        return;
      }

      setOtpVerifying(true);
      setOtpError(null);
      try {
        const verifyRes = await fetch("/api/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: inquiryEmail.trim(),
            otp: otpCode.trim()
          })
        });
        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.verified) {
          setOtpVerified(true);
          setOtpSuccess("Email address verified successfully!");
          isVerified = true;
        } else {
          setOtpError(verifyData.message || "Incorrect OTP code. Please try again.");
          setOtpVerifying(false);
          return;
        }
      } catch (err: any) {
        setOtpError(err.message || "Invalid OTP code. Please try again.");
        setOtpVerifying(false);
        return;
      } finally {
        setOtpVerifying(false);
      }
    }

    setInquirySubmitting(true);
    setInquiryError(null);

    const cleanedPhone = cleanPhoneNumber(inquiryPhone);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inquiryName,
          phone: cleanedPhone,
          email: inquiryEmail.trim(),
          message: inquiryMessage,
          formContext: formContext
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setInquirySubmitted(true);
        setEmailSent(!!data.emailSent);
        setDispatchStatus(data.dispatchStatus || "SavedToDatabase");
        setWhatsappUrl(data.whatsappUrl || "");
      } else {
        throw new Error(data.message || "Failed to process inquiry.");
      }
    } catch (err: any) {
      console.error("[Inquiry Error]", err);
      setInquiryError(err.message || "Something went wrong. Please check your network.");
    } finally {
      setInquirySubmitting(false);
    }
  };

  const resetForm = () => {
    setInquirySubmitted(false);
    setInquiryError(null);
    setInquiryName("");
    setInquiryPhone("");
    setInquiryEmail("");
    setInquiryMessage(initialMsg);
    setOtpSent(false);
    setOtpVerified(false);
    setOtpCode("");
    setPhoneTouched(false);
    setEmailTouched(false);
    setOtpError(null);
    setOtpSuccess(null);
  };

  const scrollToAdmissionForm = () => {
    const target = document.getElementById("admission-inquiry-form-card");
    if (target) {
      const headerOffset = 90;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setTimeout(() => {
        const firstInput = target.querySelector<HTMLInputElement>("input");
        if (firstInput) {
          firstInput.focus({ preventScroll: true });
        }
      }, 500);
    }
  };

  return (
    <AppSection
      id="contact"
      disableContainer={true}
      className="relative py-12 sm:py-16 lg:py-20 overflow-hidden bg-gradient-to-b from-[#EFF6FF]/60 via-[#FAF9F6] to-[#F8F9FA] border-t border-border-custom/50"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-48 left-0 w-[450px] h-[450px] bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Full-Width Responsive Container: 1440px max width with 32-48px horizontal desktop padding */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 relative z-10">
        
        {/* ONE Complete, Unified Two-Column Grid: 58% Left Content | 42% Right Form (28-32px gap) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-start">
          
          {/* =========================================================================
              LEFT COLUMN (58% width - lg:col-span-7)
              Contains: Hero introduction, 3 highlights, 3 contact cards, Location reference
             ========================================================================= */}
          <motion.div variants={childItemVariants} className="lg:col-span-7 flex flex-col space-y-5 sm:space-y-6">
            
            {/* 1. Hero Introduction Header */}
            <div className="text-left space-y-2.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs sm:text-sm font-extrabold tracking-[0.2em] text-brass-gold uppercase">
                  Admissions
                </span>
                <div className="w-12 h-[2px] bg-brass-gold/70 rounded-full" />
              </div>

              <h2 className="font-serif text-[34px] sm:text-[40px] lg:text-[44px] xl:text-[48px] font-bold text-ink-navy tracking-tight leading-[1.14]">
                Let’s Begin Your{" "}
                <span className="text-brass-gold font-bold">Child’s Bright Future</span>
              </h2>

              <p className="text-slate-600 text-[15px] sm:text-base font-sans leading-[1.6] max-w-xl">
                Have a question about admissions, class availability or campus facilities? Our admissions team is here to help you with all the information you need.
              </p>
            </div>

            {/* 2. School Highlights: 3 Columns on Desktop, Auto-Rotating 1 Card on Mobile */}
            
            {/* Desktop View (sm and above): 3 Side-by-Side Badges */}
            <div className="hidden sm:grid sm:grid-cols-3 gap-3">
              {HIGHLIGHT_BADGES.map((badge, idx) => {
                const IconComponent = badge.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-white/90 backdrop-blur-xs p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-brass-gold/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-50/90 border border-amber-200/70 flex items-center justify-center text-brass-gold shrink-0">
                      <IconComponent className="w-5 h-5 text-brass-gold" />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="font-serif font-bold text-xs sm:text-[13.5px] text-ink-navy leading-snug truncate">
                        {badge.title}
                      </p>
                      <p className="text-[11px] text-slate-500 font-sans mt-0.5 leading-tight truncate">
                        {badge.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile View (below sm): Auto-Rotating 1 Card Every 2.2 Seconds */}
            <div className="sm:hidden w-full relative h-[60px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBadgeIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="w-full flex items-center justify-between gap-3 bg-white/95 p-2.5 rounded-2xl border border-slate-200/90 shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-amber-50/90 border border-amber-200/70 flex items-center justify-center text-brass-gold shrink-0">
                      {React.createElement(HIGHLIGHT_BADGES[activeBadgeIndex].icon, {
                        className: "w-4.5 h-4.5 text-brass-gold"
                      })}
                    </div>
                    <div className="text-left min-w-0">
                      <p className="font-sans font-semibold text-xs text-ink-navy leading-snug truncate">
                        {HIGHLIGHT_BADGES[activeBadgeIndex].title}
                      </p>
                      <p className="text-[11px] text-slate-500 font-sans mt-0.5 leading-tight truncate">
                        {HIGHLIGHT_BADGES[activeBadgeIndex].subtitle}
                      </p>
                    </div>
                  </div>

                  {/* 3 Active Indicator Pills */}
                  <div className="flex items-center gap-1.5 shrink-0 pr-1.5">
                    {HIGHLIGHT_BADGES.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveBadgeIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          activeBadgeIndex === i
                            ? "w-4 bg-brass-gold"
                            : "w-1.5 bg-slate-200"
                        }`}
                        aria-label={`Highlight slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 3. Three Aligned Contact Cards (Single Row on Desktop 768px+, 3 Stacked Horizontal Cards on Mobile <768px) */}
            
            {/* Desktop View (768px and above): Single Row of 3 Cards (~200-215px height) */}
            <div className="hidden md:grid md:grid-cols-3 gap-3.5 sm:gap-4">
              
              {/* Card 1: School Campus */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-brass-gold/40 transition-all flex flex-col justify-between text-left h-auto sm:min-h-[200px] lg:h-[210px] xl:h-[215px]">
                <div>
                  <div className="w-10 h-10 bg-amber-50 rounded-xl border border-amber-200/70 flex items-center justify-center text-brass-gold mb-3 shadow-2xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-[16px] sm:text-[17px] font-bold text-ink-navy mb-1.5 leading-snug">
                    School Campus
                  </h3>
                  <p className="text-slate-600 text-[13px] leading-relaxed font-sans line-clamp-3">
                    Behind Patthar Walo Ki Dharamshala, New Jyoti Nagar, Hindaun City, Karauli (Raj.) 322230
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <a
                    href="https://maps.google.com/?q=Ashish+Memorial+Public+Senior+Secondary+School+Hindaun+City"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-brass-gold hover:text-ink-navy transition-colors bg-amber-50/80 px-3 py-1 rounded-full border border-amber-200/60 w-fit"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Get Directions →</span>
                  </a>
                </div>
              </div>

              {/* Card 2: Call Administration */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-brass-gold/40 transition-all flex flex-col justify-between text-left h-auto sm:min-h-[200px] lg:h-[210px] xl:h-[215px]">
                <div>
                  <div className="w-10 h-10 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-ink-navy mb-3 shadow-2xs">
                    <Phone className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-[16px] sm:text-[17px] font-bold text-ink-navy mb-1.5 leading-snug">
                    Call Administration
                  </h3>
                  <div className="space-y-1">
                    <a
                      href="tel:9116304006"
                      className="block font-mono text-sm font-bold text-ink-navy hover:text-brass-gold transition-colors"
                    >
                      91163 04006
                    </a>
                    <a
                      href="tel:9783199992"
                      className="block font-mono text-sm font-bold text-ink-navy hover:text-brass-gold transition-colors"
                    >
                      97831 99992
                    </a>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-mono text-brass-gold font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Hours: 8 AM – 3 PM</span>
                </div>
              </div>

              {/* Card 3: Email Address */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-brass-gold/40 transition-all flex flex-col justify-between text-left h-auto sm:min-h-[200px] lg:h-[210px] xl:h-[215px]">
                <div>
                  <div className="w-10 h-10 bg-rose-50 rounded-xl border border-rose-200 text-maroon mb-3 shadow-2xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-[16px] sm:text-[17px] font-bold text-ink-navy mb-1.5 leading-snug">
                    Email Address
                  </h3>
                  <a
                    href="mailto:ampspankaj@gmail.com"
                    className="font-mono text-[13px] font-semibold text-slate-700 hover:text-maroon transition-colors break-all block"
                  >
                    ampspankaj@gmail.com
                  </a>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-mono text-slate-500 font-medium">
                  <Headphones className="w-3.5 h-3.5 text-brass-gold" />
                  <span>24/7 Digital Desk</span>
                </div>
              </div>

            </div>

            {/* Mobile View (below 768px): Only 2 Combined Compact Cards (Call + Email, and Campus + Location) */}
            <div className="md:hidden flex flex-col gap-3">
              
              {/* Mobile Card 1: Combined Call Administration & Email Address */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs text-left divide-y divide-slate-100">
                {/* Section A: Call Administration */}
                <div className="flex items-center gap-3 pb-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-ink-navy shrink-0">
                    <Phone className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="font-sans text-[13.5px] font-semibold text-slate-800">
                        Call Administration
                      </span>
                      <span className="text-[10px] font-sans text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 shrink-0 font-medium">
                        8 AM – 3 PM
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 mt-0.5 font-sans text-xs text-slate-600 font-normal">
                      <a
                        href="tel:9116304006"
                        className="hover:text-brass-gold transition-colors"
                      >
                        91163 04006
                      </a>
                      <span className="text-slate-300">•</span>
                      <a
                        href="tel:9783199992"
                        className="hover:text-brass-gold transition-colors"
                      >
                        97831 99992
                      </a>
                    </div>
                  </div>
                </div>

                {/* Section B: Email Address */}
                <div className="flex items-center gap-3 pt-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50/70 border border-rose-200/70 text-maroon flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-rose-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="font-sans text-[13.5px] font-semibold text-slate-800">
                        Email Address
                      </span>
                      <span className="text-[10px] font-sans text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200/60 shrink-0 font-medium">
                        24/7 Desk
                      </span>
                    </div>
                    <a
                      href="mailto:ampspankaj@gmail.com"
                      className="font-sans text-xs text-slate-600 hover:text-maroon transition-colors truncate block mt-0.5 font-normal"
                    >
                      ampspankaj@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Mobile Card 2: Combined School Campus & Location Reference */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs text-left space-y-2.5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50/70 border border-amber-200/70 flex items-center justify-center text-brass-gold shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-amber-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="font-sans text-[13.5px] font-semibold text-slate-800">
                        School Campus & Location
                      </span>
                      <a
                        href="https://maps.google.com/?q=Ashish+Memorial+Public+Senior+Secondary+School+Hindaun+City"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10.5px] font-sans font-medium text-brass-gold hover:text-ink-navy transition-colors bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 shrink-0"
                      >
                        <span>Directions →</span>
                      </a>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed font-sans mt-0.5 font-normal">
                      Behind Patthar Walo Ki Dharamshala, New Jyoti Nagar, Hindaun City, Karauli district. Easy bus & auto connectivity.
                    </p>
                  </div>
                </div>

                {/* Stylized Interactive Map Preview */}
                <a
                  href="https://maps.google.com/?q=Ashish+Memorial+Public+Senior+Secondary+School+Hindaun+City"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-full h-[105px] rounded-xl overflow-hidden border border-slate-300/80 bg-[#E2E8F0]/50 p-2.5 flex flex-col justify-between group hover:border-brass-gold transition-all block cursor-pointer shadow-inner"
                  title="Click to view campus location on Google Maps"
                >
                  <div className="absolute inset-0 opacity-45 pointer-events-none">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="mapgrid-mobile-single" width="32" height="32" patternUnits="userSpaceOnUse">
                          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#94A3B8" strokeWidth="1.2" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#mapgrid-mobile-single)" />
                      <path d="M -10 20 L 260 110" stroke="#FFFFFF" strokeWidth="6" />
                      <path d="M 50 -10 L 90 150" stroke="#FFFFFF" strokeWidth="4.5" />
                      <rect x="20" y="60" width="32" height="22" rx="4" fill="#86EFAC" opacity="0.7" />
                      <rect x="150" y="12" width="40" height="30" rx="4" fill="#86EFAC" opacity="0.6" />
                    </svg>
                  </div>

                  <div className="relative z-10 flex justify-between items-start text-[10px] font-mono text-slate-600 font-semibold">
                    <span className="bg-white/95 px-2 py-0.5 rounded shadow-2xs border border-slate-200/80">
                      📍 Campus Pin
                    </span>
                    <span className="bg-white/95 px-2 py-0.5 rounded shadow-2xs border border-slate-200/80 text-brass-gold font-bold flex items-center gap-1">
                      View on Google Maps <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </div>

                  <div className="relative z-10 my-auto text-center flex flex-col items-center">
                    <div className="w-6.5 h-6.5 rounded-full bg-red-600 border-2 border-white shadow-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <MapPin className="w-3.5 h-3.5 fill-white" />
                    </div>
                    <div className="bg-white/95 border border-slate-200 px-2 py-0.5 rounded shadow-xs text-[10px] font-bold text-ink-navy mt-1 max-w-[175px] truncate">
                      Ashish Memorial School
                    </div>
                  </div>

                  <div className="relative z-10 text-[9px] font-mono text-slate-600 bg-white/95 px-2 py-0.5 rounded self-start border border-slate-200/80">
                    New Jyoti Nagar
                  </div>
                </a>
              </div>

            </div>

            {/* 4. Desktop-Only Location Reference Section (768px and above, Full Width, Map Preview ~190-210px) */}
            <div className="hidden md:flex w-full bg-white rounded-2xl border border-slate-200 p-5 sm:p-5.5 shadow-xs flex-col md:flex-row gap-5 items-stretch justify-between text-left">
              <div className="flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-3">
                <div className="flex items-start gap-3 sm:gap-3.5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-brass-gold shrink-0 shadow-2xs">
                    <MapPin className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base sm:text-lg font-bold text-ink-navy leading-snug">
                      Location Reference
                    </h4>
                    <p className="text-slate-600 text-xs sm:text-[13px] md:text-sm mt-0.5 sm:mt-1 font-sans leading-relaxed max-w-lg">
                      Located behind Patthar Walo Ki Dharamshala, New Jyoti Nagar, Hindaun City, Karauli district. Easy bus and auto connectivity.
                    </p>
                  </div>
                </div>

                <div className="pt-2.5 sm:pt-3 border-t border-slate-100">
                  <a
                    href="https://maps.google.com/?q=Ashish+Memorial+Public+Senior+Secondary+School+Hindaun+City"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-slate-300 hover:border-brass-gold bg-slate-50 hover:bg-white text-ink-navy text-[11px] sm:text-xs font-mono font-bold transition-all shadow-xs w-fit"
                  >
                    <Compass className="w-3.5 h-3.5 text-brass-gold" />
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>

              {/* Stylized Map Preview (~190-210px wide on desktop) */}
              <a
                href="https://maps.google.com/?q=Ashish+Memorial+Public+Senior+Secondary+School+Hindaun+City"
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-full md:w-[190px] lg:w-[200px] xl:w-[210px] h-[105px] sm:h-[125px] md:h-auto rounded-xl overflow-hidden border border-slate-300/80 bg-[#E2E8F0]/50 p-2.5 flex flex-col justify-between group hover:border-brass-gold transition-all shrink-0 cursor-pointer shadow-inner"
                title="Click to view campus location on Google Maps"
              >
                {/* Vector map road lines */}
                <div className="absolute inset-0 opacity-45 pointer-events-none">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="mapgrid" width="32" height="32" patternUnits="userSpaceOnUse">
                        <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#94A3B8" strokeWidth="1.2" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#mapgrid)" />
                    <path d="M -10 20 L 260 110" stroke="#FFFFFF" strokeWidth="6" />
                    <path d="M 50 -10 L 90 150" stroke="#FFFFFF" strokeWidth="4.5" />
                    <rect x="20" y="60" width="32" height="22" rx="4" fill="#86EFAC" opacity="0.7" />
                    <rect x="150" y="12" width="40" height="30" rx="4" fill="#86EFAC" opacity="0.6" />
                  </svg>
                </div>

                <div className="relative z-10 flex justify-between items-start text-[10px] font-mono text-slate-600 font-semibold">
                  <span className="bg-white/95 px-2 py-0.5 rounded shadow-2xs border border-slate-200/80">
                    📍 Hindaun City
                  </span>
                </div>

                <div className="relative z-10 my-auto text-center flex flex-col items-center">
                  <div className="w-6.5 h-6.5 rounded-full bg-red-600 border-2 border-white shadow-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <MapPin className="w-3.5 h-3.5 fill-white" />
                  </div>
                  <div className="bg-white/95 border border-slate-200 px-2 py-0.5 rounded shadow-xs text-[10px] font-bold text-ink-navy mt-1 max-w-[175px] truncate group-hover:border-brass-gold">
                    Ashish Memorial School
                  </div>
                </div>

                <div className="relative z-10 text-[9px] font-mono text-slate-600 bg-white/95 px-2 py-0.5 rounded self-start border border-slate-200/80">
                  New Jyoti Nagar
                </div>
              </a>
            </div>

            {/* 5. Mobile Admission Inquiry CTA Option (Immediately Below Location, lg:hidden) */}
            <div className="block lg:hidden w-full bg-white rounded-2xl border border-brass-gold/50 p-4 sm:p-5 shadow-xs text-left relative overflow-hidden bg-gradient-to-r from-amber-50/60 via-white to-sky-50/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-brass-gold font-mono text-[11px] font-bold uppercase tracking-wider">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Admissions Open 2026–27</span>
                  </div>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-ink-navy leading-snug">
                    Interested in Admission?
                  </h4>
                  <p className="text-slate-600 text-xs sm:text-[13px] font-sans leading-relaxed">
                    Have questions about admissions or class availability? Send your inquiry directly to our desk.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAdmissionModal}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-brass-gold hover:bg-brass-gold/90 text-ink-navy text-xs sm:text-sm font-bold font-mono shadow-sm hover:shadow-md transition-all active:scale-95 shrink-0 w-full sm:w-auto cursor-pointer"
                >
                  <span>Send Admission Inquiry</span>
                  <ArrowRight className="w-4 h-4 text-ink-navy" />
                </button>
              </div>
            </div>

          </motion.div>


          {/* =========================================================================
              RIGHT COLUMN (42% width - Desktop lg:col-span-5, Hidden on Mobile)
              Begins at the same top alignment as Left Column!
              Contains: Full-Width Admission Inquiry Form Card
             ========================================================================= */}
          <motion.div variants={childItemVariants} className="hidden lg:block lg:col-span-5 w-full">
            
            {/* Full-Width Admission Inquiry Form Card */}
            <div
              id="admission-inquiry-form-card"
              className="w-full bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden relative text-slate-800 scroll-mt-24"
            >
              
              {/* Header Navy Banner */}
              <div className="bg-gradient-to-r from-[#0A1931] via-[#0E2244] to-[#142B54] p-6 sm:p-7 text-white relative overflow-hidden text-left">
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-brass-gold/15 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-start justify-between relative z-10">
                  <div className="pr-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-brass-gold block mb-1">
                      {formContext === "counselling" ? "Academic Guidance Desk" : "Instant Advisory Desk"}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-[26px] font-bold tracking-tight text-white leading-snug">
                      {formContext === "counselling" ? "Book Stream Counselling" : "Send a Quick Admission Inquiry"}
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-[13px] font-sans mt-1 leading-snug">
                      Fill in your details and our team will get back to you shortly.
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-brass-gold shrink-0 shadow-inner">
                    <GraduationCap className="w-6 h-6 text-brass-gold" />
                  </div>
                </div>
              </div>

              {/* Form Body */}
              <div className="p-6 sm:p-7 lg:p-8 text-left">
                {inquirySubmitted ? (
                  dispatchStatus === "Failed" ? (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto text-rose-600 font-bold text-lg">
                        ⚠️
                      </div>
                      <h4 className="font-serif font-bold text-lg text-rose-900">
                        Failed to Send Inquiry
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                        We were unable to deliver your email inquiry right now. Please call us directly at <a href="tel:9116304006" className="font-bold text-ink-navy underline">91163 04006</a> or connect via WhatsApp below.
                      </p>
                      {whatsappUrl && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:brightness-105 text-white font-mono text-xs font-bold uppercase tracking-wider h-[50px] px-6 rounded-full transition-all border border-emerald-400/30 shadow-md cursor-pointer"
                        >
                          💬 Connect via WhatsApp Instead
                        </a>
                      )}
                      <button
                        onClick={resetForm}
                        className="font-mono text-xs uppercase tracking-wider text-slate-600 hover:underline block mx-auto font-bold cursor-pointer pt-2"
                      >
                        ← Try Again
                      </button>
                    </div>
                  ) : (
                    <div className="bg-emerald-50/90 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
                        <svg className="w-6 h-6 stroke-emerald-600" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <motion.path
                            d="M20 6L9 17l-5-5"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </svg>
                      </div>
                      <h4 className="font-serif font-bold text-lg text-emerald-900">
                        Inquiry Sent Successfully!
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                        Thank you! Your admission inquiry has been successfully submitted to <strong>Ashish Memorial Public Sr. Sec. School</strong>. Our admissions team will get in touch with you shortly.
                      </p>

                      {whatsappUrl && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:brightness-105 text-white font-mono text-xs font-bold uppercase tracking-wider h-[50px] px-6 rounded-full transition-all border border-emerald-400/30 shadow-md cursor-pointer"
                        >
                          💬 Connect via WhatsApp
                        </a>
                      )}

                      <button
                        onClick={resetForm}
                        className="font-mono text-xs uppercase tracking-wider text-slate-600 hover:underline block mx-auto font-bold cursor-pointer pt-2"
                      >
                        ← Send Another Inquiry
                      </button>
                    </div>
                  )
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3.5 sm:space-y-4 font-sans">
                    {inquiryError && (
                      <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs sm:text-sm">
                        ⚠️ {inquiryError}
                      </div>
                    )}

                    {/* Field 1: PARENT / STUDENT NAME */}
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Parent / Student Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          placeholder="Parent or Student Name"
                          value={inquiryName}
                          onChange={(e) => setInquiryName(e.target.value)}
                          disabled={inquirySubmitting}
                          className="w-full pl-10 pr-4 h-[44px] sm:h-[46px] bg-white border border-slate-200 hover:border-slate-300 focus:border-brass-gold focus:ring-2 focus:ring-brass-gold/20 rounded-xl transition-all duration-200 outline-none text-slate-800 text-sm shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Field 2: MOBILE NUMBER (WHATSAPP) */}
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Mobile Number (WhatsApp) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          maxLength={15}
                          placeholder="10-digit WhatsApp number"
                          value={inquiryPhone}
                          onChange={(e) => {
                            setInquiryPhone(e.target.value);
                            if (phoneTouched) setPhoneError(validatePhone(e.target.value));
                          }}
                          onBlur={() => {
                            setPhoneTouched(true);
                            setPhoneError(validatePhone(inquiryPhone));
                          }}
                          disabled={inquirySubmitting}
                          className={`w-full pl-10 pr-4 h-[44px] sm:h-[46px] bg-white border rounded-xl transition-all duration-200 outline-none text-slate-800 text-sm shadow-2xs ${
                            phoneTouched && phoneError
                              ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/20"
                              : "border-slate-200 hover:border-slate-300 focus:border-brass-gold focus:ring-2 focus:ring-brass-gold/20"
                          }`}
                        />
                      </div>
                      {phoneTouched && phoneError && (
                        <p className="text-xs text-rose-600 font-sans mt-1 font-medium">
                          ⚠️ {phoneError}
                        </p>
                      )}
                    </div>

                    {/* Field 3: EMAIL ADDRESS & SEND OTP BUTTON ALIGNED */}
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={inquiryEmail}
                          onChange={(e) => {
                            setInquiryEmail(e.target.value);
                            if (emailTouched) setEmailError(validateEmail(e.target.value));
                            if (otpSent) {
                              setOtpSent(false);
                              setOtpVerified(false);
                              setOtpCode("");
                              setOtpSuccess(null);
                            }
                          }}
                          onBlur={() => {
                            setEmailTouched(true);
                            setEmailError(validateEmail(inquiryEmail));
                          }}
                          disabled={inquirySubmitting}
                          className={`w-full pl-10 pr-28 h-[44px] sm:h-[46px] bg-white border rounded-xl transition-all duration-200 outline-none text-slate-800 text-sm shadow-2xs ${
                            emailTouched && emailError
                              ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/20"
                              : otpVerified
                              ? "border-emerald-500 bg-emerald-50/20"
                              : "border-slate-200 hover:border-slate-300 focus:border-brass-gold focus:ring-2 focus:ring-brass-gold/20"
                          }`}
                        />
                        {!otpVerified && (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={otpSending || Boolean(validateEmail(inquiryEmail)) || !inquiryEmail.trim()}
                            className="absolute right-1.5 bg-gradient-to-r from-brass-gold via-[#E2BF48] to-[#C9A227] hover:brightness-105 text-ink-navy font-mono text-[11px] font-bold uppercase tracking-wider px-3.5 h-[36px] rounded-full transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                          >
                            {otpSending ? (
                              <span className="w-3 h-3 border-2 border-ink-navy/30 border-t-ink-navy rounded-full animate-spin" />
                            ) : otpSent ? (
                              "Resend OTP"
                            ) : (
                              "Send OTP"
                            )}
                          </button>
                        )}
                        {otpVerified && (
                          <span className="absolute right-3 inline-flex items-center gap-1 text-emerald-600 text-xs font-bold font-mono">
                            <Check className="w-4 h-4" /> Verified
                          </span>
                        )}
                      </div>
                      {emailTouched && emailError && (
                        <p className="text-xs text-rose-600 font-sans mt-1 font-medium">
                          ⚠️ {emailError}
                        </p>
                      )}

                      {/* Inline OTP Verification Box */}
                      {otpSent && !otpVerified && (
                        <div className="mt-2.5 bg-amber-50/90 border border-amber-200 p-3.5 rounded-xl space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                              🔒 Enter 6-Digit Code
                            </span>
                            {resendTimer > 0 ? (
                              <span className="font-mono text-[11px] text-amber-700 font-semibold">
                                Resend in {resendTimer}s
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={otpSending}
                                className="font-mono text-[11px] text-maroon hover:underline font-bold uppercase cursor-pointer"
                              >
                                Resend Code
                              </button>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              maxLength={6}
                              placeholder="6-Digit Code"
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                              className="w-full bg-white border border-amber-300 px-3.5 h-[40px] rounded-full font-mono text-center font-bold tracking-widest text-base text-ink-navy focus:outline-none focus:border-maroon shadow-xs"
                            />
                            <button
                              type="button"
                              onClick={handleVerifyOtp}
                              disabled={otpVerifying || otpCode.length !== 6}
                              className="bg-gradient-to-r from-maroon via-[#9E2A3E] to-maroon text-white font-mono text-xs font-bold uppercase tracking-wider px-4 h-[40px] rounded-full hover:brightness-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-sm"
                            >
                              {otpVerifying ? "Verifying..." : "Verify OTP"}
                            </button>
                          </div>
                          {otpError && (
                            <p className="text-xs text-rose-600 font-sans font-medium">
                              ⚠️ {otpError}
                            </p>
                          )}
                          {otpSuccess && (
                            <p className="text-xs text-emerald-700 font-sans font-medium">
                              ✓ {otpSuccess}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Field 4: MESSAGE / DESIRED STREAM OR CLASS */}
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Message / Desired Stream or Class
                      </label>
                      <div className="relative">
                        <div className="absolute top-2.5 left-3.5 pointer-events-none text-slate-400">
                          <FileText className="w-4 h-4" />
                        </div>
                        <textarea
                          rows={3}
                          disabled={inquirySubmitting}
                          placeholder="Desired class, stream, or specific query"
                          value={inquiryMessage}
                          onChange={(e) => setInquiryMessage(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 h-[76px] sm:h-[82px] bg-white border border-slate-200 hover:border-slate-300 focus:border-brass-gold focus:ring-2 focus:ring-brass-gold/20 rounded-xl transition-all duration-200 outline-none text-slate-800 text-sm resize-none shadow-2xs leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Primary Submit Button: Full-width, high-contrast gold */}
                    <MagneticButton className="w-full pt-1">
                      <button
                        type="submit"
                        disabled={inquirySubmitting || Boolean(phoneError || emailError || !inquiryName || !inquiryPhone || !inquiryEmail)}
                        className="h-[48px] sm:h-[50px] w-full bg-gradient-to-r from-[#DFB743] via-[#F0CB56] to-[#C99D26] hover:brightness-105 text-ink-navy font-mono text-sm font-bold uppercase tracking-wider rounded-full shadow-[0_4px_16px_rgba(201,162,39,0.35)] hover:shadow-[0_6px_22px_rgba(201,162,39,0.5)] border border-amber-200/60 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {inquirySubmitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-ink-navy/30 border-t-ink-navy rounded-full animate-spin" />
                            <span>Submitting Inquiry...</span>
                          </>
                        ) : !otpVerified ? (
                          <>
                            <span>Verify Email & Submit Inquiry</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            <span>Submit & Send Inquiry</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </MagneticButton>

                    {/* Bottom Security / Trust Footnote */}
                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center mt-2.5 font-sans">
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Your information will be saved securely and dispatched to administration instantly.</span>
                    </div>
                  </form>
                )}
              </div>

            </div>

          </motion.div>

        </div>
      </div>

      {/* Mobile-Only Admission Inquiry Popup Modal */}
      <InquiryModal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
        presetMessage={presetMessage}
        prefillMessage={prefillMessage}
        formContext={formContext}
      />
    </AppSection>
  );
}
