"use client";

import { useState } from "react";
import { SoftCard } from "@/app/components/ui/soft-card";
import { H1, H2, Text, Caption } from "@/app/components/ui/typography";
import {
  ArrowLeft,
  Info,
  Shield,
  FileText,
  Mail,
  AlertTriangle,
  Lock,
  Heart,
  Database,
  Sparkles,
  ShieldCheck,
  Zap
} from "lucide-react";
import Link from "next/link";
import { CheerfulIcon } from "@/app/components/ui/cheerful-icon";

type Section = "about" | "science" | "disclaimer" | "privacy" | "terms";

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState<Section>("about");

  const sections = [
    { id: "about" as Section, label: "About Savor", icon: Info },
    { id: "science" as Section, label: "Nutrition & Science", icon: Database },
    { id: "disclaimer" as Section, label: "Health Note", icon: AlertTriangle },
    { id: "privacy" as Section, label: "Privacy", icon: Lock },
    { id: "terms" as Section, label: "Terms", icon: FileText },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FFF7ED] to-[#FFF0E0] p-4 pt-6 pb-12 max-w-md mx-auto relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/">
          <button className="w-10 h-10 rounded-2xl bg-white border border-amber-200 shadow-xs flex items-center justify-center text-text-heading hover:bg-amber-50 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <H1 className="text-xl font-black text-text-heading font-heading">About Savor</H1>
          <Caption className="text-[11px] text-text-muted">Science, mission & privacy</Caption>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 scrollbar-none">
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
              activeSection === sec.id
                ? "bg-primary text-white border-primary shadow-xs"
                : "bg-white/80 text-text-secondary border-amber-200/60 hover:bg-white"
            }`}
          >
            <sec.icon className="w-3.5 h-3.5" />
            <span>{sec.label}</span>
          </button>
        ))}
      </div>

      {/* Content Container */}
      <SoftCard className="p-5 bg-white/95 border border-amber-100 rounded-3xl shadow-xs">
        {/* ===== 1. ABOUT ===== */}
        {activeSection === "about" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center mb-5">
              <div className="w-16 h-16 mx-auto mb-2 rounded-3xl bg-amber-100 text-primary flex items-center justify-center font-bold text-3xl shadow-xs animate-bounce-gentle">
                🍊
              </div>
              <H1 className="text-2xl font-black text-text-heading font-heading">Savor</H1>
              <Caption className="text-primary font-bold text-xs">
                Your Gentle, Cheerful Wellness Companion
              </Caption>
            </div>

            <div className="space-y-3 text-xs text-text-secondary leading-relaxed">
              <Text>
                <strong>Savor</strong> is an AI-assisted wellness companion built to help you cultivate mindful eating, morning consistency, and positive body awareness — completely free from guilt or calorie shaming.
              </Text>

              <Text>
                Our philosophy is simple: healthy living should feel bright, fun, and natural. Instead of rigid clinical rules, we celebrate small daily check-ins and delicious cultural foods.
              </Text>

              <div className="pt-3 border-t border-amber-100 space-y-1">
                <Text className="font-bold text-text-heading">Created by</Text>
                <Text className="font-semibold">Varun Das</Text>
              </div>

              <div className="flex items-center gap-2 pt-1 text-xs">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:varundas4537@gmail.com" className="text-primary font-bold hover:underline">
                  varundas4537@gmail.com
                </a>
              </div>

              <Caption className="block pt-4 text-center text-[10px] text-text-muted">
                Savor • Powered by Convex & Real-time AI
              </Caption>
            </div>
          </div>
        )}

        {/* ===== 2. NUTRITION & SCIENCE VALIDATION ===== */}
        {activeSection === "science" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <H2 className="text-base font-black text-text-heading font-heading">
                Nutrition & Scientific Validation
              </H2>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              How Savor calculates and validates every calorie, macro, and metabolic requirement:
            </p>

            <div className="space-y-3">
              {/* Point 1: IFCT / NIN */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-primary" />
                  <strong className="text-xs text-text-heading">
                    National Institute of Nutrition (NIN / ICMR)
                  </strong>
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Our food database uses the official <em>Indian Food Composition Tables (IFCT)</em> published by the National Institute of Nutrition and Indian Council of Medical Research. Every standard dish (roti, dals, curries, dosa, biryani, paneer, eggs, idli) is mapped to lab-tested macronutrient and caloric densities.
                </p>
              </div>

              {/* Point 2: Mifflin-St Jeor */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-700" />
                  <strong className="text-xs text-text-heading">
                    Mifflin-St Jeor Clinical Equation
                  </strong>
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Recommended by the <em>American Dietetic Association (ADA)</em> and <em>World Health Organization (WHO)</em> as the gold standard for clinical Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).
                </p>
              </div>

              {/* Point 3: USDA FoodData Central */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <strong className="text-xs text-text-heading">
                    USDA FoodData Central
                  </strong>
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Supplements global ingredients, fruits, whole grains, and lean proteins with verified peer-reviewed nutritional profiles.
                </p>
              </div>

              {/* Point 4: Vision AI Anchoring */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
                <strong className="text-xs text-emerald-900 block">
                  🛡️ Zero-Hallucination Food Anchoring
                </strong>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Vision models (Gemini / Kimi) identify the foods on your plate, but Savor anchors the caloric and macro calculations to our verified clinical database to ensure trustworthy estimates.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===== 3. HEALTH DISCLAIMER ===== */}
        {activeSection === "disclaimer" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center gap-2 text-amber-700 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <H2 className="text-base font-black font-heading">Health & Medical Note</H2>
            </div>

            <div className="space-y-3 text-xs text-text-secondary leading-relaxed">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 font-medium text-amber-900">
                ⚠️ Savor is a mindfulness and educational tool, not a medical device.
              </div>

              <Text>
                <strong>Educational Estimates:</strong> All nutritional values and calorie guidelines provided by Savor are intended as helpful estimates to build awareness.
              </Text>

              <Text>
                <strong>Consult Professionals:</strong> If you have diabetes, PCOS, thyroid disorders, eating disorders, or any medical condition, always consult a qualified doctor or registered dietitian before making significant dietary changes.
              </Text>
            </div>
          </div>
        )}

        {/* ===== 4. PRIVACY ===== */}
        {activeSection === "privacy" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center gap-2 text-sky-700 mb-2">
              <Lock className="w-5 h-5" />
              <H2 className="text-base font-black font-heading">Privacy & Data Security</H2>
            </div>

            <div className="space-y-3 text-xs text-text-secondary leading-relaxed">
              <p>
                <strong>Your Data Belongs to You:</strong> Your meals, weights, and goals are securely isolated to your user identity and stored in real-time Convex cloud with encryption in transit and at rest.
              </p>

              <p>
                <strong>Zero Selling of Personal Info:</strong> We never sell your personal health logs to third parties or advertisers.
              </p>

              <p>
                <strong>Export & Delete Anytime:</strong> You can export your full JSON backup or reset your local data at any time from the Settings tab.
              </p>
            </div>
          </div>
        )}

        {/* ===== 5. TERMS ===== */}
        {activeSection === "terms" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center gap-2 text-emerald-700 mb-2">
              <FileText className="w-5 h-5" />
              <H2 className="text-base font-black font-heading">Terms of Use</H2>
            </div>

            <div className="space-y-3 text-xs text-text-secondary leading-relaxed">
              <p>
                By using Savor, you agree to use the application for personal wellness and mindful nutritional awareness.
              </p>
              <p>
                For questions or suggestions, reach out anytime at{" "}
                <a href="mailto:varundas4537@gmail.com" className="text-primary font-bold hover:underline">
                  varundas4537@gmail.com
                </a>.
              </p>
            </div>
          </div>
        )}
      </SoftCard>

      {/* Footer */}
      <div className="text-center mt-6">
        <Caption className="text-[11px] text-text-muted">
          © 2026 Savor • Made with 🧡 in India
        </Caption>
      </div>
    </main>
  );
}
