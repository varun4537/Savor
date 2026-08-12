"use client";

import { useState } from "react";
import { SoftCard } from "@/app/components/ui/soft-card";
import { H1, H2, Text, Caption } from "@/app/components/ui/typography";
import { ArrowLeft, Info, Shield, FileText, Mail, AlertTriangle, Lock, Heart } from "lucide-react";
import Link from "next/link";

type Section = 'about' | 'disclaimer' | 'privacy' | 'terms';

export default function AboutPage() {
    const [activeSection, setActiveSection] = useState<Section>('about');

    const sections = [
        { id: 'about' as Section, label: 'About', icon: Info },
        { id: 'disclaimer' as Section, label: 'Disclaimer', icon: AlertTriangle },
        { id: 'privacy' as Section, label: 'Privacy', icon: Lock },
        { id: 'terms' as Section, label: 'Terms', icon: FileText },
    ];

    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-blue-50/30 relative overflow-hidden">
            <div className="fixed top-[-20%] right-[-20%] w-[80%] h-[80%] bg-secondary/10 rounded-full blur-3xl -z-10" />

            <div className="p-4 pb-8 max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <Link href="/settings">
                        <button className="p-2 rounded-full hover:bg-white/50 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    </Link>
                    <H1 className="text-xl">About & Legal</H1>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-4 overflow-x-auto pb-2">
                    {sections.map(sec => (
                        <button
                            key={sec.id}
                            onClick={() => setActiveSection(sec.id)}
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-all ${activeSection === sec.id
                                    ? 'bg-primary text-white'
                                    : 'bg-white/60 text-gray-600 hover:bg-white'
                                }`}
                        >
                            <sec.icon className="w-3 h-3" />
                            {sec.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <SoftCard className="p-5">
                    {/* ===== ABOUT ===== */}
                    {activeSection === 'about' && (
                        <div className="space-y-4">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <Heart className="w-8 h-8 text-white" />
                                </div>
                                <H1 className="text-2xl">Savor</H1>
                                <Caption>Your AI Nutrition Companion</Caption>
                            </div>

                            <div className="space-y-3 text-sm text-gray-600">
                                <Text>
                                    <strong>Savor</strong> is an AI-powered nutrition tracking app designed to make
                                    healthy eating simple and accessible for everyone.
                                </Text>

                                <Text>
                                    Our mission is to help you understand your food better through intelligent
                                    meal analysis, personalized recommendations, and intuitive tracking.
                                </Text>

                                <div className="pt-4 border-t border-gray-100">
                                    <Text className="font-medium text-gray-800">Created by</Text>
                                    <Text>Varun Das</Text>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <Mail className="w-4 h-4 text-primary" />
                                    <a href="mailto:varundas4537@gmail.com" className="text-primary hover:underline">
                                        varundas4537@gmail.com
                                    </a>
                                </div>

                                <Caption className="block pt-4 text-center">
                                    Version 1.3.0 • Made with ❤️ in India
                                </Caption>
                            </div>
                        </div>
                    )}

                    {/* ===== DISCLAIMER ===== */}
                    {activeSection === 'disclaimer' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-orange-500 mb-4">
                                <AlertTriangle className="w-5 h-5" />
                                <H2 className="text-lg">Health Disclaimer</H2>
                            </div>

                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                                    <Text className="text-orange-800 font-medium">
                                        ⚠️ This app is NOT a substitute for professional medical advice.
                                    </Text>
                                </div>

                                <Text>
                                    <strong>AI-Generated Estimates:</strong> All calorie and nutritional information
                                    provided by Savor is generated using artificial intelligence and should be
                                    treated as <em>estimates only</em>. Actual values may vary significantly.
                                </Text>

                                <Text>
                                    <strong>Not Medical Advice:</strong> The information provided in this app is
                                    for informational and educational purposes only. It is not intended to be a
                                    substitute for professional medical advice, diagnosis, or treatment.
                                </Text>

                                <Text>
                                    <strong>Consult Healthcare Providers:</strong> Always seek the advice of your
                                    physician, dietitian, or other qualified health provider with any questions
                                    you may have regarding nutrition, diet, or medical conditions.
                                </Text>

                                <Text>
                                    <strong>Health Conditions:</strong> If you have diabetes, heart disease,
                                    eating disorders, allergies, or any other health conditions, consult a
                                    healthcare professional before making dietary changes.
                                </Text>

                                <Text>
                                    <strong>No Liability:</strong> The creators of Savor shall not be held liable
                                    for any health issues, allergic reactions, or other adverse effects that may
                                    result from following suggestions made by this app.
                                </Text>
                            </div>
                        </div>
                    )}

                    {/* ===== PRIVACY ===== */}
                    {activeSection === 'privacy' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-blue-500 mb-4">
                                <Lock className="w-5 h-5" />
                                <H2 className="text-lg">Privacy Policy</H2>
                            </div>

                            <div className="space-y-3 text-sm text-gray-600">
                                <Caption className="block">Last updated: January 2026</Caption>

                                <Text>
                                    <strong>Data We Collect:</strong>
                                </Text>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    <li>Account information (email, name)</li>
                                    <li>Profile data (age, weight, height, goals)</li>
                                    <li>Meal logs and food photos</li>
                                    <li>Usage analytics (anonymous)</li>
                                </ul>

                                <Text>
                                    <strong>How We Use Your Data:</strong>
                                </Text>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    <li>To provide personalized nutrition recommendations</li>
                                    <li>To analyze meals using AI</li>
                                    <li>To track your progress and goals</li>
                                    <li>To improve our services</li>
                                </ul>

                                <Text>
                                    <strong>Data Storage:</strong> Your data is stored securely using Supabase
                                    (cloud database) with encryption at rest and in transit.
                                </Text>

                                <Text>
                                    <strong>Third-Party Services:</strong> We use OpenRouter for AI analysis.
                                    Food images are processed by AI models but are not stored permanently by
                                    these services.
                                </Text>

                                <Text>
                                    <strong>Your Rights:</strong> You can delete your account and all associated
                                    data at any time by logging out and contacting us.
                                </Text>

                                <Text>
                                    <strong>Contact:</strong> For privacy concerns, email us at{" "}
                                    <a href="mailto:varundas4537@gmail.com" className="text-primary hover:underline">
                                        varundas4537@gmail.com
                                    </a>
                                </Text>
                            </div>
                        </div>
                    )}

                    {/* ===== TERMS ===== */}
                    {activeSection === 'terms' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-green-500 mb-4">
                                <FileText className="w-5 h-5" />
                                <H2 className="text-lg">Terms of Use</H2>
                            </div>

                            <div className="space-y-3 text-sm text-gray-600">
                                <Caption className="block">Effective: January 2026</Caption>

                                <Text>
                                    By using Savor, you agree to these terms:
                                </Text>

                                <Text>
                                    <strong>1. Acceptance:</strong> By accessing or using this app, you agree to
                                    be bound by these Terms of Use and our Privacy Policy.
                                </Text>

                                <Text>
                                    <strong>2. Use License:</strong> You are granted a limited, non-exclusive,
                                    personal license to use Savor for your own nutritional tracking purposes.
                                </Text>

                                <Text>
                                    <strong>3. Accuracy:</strong> While we strive for accuracy, AI-generated
                                    nutritional data is approximate. You acknowledge that estimates may be
                                    inaccurate.
                                </Text>

                                <Text>
                                    <strong>4. User Conduct:</strong> You agree not to misuse the app, attempt
                                    to access others' data, or use the service for any unlawful purpose.
                                </Text>

                                <Text>
                                    <strong>5. Account Responsibility:</strong> You are responsible for
                                    maintaining the confidentiality of your account.
                                </Text>

                                <Text>
                                    <strong>6. Modifications:</strong> We reserve the right to modify or
                                    discontinue the service at any time without notice.
                                </Text>

                                <Text>
                                    <strong>7. Limitation of Liability:</strong> Savor and its creators shall
                                    not be liable for any indirect, incidental, or consequential damages.
                                </Text>

                                <Text>
                                    <strong>8. Governing Law:</strong> These terms are governed by the laws
                                    of India. Any disputes shall be resolved in courts of India.
                                </Text>

                                <Text>
                                    <strong>Contact:</strong> Questions about these terms? Email{" "}
                                    <a href="mailto:varundas4537@gmail.com" className="text-primary hover:underline">
                                        varundas4537@gmail.com
                                    </a>
                                </Text>
                            </div>
                        </div>
                    )}
                </SoftCard>

                {/* Footer */}
                <div className="text-center mt-6">
                    <Caption className="text-[10px] text-gray-400">
                        © 2026 Savor. All rights reserved.
                    </Caption>
                </div>
            </div>
        </main>
    );
}
