"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { H1, Text } from '@/app/components/ui/typography';
import { ArrowRight } from 'lucide-react';

export default function GenderPage() {
    const router = useRouter();
    const [gender, setGender] = useState<'male' | 'female' | null>(null);

    const handleContinue = () => {
        if (gender) {
            sessionStorage.setItem('onboarding_gender', gender);
            router.push('/onboarding/body');
        }
    };

    return (
        <main className="min-h-screen bg-background flex flex-col p-6">
            {/* Progress */}
            <div className="flex gap-1 mb-8">
                <div className="h-1 flex-1 rounded-full bg-primary" />
                <div className="h-1 flex-1 rounded-full bg-primary" />
                <div className="h-1 flex-1 rounded-full bg-muted/30" />
                <div className="h-1 flex-1 rounded-full bg-muted/30" />
                <div className="h-1 flex-1 rounded-full bg-muted/30" />
                <div className="h-1 flex-1 rounded-full bg-muted/30" />
                <div className="h-1 flex-1 rounded-full bg-muted/30" />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center">
                <div className="text-center mb-8">
                    <H1 className="text-2xl mb-2">Biological Sex</H1>
                    <Text className="text-muted">Required for accurate metabolic calculation</Text>
                </div>

                <div className="w-full max-w-sm mx-auto space-y-4">
                    <button
                        onClick={() => setGender('male')}
                        className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 text-left relative overflow-hidden group ${gender === 'male'
                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                : 'border-muted/20 hover:border-primary/50 hover:bg-white/50'
                            }`}
                    >
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <Text className={`font-semibold text-lg mb-1 ${gender === 'male' ? 'text-primary' : ''
                                    }`}>Male</Text>
                                <Text className="text-sm text-muted">
                                    BMR Calculation: +5 kcal
                                </Text>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${gender === 'male' ? 'border-primary bg-primary' : 'border-muted'
                                }`}>
                                {gender === 'male' && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => setGender('female')}
                        className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 text-left relative overflow-hidden group ${gender === 'female'
                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                : 'border-muted/20 hover:border-primary/50 hover:bg-white/50'
                            }`}
                    >
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <Text className={`font-semibold text-lg mb-1 ${gender === 'female' ? 'text-primary' : ''
                                    }`}>Female</Text>
                                <Text className="text-sm text-muted">
                                    BMR Calculation: -161 kcal
                                </Text>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${gender === 'female' ? 'border-primary bg-primary' : 'border-muted'
                                }`}>
                                {gender === 'female' && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                            </div>
                        </div>
                    </button>

                    <Text className="text-xs text-center text-muted mt-4">
                        We use the Mifflin-St Jeor equation which requires biological sex parameters.
                    </Text>
                </div>
            </div>

            {/* CTA */}
            <div className="w-full max-w-sm mx-auto">
                <Button
                    onClick={handleContinue}
                    className="w-full py-5"
                    disabled={!gender}
                >
                    Continue
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </main>
    );
}
