'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { SoftCard } from '@/app/components/ui/soft-card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { H1, H2, Text, Caption } from '@/app/components/ui/typography';
import {
    Settings,
    Zap,
    ChefHat,
    Loader2,
    CheckCircle,
    XCircle,
    RefreshCw,
    ArrowLeft,
    Activity,
    Plus,
    Trash2,
    GitCompare,
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { compareModels, testModelHealth } from '@/app/actions/compare-models';
import { generateRecipes } from '@/app/actions/generate-pantry-recipes';

// Admin email whitelist
const ADMIN_EMAILS = ['varundas4537@gmail.com'];

// Default models (used when Supabase tables don't exist yet)
const DEFAULT_MODELS = [
    { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google', type: 'text', is_active: true, test_status: 'pending' },
    { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash (Vision)', provider: 'Google', type: 'vision', is_active: true, test_status: 'pending' },
    { id: 'google/gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', provider: 'Google', type: 'text', is_active: true, test_status: 'pending' },
    { id: 'moonshotai/kimi-k1.5', name: 'Kimi k1.5', provider: 'Moonshot AI', type: 'text', is_active: true, test_status: 'pending' },
    { id: 'qwen/qwen3-vl-32b-instruct', name: 'Qwen3 VL 32B', provider: 'Qwen', type: 'vision', is_active: true, test_status: 'pending' },
    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', type: 'text', is_active: true, test_status: 'pending' },
    { id: 'anthropic/claude-3.5-haiku', name: 'Claude 3.5 Haiku', provider: 'Anthropic', type: 'text', is_active: true, test_status: 'pending' },
];

interface Model {
    id: string;
    name: string;
    provider: string;
    type: string;
    is_active: boolean;
    test_status: string;
    test_latency_ms?: number;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeTab, setActiveTab] = useState('home');

    // Models State
    const [models, setModels] = useState<Model[]>(DEFAULT_MODELS);
    const [activeTextModel, setActiveTextModel] = useState('google/gemini-2.5-flash-lite');
    const [activeVisionModel, setActiveVisionModel] = useState('google/gemini-2.5-flash-lite');
    const [newModelId, setNewModelId] = useState('');
    const [newModelName, setNewModelName] = useState('');
    const [newModelType, setNewModelType] = useState<'text' | 'vision'>('text');

    // Connection Test State
    const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
    const [testResult, setTestResult] = useState<string>('');
    const [testLatency, setTestLatency] = useState<number>(0);

    // Recipe Sandbox State
    const [sandboxIngredients, setSandboxIngredients] = useState('eggs, tomato, onion');
    const [sandboxCuisine, setSandboxCuisine] = useState('Indian');
    const [sandboxLoading, setSandboxLoading] = useState(false);
    const [sandboxResult, setSandboxResult] = useState<any>(null);
    const [sandboxRaw, setSandboxRaw] = useState<string>('');

    // Comparison State
    const [comparisonPrompt, setComparisonPrompt] = useState('Suggest 3 healthy breakfast recipes with eggs');
    const [comparisonModels, setComparisonModels] = useState<string[]>(['google/gemini-2.5-flash-lite', 'openai/gpt-4o-mini']);
    const [comparisonLoading, setComparisonLoading] = useState(false);
    const [comparisonResults, setComparisonResults] = useState<any[]>([]);

    useEffect(() => {
        checkAdminAccess();
    }, []);

    const checkAdminAccess = async () => {
        const supabase = createClient();
        if (!supabase) {
            router.push('/welcome');
            return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push('/welcome');
            return;
        }

        if (ADMIN_EMAILS.includes(session.user.email || '')) {
            setIsAdmin(true);
            // Try to load models from localStorage (Supabase tables may not exist yet)
            const savedModels = localStorage.getItem('savor_admin_models');
            if (savedModels) {
                try {
                    setModels(JSON.parse(savedModels));
                } catch (e) { }
            }
            const savedTextModel = localStorage.getItem('savor_active_text_model');
            const savedVisionModel = localStorage.getItem('savor_active_vision_model');
            if (savedTextModel) setActiveTextModel(savedTextModel);
            if (savedVisionModel) setActiveVisionModel(savedVisionModel);
        } else {
            router.push('/');
            return;
        }

        setLoading(false);
    };

    const saveModelSelection = () => {
        localStorage.setItem('savor_active_text_model', activeTextModel);
        localStorage.setItem('savor_active_vision_model', activeVisionModel);
        alert('Model selection saved! Changes will take effect on next AI request.');
    };

    const testSingleModel = async (modelId: string) => {
        setModels(prev => prev.map(m =>
            m.id === modelId ? { ...m, test_status: 'testing' } : m
        ));

        const result = await testModelHealth(modelId);

        setModels(prev => {
            const updated = prev.map(m =>
                m.id === modelId ? {
                    ...m,
                    test_status: result.success ? 'success' : 'error',
                    test_latency_ms: result.latencyMs
                } : m
            );
            localStorage.setItem('savor_admin_models', JSON.stringify(updated));
            return updated;
        });
    };

    const testAllModels = async () => {
        for (const model of models) {
            await testSingleModel(model.id);
        }
    };

    const addModel = () => {
        if (!newModelId.trim() || !newModelName.trim()) return;

        const newModel: Model = {
            id: newModelId.trim(),
            name: newModelName.trim(),
            provider: newModelId.split('/')[0] || 'Unknown',
            type: newModelType,
            is_active: true,
            test_status: 'pending',
        };

        setModels(prev => {
            const updated = [...prev, newModel];
            localStorage.setItem('savor_admin_models', JSON.stringify(updated));
            return updated;
        });

        setNewModelId('');
        setNewModelName('');
    };

    const removeModel = (modelId: string) => {
        setModels(prev => {
            const updated = prev.filter(m => m.id !== modelId);
            localStorage.setItem('savor_admin_models', JSON.stringify(updated));
            return updated;
        });
    };

    const runComparison = async () => {
        if (!comparisonPrompt.trim() || comparisonModels.length < 2) return;

        setComparisonLoading(true);
        setComparisonResults([]);

        const results = await compareModels(comparisonPrompt, comparisonModels);
        setComparisonResults(results);
        setComparisonLoading(false);
    };

    const toggleComparisonModel = (modelId: string) => {
        setComparisonModels(prev =>
            prev.includes(modelId)
                ? prev.filter(m => m !== modelId)
                : [...prev, modelId]
        );
    };

    const runRecipeSandbox = async () => {
        setSandboxLoading(true);
        setSandboxResult(null);
        setSandboxRaw('');

        try {
            const ingredients = sandboxIngredients.split(',').map(s => s.trim()).filter(Boolean);
            const result = await generateRecipes(ingredients, sandboxCuisine);

            setSandboxResult(result);
            setSandboxRaw(JSON.stringify(result, null, 2));
        } catch (err: any) {
            setSandboxResult({ success: false, error: err.message });
            setSandboxRaw(err.message);
        }

        setSandboxLoading(false);
    };

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gray-900">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </main>
        );
    }

    if (!isAdmin) return null;

    const tabs = [
        { id: 'home', label: 'Dashboard', icon: Activity },
        { id: 'models', label: 'Models', icon: Settings },
        { id: 'compare', label: 'Compare', icon: GitCompare },
        { id: 'sandbox', label: 'Sandbox', icon: ChefHat },
    ];

    const textModels = models.filter(m => m.type === 'text');
    const visionModels = models.filter(m => m.type === 'vision');

    return (
        <main className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <H1 className="text-xl text-white">Savor Admin</H1>
                        <Caption className="text-gray-400 text-xs">AI Configuration Dashboard</Caption>
                    </div>
                </div>
                <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                    Admin
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap text-sm transition-all ${activeTab === tab.id
                                ? 'bg-white/20 text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
                {/* ==== HOME TAB ==== */}
                {activeTab === 'home' && (
                    <>
                        <div className="grid grid-cols-2 gap-3">
                            <SoftCard className="p-3 bg-white/10 border-white/20">
                                <Caption className="text-gray-400 text-xs">Text Model</Caption>
                                <Text className="text-white font-mono text-xs truncate">{activeTextModel.split('/')[1]}</Text>
                            </SoftCard>
                            <SoftCard className="p-3 bg-white/10 border-white/20">
                                <Caption className="text-gray-400 text-xs">Vision Model</Caption>
                                <Text className="text-white font-mono text-xs truncate">{activeVisionModel.split('/')[1]}</Text>
                            </SoftCard>
                        </div>

                        <SoftCard className="p-4 bg-white/10 border-white/20">
                            <H2 className="text-sm text-white mb-3">Model Health</H2>
                            <div className="space-y-2">
                                {models.map(model => (
                                    <div key={`${model.id}-${model.type}`} className="flex items-center justify-between p-2 bg-white/5 rounded">
                                        <div className="flex items-center gap-2">
                                            {model.test_status === 'success' && <CheckCircle className="w-4 h-4 text-green-400" />}
                                            {model.test_status === 'error' && <XCircle className="w-4 h-4 text-red-400" />}
                                            {model.test_status === 'testing' && <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />}
                                            {model.test_status === 'pending' && <AlertCircle className="w-4 h-4 text-gray-500" />}
                                            <div>
                                                <Text className="text-white text-xs">{model.name}</Text>
                                                <Caption className="text-gray-500 text-[10px]">{model.type}</Caption>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {model.test_latency_ms && (
                                                <Caption className="text-gray-400 text-xs">{model.test_latency_ms}ms</Caption>
                                            )}
                                            <Button
                                                onClick={() => testSingleModel(model.id)}
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 text-white hover:bg-white/10"
                                                disabled={model.test_status === 'testing'}
                                            >
                                                <RefreshCw className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button onClick={testAllModels} className="w-full mt-3" variant="secondary">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Test All Models
                            </Button>
                        </SoftCard>
                    </>
                )}

                {/* ==== MODELS TAB ==== */}
                {activeTab === 'models' && (
                    <div className="space-y-4">
                        {/* Active Model Selection */}
                        <SoftCard className="p-4 bg-white/10 border-white/20">
                            <H2 className="text-sm text-white mb-3">Active Models</H2>

                            <div className="space-y-3">
                                <div>
                                    <Caption className="text-gray-400 text-xs block mb-1">Text Model</Caption>
                                    <select
                                        value={activeTextModel}
                                        onChange={(e) => setActiveTextModel(e.target.value)}
                                        className="w-full p-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                                    >
                                        {textModels.map(m => (
                                            <option key={m.id} value={m.id} className="bg-gray-800">
                                                {m.name} ({m.provider})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <Caption className="text-gray-400 text-xs block mb-1">Vision Model</Caption>
                                    <select
                                        value={activeVisionModel}
                                        onChange={(e) => setActiveVisionModel(e.target.value)}
                                        className="w-full p-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                                    >
                                        {visionModels.map(m => (
                                            <option key={m.id} value={m.id} className="bg-gray-800">
                                                {m.name} ({m.provider})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <Button onClick={saveModelSelection} className="w-full">
                                    Save Selection
                                </Button>
                            </div>
                        </SoftCard>

                        {/* Add New Model */}
                        <SoftCard className="p-4 bg-white/10 border-white/20">
                            <H2 className="text-sm text-white mb-3">Add New Model</H2>

                            <div className="space-y-2">
                                <Input
                                    value={newModelId}
                                    onChange={(e) => setNewModelId(e.target.value)}
                                    placeholder="Model ID (e.g. openai/gpt-4o)"
                                    className="bg-white/10 border-white/20 text-white text-sm placeholder:text-gray-500"
                                />
                                <Input
                                    value={newModelName}
                                    onChange={(e) => setNewModelName(e.target.value)}
                                    placeholder="Display Name"
                                    className="bg-white/10 border-white/20 text-white text-sm placeholder:text-gray-500"
                                />
                                <div className="flex gap-2">
                                    <select
                                        value={newModelType}
                                        onChange={(e) => setNewModelType(e.target.value as 'text' | 'vision')}
                                        className="flex-1 p-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                                    >
                                        <option value="text" className="bg-gray-800">Text</option>
                                        <option value="vision" className="bg-gray-800">Vision</option>
                                    </select>
                                    <Button onClick={addModel} disabled={!newModelId.trim() || !newModelName.trim()}>
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </SoftCard>

                        {/* Model List */}
                        <SoftCard className="p-4 bg-white/10 border-white/20">
                            <H2 className="text-sm text-white mb-3">All Models</H2>
                            <div className="space-y-2">
                                {models.map((model, i) => (
                                    <div key={`${model.id}-${model.type}-${i}`} className="flex items-center justify-between p-2 bg-white/5 rounded">
                                        <div>
                                            <Text className="text-white text-xs">{model.name}</Text>
                                            <Caption className="text-gray-500 text-[10px]">{model.id} • {model.type}</Caption>
                                        </div>
                                        <Button
                                            onClick={() => removeModel(model.id)}
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7 text-red-400 hover:bg-red-500/20"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </SoftCard>
                    </div>
                )}

                {/* ==== COMPARE TAB ==== */}
                {activeTab === 'compare' && (
                    <div className="space-y-4">
                        <SoftCard className="p-4 bg-white/10 border-white/20">
                            <H2 className="text-sm text-white mb-3">Model Comparison</H2>

                            <div className="space-y-3">
                                <div>
                                    <Caption className="text-gray-400 text-xs block mb-1">Test Prompt</Caption>
                                    <textarea
                                        value={comparisonPrompt}
                                        onChange={(e) => setComparisonPrompt(e.target.value)}
                                        placeholder="Enter a test prompt..."
                                        className="w-full p-2 bg-white/10 border border-white/20 rounded text-white text-sm h-20 resize-none"
                                    />
                                </div>

                                <div>
                                    <Caption className="text-gray-400 text-xs block mb-1">Select Models to Compare</Caption>
                                    <div className="flex flex-wrap gap-2">
                                        {textModels.map(m => (
                                            <button
                                                key={m.id}
                                                onClick={() => toggleComparisonModel(m.id)}
                                                className={`px-2 py-1 rounded text-xs transition-all ${comparisonModels.includes(m.id)
                                                        ? 'bg-primary text-white'
                                                        : 'bg-white/10 text-gray-400'
                                                    }`}
                                            >
                                                {m.name.split(' ')[0]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    onClick={runComparison}
                                    disabled={comparisonLoading || comparisonModels.length < 2}
                                    className="w-full"
                                >
                                    {comparisonLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Comparing...
                                        </>
                                    ) : (
                                        <>
                                            <GitCompare className="w-4 h-4 mr-2" />
                                            Run Comparison
                                        </>
                                    )}
                                </Button>
                            </div>
                        </SoftCard>

                        {/* Comparison Results */}
                        {comparisonResults.length > 0 && (
                            <div className="grid gap-3">
                                {comparisonResults.map((result, i) => (
                                    <SoftCard
                                        key={i}
                                        className={`p-4 border ${result.success ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <Text className="text-white text-sm font-medium">
                                                {result.model.split('/')[1]}
                                            </Text>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <span>⏱️ {result.latencyMs}ms</span>
                                                {result.tokens && (
                                                    <span>📊 {result.tokens.total} tokens</span>
                                                )}
                                                {result.estimatedCost !== undefined && (
                                                    <span>💰 ${result.estimatedCost.toFixed(6)}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-2 bg-black/30 rounded text-xs text-gray-300 font-mono overflow-x-auto max-h-40 overflow-y-auto whitespace-pre-wrap">
                                            {result.success ? result.content : `Error: ${result.error}`}
                                        </div>
                                    </SoftCard>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ==== SANDBOX TAB ==== */}
                {activeTab === 'sandbox' && (
                    <SoftCard className="p-4 bg-white/10 border-white/20">
                        <H2 className="text-sm text-white mb-3">Recipe Sandbox</H2>

                        <div className="space-y-3">
                            <div>
                                <Caption className="text-gray-400 text-xs block mb-1">Ingredients</Caption>
                                <Input
                                    value={sandboxIngredients}
                                    onChange={(e) => setSandboxIngredients(e.target.value)}
                                    placeholder="eggs, tomato, onion"
                                    className="bg-white/10 border-white/20 text-white text-sm placeholder:text-gray-500"
                                />
                            </div>

                            <div>
                                <Caption className="text-gray-400 text-xs block mb-1">Cuisine</Caption>
                                <select
                                    value={sandboxCuisine}
                                    onChange={(e) => setSandboxCuisine(e.target.value)}
                                    className="w-full p-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                                >
                                    {['Any', 'Indian', 'Italian', 'Mexican', 'Chinese', 'American'].map(c => (
                                        <option key={c} value={c} className="bg-gray-800">{c}</option>
                                    ))}
                                </select>
                            </div>

                            <Button onClick={runRecipeSandbox} disabled={sandboxLoading} className="w-full">
                                {sandboxLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <ChefHat className="w-4 h-4 mr-2" />
                                        Generate
                                    </>
                                )}
                            </Button>
                        </div>

                        {sandboxResult && (
                            <div className="mt-4 space-y-3">
                                <div className={`p-3 rounded ${sandboxResult.success ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                    {sandboxResult.success ? (
                                        <div className="space-y-2">
                                            {sandboxResult.recipes?.map((r: any, i: number) => (
                                                <div key={i} className="p-2 bg-white/10 rounded">
                                                    <Text className="text-white text-sm">{r.name}</Text>
                                                    <Caption className="text-gray-400 text-xs">
                                                        {r.time} • {r.calories} kcal
                                                    </Caption>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <Text className="text-red-400 text-sm">{sandboxResult.error}</Text>
                                    )}
                                </div>

                                <div>
                                    <Caption className="text-gray-400 text-xs block mb-1">Raw JSON</Caption>
                                    <pre className="p-2 bg-black/30 rounded text-[10px] text-gray-300 font-mono overflow-x-auto max-h-40 overflow-y-auto">
                                        {sandboxRaw}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </SoftCard>
                )}
            </div>
        </main>
    );
}
