"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { H1, H2, Text, Caption } from "@/app/components/ui/typography";
import { SoftCard } from "@/app/components/ui/soft-card";
import {
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  Check,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  Lightbulb,
  Moon,
  Sparkles,
  Flame,
  Zap,
  Edit3
} from "lucide-react";
import Link from "next/link";
import { analyzeFoodImageBox } from "@/app/actions/analyze-meal";
import { calculateMealNutrition } from "@/lib/indian-food-db";
import { useSavorData } from "@/app/hooks/use-savor-data";

interface FoodItem {
  name: string;
  quantity: string;
}

const quickFoodPresets = [
  "2 Roti + Dal Tadka + Sabzi",
  "Paneer Bhurji with Paratha",
  "Oats with Milk, Banana & Nuts",
  "Grilled Chicken with Brown Rice",
  "3 Idlis + Sambar + Chutney",
  "2 Boiled Eggs + Whole Wheat Toast",
  "Mixed Sprouts Salad + Lemon",
  "Curd Rice + Cucumber Salad",
  "Rajma Chawal + Curd",
  "Moong Dal Chilla (2 pcs)",
];

export default function PhotoLogPage() {
  const router = useRouter();
  const { logMeal } = useSavorData();

  // Mode: "ai_camera" or "manual"
  const [activeTab, setActiveTab] = useState<"ai_camera" | "manual">("ai_camera");

  // State
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Meal Content State
  const [mealName, setMealName] = useState("");
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [calories, setCalories] = useState<number>(450);
  const [proteinG, setProteinG] = useState<number>(18);
  const [portion, setPortion] = useState<"small" | "regular" | "large">("regular");
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("lunch");
  const [note, setNote] = useState("");
  const [aiMessage, setAiMessage] = useState("");

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const portionMultipliers = { small: 0.75, regular: 1.0, large: 1.35 };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) setMealType("breakfast");
    else if (hour >= 11 && hour < 16) setMealType("lunch");
    else if (hour >= 16 && hour < 21) setMealType("dinner");
    else setMealType("snack");
  }, []);

  // Compress image client-side to max 1024x1024 JPEG to guarantee fast iOS uploads
  const processAndCompressImage = (file: File): Promise<{ file: File; dataUrl: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxDim = 1024;

          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const compressedFile = new File([blob], "meal.jpg", { type: "image/jpeg" });
                  resolve({ file: compressedFile, dataUrl });
                } else {
                  resolve({ file, dataUrl: e.target?.result as string });
                }
              },
              "image/jpeg",
              0.82
            );
          } else {
            resolve({ file, dataUrl: e.target?.result as string });
          }
        };
        img.onerror = () => resolve({ file, dataUrl: e.target?.result as string });
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError("");
      try {
        const { file: compressedFile, dataUrl } = await processAndCompressImage(file);
        setImage(dataUrl);
        analyzeMealPhoto(compressedFile);
      } catch (err) {
        console.error("Image compression error:", err);
      }
    }
  };

  const analyzeMealPhoto = async (file: File) => {
    setAnalyzing(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await analyzeFoodImageBox(formData);
      setAnalyzing(false);

      if (response.success && response.data) {
        const data = response.data;
        const items = (data.foodItems || []).map((name: string) => ({
          name,
          quantity: "1 serving",
        }));
        setFoodItems(items);
        setMealName(items.map((i: any) => i.name).join(", ") || "Mindful Meal");

        // Parse calories
        let calVal = 450;
        if (data.calories && typeof data.calories === "string") {
          const match = data.calories.match(/\d+/g);
          if (match && match.length > 0) {
            const nums = match.map(Number);
            calVal = Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
          }
        }
        setCalories(calVal);

        // Parse protein
        let protVal = 18;
        if (data.protein && typeof data.protein === "string") {
          const match = data.protein.match(/\d+/);
          if (match) protVal = parseInt(match[0]);
        }
        setProteinG(protVal);

        setAiMessage(data.message || "A nourishing and tasty meal!");
      } else {
        setError(response.error || "Could not recognize the food clearly. You can enter it manually below!");
        // Switch to manual view if AI analysis failed
        if (!mealName) setMealName("My Meal");
      }
    } catch (err: any) {
      setAnalyzing(false);
      setError("AI Vision timed out. Please type what you ate below!");
    }
  };

  const addFoodItem = (nameToAdd?: string) => {
    const item = nameToAdd || newItemName.trim();
    if (!item) return;

    const updated = [...foodItems, { name: item, quantity: "1 serving" }];
    setFoodItems(updated);
    setNewItemName("");
    if (!mealName) setMealName(item);

    // Auto-calculate from database
    const nutrition = calculateMealNutrition(
      updated.map((f) => f.name),
      portionMultipliers[portion]
    );
    if (nutrition.calories > 0) {
      setCalories(nutrition.calories);
      setProteinG(nutrition.protein);
    }
  };

  const removeFoodItem = (index: number) => {
    const updated = foodItems.filter((_, i) => i !== index);
    setFoodItems(updated);
    if (updated.length > 0) {
      const nutrition = calculateMealNutrition(
        updated.map((f) => f.name),
        portionMultipliers[portion]
      );
      if (nutrition.calories > 0) {
        setCalories(nutrition.calories);
        setProteinG(nutrition.protein);
      }
    }
  };

  const handleSaveMeal = async () => {
    setSaving(true);
    try {
      const finalName = mealName.trim() || foodItems.map((f) => f.name).join(", ") || "Logged Meal";
      const adjustedCalories = Math.round(calories * portionMultipliers[portion]);
      const adjustedProtein = Math.round(proteinG * portionMultipliers[portion]);

      await logMeal({
        name: finalName,
        caloriesAvg: adjustedCalories,
        proteinG: adjustedProtein,
        mealType,
        foodItems: foodItems.map((f) => f.name),
        aiMessage: aiMessage || note || "Nutritious and balanced meal",
        imageUrl: image || undefined,
      });

      router.push("/");
    } catch (e) {
      console.error("Error saving meal:", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-[#FFFDF9] via-[#FFF7ED] to-[#FFF0E0] p-4 pt-6 pb-28 max-w-md mx-auto relative overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-2xl bg-white/80 border border-amber-200/60 shadow-xs">
              <ArrowLeft className="w-5 h-5 text-text-heading" />
            </Button>
          </Link>
          <div>
            <H1 className="text-xl font-black text-text-heading font-heading">Log Meal</H1>
            <Caption className="text-[11px] text-text-muted">Snap photo or enter manually</Caption>
          </div>
        </div>
      </div>

      {/* Mode Switch Tabs */}
      <div className="flex bg-white/80 p-1 rounded-2xl border border-amber-200/60 mb-4 shadow-xs">
        <button
          onClick={() => setActiveTab("ai_camera")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "ai_camera" ? "bg-primary text-white shadow-xs" : "text-text-secondary hover:text-text-heading"
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Snap Photo with AI</span>
        </button>

        <button
          onClick={() => setActiveTab("manual")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "manual" ? "bg-primary text-white shadow-xs" : "text-text-secondary hover:text-text-heading"
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Manual Entry</span>
        </button>
      </div>

      {/* TAB 1: AI CAMERA SNAP */}
      {activeTab === "ai_camera" && (
        <div className="space-y-3.5 animate-in fade-in">
          {!image ? (
            <div className="grid grid-cols-2 gap-3">
              <SoftCard
                className="p-5 flex flex-col items-center justify-center text-center gap-2.5 cursor-pointer bg-white/90 border-2 border-dashed border-primary/40 hover:border-primary transition-all active:scale-98 shadow-xs rounded-3xl"
                onClick={() => cameraInputRef.current?.click()}
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-primary flex items-center justify-center">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <Text className="font-bold text-xs text-text-heading">Take Photo</Text>
                  <Caption className="text-[10px] text-text-muted">Open camera</Caption>
                </div>
              </SoftCard>

              <SoftCard
                className="p-5 flex flex-col items-center justify-center text-center gap-2.5 cursor-pointer bg-white/90 border-2 border-dashed border-amber-200 hover:border-primary transition-all active:scale-98 shadow-xs rounded-3xl"
                onClick={() => galleryInputRef.current?.click()}
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <Text className="font-bold text-xs text-text-heading">Choose Gallery</Text>
                  <Caption className="text-[10px] text-text-muted">Upload photo</Caption>
                </div>
              </SoftCard>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleCapture}
              />
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCapture}
              />
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden shadow-md border border-amber-200/80">
              <img src={image} alt="Meal preview" className="w-full h-44 object-cover" />
              <button
                onClick={() => {
                  setImage(null);
                  setFoodItems([]);
                  setError("");
                }}
                className="absolute top-2.5 right-2.5 bg-black/60 text-white text-xs font-bold px-2.5 py-1 rounded-xl backdrop-blur-md hover:bg-black/80"
              >
                Retake ✕
              </button>
            </div>
          )}

          {/* Analyzing Spinner */}
          {analyzing && (
            <SoftCard className="p-6 flex flex-col items-center text-center gap-2.5 bg-white/95 rounded-3xl border border-amber-200 animate-pulse">
              <Loader2 className="w-7 h-7 text-primary animate-spin" />
              <H1 className="text-sm font-bold text-text-heading font-heading">
                Analyzing food with Vision AI...
              </H1>
              <Caption className="text-[11px] text-text-muted">
                Estimating items, calories & protein
              </Caption>
            </SoftCard>
          )}

          {/* Error & Fallback */}
          {error && (
            <SoftCard className="p-4 bg-amber-50 border border-amber-200 rounded-3xl space-y-2">
              <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                {error}
              </p>
              <Button
                onClick={() => setActiveTab("manual")}
                size="sm"
                className="w-full bg-primary text-white text-xs font-bold py-2 rounded-xl"
              >
                Switch to Manual Entry →
              </Button>
            </SoftCard>
          )}
        </div>
      )}

      {/* TAB 2 / COMMON MEAL EDITING FORM */}
      {(activeTab === "manual" || (activeTab === "ai_camera" && (foodItems.length > 0 || image))) && (
        <div className="space-y-3.5 mt-3.5 animate-in fade-in">
          {/* Meal Name Input */}
          <SoftCard className="p-4 bg-white/90 border border-amber-100 rounded-3xl shadow-xs space-y-2">
            <Caption className="text-[10px] font-bold text-text-muted uppercase block">
              Meal Name / Description
            </Caption>
            <Input
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              placeholder="e.g. 2 Rotis with Dal Tadka and Salad"
              className="bg-white text-xs py-2 font-bold text-text-heading rounded-xl"
            />
          </SoftCard>

          {/* Quick Suggestions Chips (for fast 1-tap add) */}
          {foodItems.length === 0 && (
            <SoftCard className="p-3.5 bg-white/90 border border-amber-100 rounded-3xl shadow-xs">
              <Caption className="text-[10px] font-bold text-text-muted uppercase mb-2 block">
                Quick Preset Ideas
              </Caption>
              <div className="flex flex-wrap gap-1.5">
                {quickFoodPresets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setMealName(preset);
                      addFoodItem(preset);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-[#FFF9F3] hover:bg-amber-100 text-text-heading text-[11px] font-semibold border border-amber-200/70 transition-colors"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </SoftCard>
          )}

          {/* Food Items List */}
          <SoftCard className="p-4 bg-white/90 border border-amber-100 rounded-3xl shadow-xs space-y-2.5">
            <Caption className="text-[10px] font-bold text-text-muted uppercase block">
              Items in this Meal
            </Caption>

            <div className="space-y-1.5">
              {foodItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2.5 bg-[#FFF9F3] border border-amber-100/80 rounded-xl text-xs"
                >
                  <span className="font-semibold text-text-heading">{item.name}</span>
                  <button
                    onClick={() => removeFoodItem(index)}
                    className="text-text-muted hover:text-rose-600 font-bold p-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <Input
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Add item (e.g. 1 bowl curd)"
                className="bg-white text-xs py-1.5 rounded-xl flex-1"
                onKeyDown={(e) => e.key === "Enter" && addFoodItem()}
              />
              <Button
                onClick={() => addFoodItem()}
                size="sm"
                className="bg-primary text-white text-xs px-3 rounded-xl font-bold"
              >
                Add
              </Button>
            </div>
          </SoftCard>

          {/* Nutrition Estimates (Editable) */}
          <SoftCard className="p-4 bg-white/90 border border-amber-100 rounded-3xl shadow-xs">
            <Caption className="text-[10px] font-bold text-text-muted uppercase mb-2.5 block">
              Estimated Energy & Protein
            </Caption>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 bg-orange-50/60 rounded-2xl border border-orange-100">
                <span className="text-[10px] font-bold text-text-muted block uppercase">Calories</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <Input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="bg-white text-sm font-black text-text-heading py-1 px-2 rounded-lg w-20"
                  />
                  <span className="text-xs font-bold text-text-secondary">kcal</span>
                </div>
              </div>

              <div className="p-2.5 bg-amber-50/60 rounded-2xl border border-amber-100">
                <span className="text-[10px] font-bold text-text-muted block uppercase">Protein</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <Input
                    type="number"
                    value={proteinG}
                    onChange={(e) => setProteinG(Number(e.target.value))}
                    className="bg-white text-sm font-black text-text-heading py-1 px-2 rounded-lg w-20"
                  />
                  <span className="text-xs font-bold text-text-secondary">grams</span>
                </div>
              </div>
            </div>
          </SoftCard>

          {/* Portion Size */}
          <SoftCard className="p-3.5 bg-white/90 border border-amber-100 rounded-3xl shadow-xs">
            <Caption className="text-[10px] font-bold text-text-muted uppercase mb-2 block">
              Portion Size
            </Caption>
            <div className="grid grid-cols-3 gap-1.5 text-center">
              {[
                { id: "small" as const, label: "Light 🥄", desc: "0.75x" },
                { id: "regular" as const, label: "Regular 🍽️", desc: "1.0x" },
                { id: "large" as const, label: "Hearty 🍲", desc: "1.35x" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPortion(p.id)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                    portion === p.id
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-[#FFF9F3] text-text-secondary border-amber-200/60"
                  }`}
                >
                  {p.label}
                  <span className="block text-[9px] opacity-80">{p.desc}</span>
                </button>
              ))}
            </div>
          </SoftCard>

          {/* Meal Timing */}
          <SoftCard className="p-3.5 bg-white/90 border border-amber-100 rounded-3xl shadow-xs">
            <Caption className="text-[10px] font-bold text-text-muted uppercase mb-2 block">
              Meal Time
            </Caption>
            <div className="grid grid-cols-4 gap-1 text-center">
              {[
                { id: "breakfast" as const, label: "Breakfast 🌅" },
                { id: "lunch" as const, label: "Lunch 🍱" },
                { id: "snack" as const, label: "Snack ☕" },
                { id: "dinner" as const, label: "Dinner 🌙" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setMealType(t.id)}
                  className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all ${
                    mealType === t.id
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-[#FFF9F3] text-text-secondary border-amber-200/60"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </SoftCard>
        </div>
      )}

      {/* Pinned Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gradient-to-t from-[#FFF0E0] via-[#FFF0E0]/95 to-transparent z-20">
        <Button
          onClick={handleSaveMeal}
          disabled={saving || (!mealName && foodItems.length === 0)}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-[#F27233] text-white font-bold text-sm shadow-md shadow-primary/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          <span>{saving ? "Saving Meal..." : "Save Meal to Savor ✨"}</span>
        </Button>
      </div>
    </main>
  );
}
