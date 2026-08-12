"use client";

import { X } from "lucide-react";
import { Text, H2, Caption } from "@/app/components/ui/typography";
import { Button } from "@/app/components/ui/button";
import { SoftCard } from "@/app/components/ui/soft-card";
import { FoodEntry } from "@/lib/indian-food-db";

interface RecipeModalProps {
    isOpen: boolean;
    onClose: () => void;
    mealName: string;
    nutritionData: FoodEntry | null;
}

export function RecipeModal({ isOpen, onClose, mealName, nutritionData }: RecipeModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start md:items-center justify-center p-4 animate-in fade-in"
            onClick={onClose}
        >
            <SoftCard
                className="w-full max-w-lg max-h-[80vh] overflow-y-auto animate-in slide-in-from-top md:slide-in-from-top-0"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header - Recipe + Info on same line */}
                <div className="flex justify-between items-start p-6 pb-4 border-b border-gray-200">
                    <div className="flex-1 pr-4">
                        <Caption className="text-primary text-xs">Recipe</Caption>
                        <H2 className="text-2xl font-bold text-text-heading mt-1 leading-tight">{mealName}</H2>
                    </div>

                    {/* Right side: Calories, Serving, Time */}
                    {nutritionData && (
                        <div className="flex flex-col items-end gap-1 text-right">
                            <div className="px-3 py-1 bg-primary/10 rounded-full">
                                <Text className="text-xs font-bold text-primary">{nutritionData.calories} cal</Text>
                            </div>
                            <Caption className="text-[11px] text-gray-500">{nutritionData.servingSize}</Caption>
                            <Caption className="text-[11px] text-gray-500">⏱ ~15 min</Caption>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="p-2 ml-2 text-muted hover:text-text-heading transition-colors rounded-lg hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {nutritionData ? (
                        <>
                            {/* Ingredients */}
                            <div>
                                <Text className="text-lg font-bold text-text-heading mb-2">Ingredients</Text>
                                <ul className="space-y-1 text-sm text-gray-600 list-disc list-inside">
                                    <li>Main ingredient: {mealName}</li>
                                    <li>Spices and seasonings as needed</li>
                                    <li>Garnish (optional)</li>
                                </ul>
                            </div>

                            {/* Instructions */}
                            <div>
                                <Text className="text-lg font-bold text-text-heading mb-2">Instructions</Text>
                                <div className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <Text className="text-yellow-800">
                                        📖 Full recipe coming soon! We're adding detailed cooking instructions for all meals.
                                    </Text>
                                </div>
                            </div>
                        </>
                    ) : (
                        <Text className="text-center text-gray-500 py-8">
                            No nutrition data available for this meal.
                        </Text>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 pt-4 border-t border-gray-200">
                    <Button onClick={onClose} className="w-full">
                        Got it
                    </Button>
                </div>
            </SoftCard>
        </div>
    );
}
