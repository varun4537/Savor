'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { GlassCard } from '@/app/components/ui/glass-card';
import { H2, Text, Caption } from '@/app/components/ui/typography';
import { X } from 'lucide-react';
import { getRecommendations, type FoodRecommendation } from '@/lib/macro-recommendations';

interface MacroButtonsProps {
    protein: number; // grams needed
    carbs: number;
    fats: number;
}

export function MacroButtons({ protein, carbs, fats }: MacroButtonsProps) {
    const [showModal, setShowModal] = useState(false);
    const [selectedMacro, setSelectedMacro] = useState<'protein' | 'carbs' | 'fats' | null>(null);
    const [recommendations, setRecommendations] = useState<FoodRecommendation[]>([]);

    const handleMacroClick = (macro: 'protein' | 'carbs' | 'fats', needed: number) => {
        setSelectedMacro(macro);
        setRecommendations(getRecommendations(macro, needed));
        setShowModal(true);
    };

    const macroConfig = {
        protein: { label: 'Protein', value: Math.round(protein), color: 'bg-pink-100 text-pink-700 border-pink-200' },
        carbs: { label: 'Carbs', value: Math.round(carbs), color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
        fats: { label: 'Fats', value: Math.round(fats), color: 'bg-blue-100 text-blue-700 border-blue-200' },
    };

    const getMacroTitle = () => {
        if (!selectedMacro) return '';
        const labels = { protein: 'Protein', carbs: 'Carbs', fats: 'Fats' };
        return labels[selectedMacro];
    };

    return (
        <>
            {/* Macro Buttons */}
            <div className="flex gap-3 justify-between">
                {Object.entries(macroConfig).map(([key, config]) => (
                    <button
                        key={key}
                        onClick={() => handleMacroClick(key as 'protein' | 'carbs' | 'fats', config.value)}
                        className={`flex-1 py-3 px-3 rounded-xl border-2 transition-all hover:scale-105 active:scale-95 ${config.color}`}
                    >
                        <Caption className="text-xs font-medium">{config.label}</Caption>
                        <Text className="text-lg font-bold">{config.value}g</Text>
                    </button>
                ))}
            </div>

            {/* Recommendations Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-4 animate-in fade-in">
                    <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom md:slide-in-from-bottom-0">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <H2 className="text-lg">Fill your {getMacroTitle()}</H2>
                                <Caption>Need {selectedMacro && macroConfig[selectedMacro].value}g more</Caption>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Recommendations List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-3">
                            <Text className="text-sm text-gray-600 mb-4">
                                Here are some foods to help you meet your {getMacroTitle().toLowerCase()} goal:
                            </Text>

                            {recommendations.map((food, index) => (
                                <GlassCard key={index} className="p-4 hover:bg-white/70 cursor-pointer transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <Text className="font-semibold text-base">{food.name}</Text>
                                            <Caption className="text-gray-600">{food.amount}</Caption>
                                        </div>
                                        <div className="text-right">
                                            <Text className="font-bold text-primary text-lg">{food.macro}g</Text>
                                            <Caption className="text-gray-500">{food.calories} cal</Caption>
                                        </div>
                                    </div>
                                    <Text className="text-sm text-gray-600 italic">💡 {food.description}</Text>
                                </GlassCard>
                            ))}

                            {recommendations.length === 0 && (
                                <div className="text-center py-8">
                                    <Text className="text-gray-500">No recommendations available</Text>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100">
                            <Button onClick={() => setShowModal(false)} className="w-full">
                                Got it!
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
