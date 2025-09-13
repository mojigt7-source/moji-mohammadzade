import React, { useState, useCallback } from 'react';
import { Tone, GenerationOptions, GeneratedCaption, AppState } from '../types';
import { generateCaptions as generateGeminiCaptions } from '../services/geminiService';
import { generateLocalCaptions } from '../services/localLlmService';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Slider } from './ui/Slider';
import { Toggle } from './ui/Toggle';
import { Spinner } from './ui/Spinner';
import { CopyIcon, HashtagIcon, EmojiIcon, CheckIcon, SparklesIcon, AlertTriangleIcon, ServerIcon, CloudIcon } from './ui/Icons';

type ApiProvider = 'gemini' | 'local';

const CaptionResult: React.FC<{ caption: GeneratedCaption }> = ({ caption }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(caption.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const engagementColor = {
        'پایین': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'متوسط': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        'بالا': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    }[caption.predictedEngagement || 'پایین'];

    return (
        <Card className="flex flex-col gap-4 relative group">
             <div className="absolute top-3 left-3 flex items-center gap-2">
                {caption.predictedEngagement && (
                     <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${engagementColor}`}>
                        تعامل {caption.predictedEngagement}
                    </span>
                )}
                <Button variant="ghost" size="icon" onClick={handleCopy} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {copied ? <CheckIcon className="w-4 h-4 text-green-500" /> : <CopyIcon className="w-4 h-4" />}
                </Button>
            </div>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{caption.text}</p>
            <div className="flex flex-wrap gap-2 items-center text-sm text-gray-500 dark:text-gray-400">
                {caption.emojis.length > 0 && <EmojiIcon className="w-4 h-4 text-yellow-500" />}
                {caption.emojis.map((emoji, i) => <span key={i}>{emoji}</span>)}
            </div>
            <div className="flex flex-wrap gap-2 items-center text-sm text-gray-500 dark:text-gray-400">
                {caption.hashtags.length > 0 && <HashtagIcon className="w-4 h-4 text-blue-500" />}
                {caption.hashtags.map(tag => <span key={tag} className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">#{tag}</span>)}
            </div>
        </Card>
    );
};


export const CaptionGenerator: React.FC = () => {
    const [postDescription, setPostDescription] = useState('');
    const [options, setOptions] = useState<GenerationOptions>({
        tone: Tone.CASUAL,
        includeEmojis: true,
        includeHashtags: true,
        captionLength: 50,
        variantCount: 3,
    });
    const [captions, setCaptions] = useState<GeneratedCaption[]>([]);
    const [appState, setAppState] = useState<AppState>(AppState.IDLE);
    const [error, setError] = useState<string | null>(null);
    const [apiProvider, setApiProvider] = useState<ApiProvider>('gemini');

    const handleGenerate = useCallback(async () => {
        if (!postDescription.trim()) {
            setError("لطفاً توضیحاتی برای پست خود وارد کنید.");
            setAppState(AppState.ERROR);
            return;
        }
        setAppState(AppState.LOADING);
        setError(null);
        setCaptions([]);

        try {
            const generateFunction = apiProvider === 'gemini' ? generateGeminiCaptions : generateLocalCaptions;
            const results = await generateFunction(postDescription, options);
            setCaptions(results);
            setAppState(AppState.SUCCESS);
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : "یک خطای ناشناخته رخ داده است.";
            setError(errorMessage);
            setAppState(AppState.ERROR);
        }
    }, [postDescription, options, apiProvider]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 flex flex-col gap-6">
                <h2 className="text-2xl font-semibold">کپشن خود را بسازید</h2>
                <Card>
                    <div className="flex flex-col gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">انتخاب موتور هوش مصنوعی</label>
                            <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
                                <Button onClick={() => setApiProvider('gemini')} variant={apiProvider === 'gemini' ? 'primary' : 'ghost'} className={`w-full !rounded-md ${apiProvider === 'gemini' ? '' : 'text-gray-700 dark:text-gray-300'}`}>
                                    <CloudIcon className="w-4 h-4 ml-2" /> Gemini (ابری)
                                </Button>
                                <Button onClick={() => setApiProvider('local')} variant={apiProvider === 'local' ? 'primary' : 'ghost'} className={`w-full !rounded-md ${apiProvider === 'local' ? '' : 'text-gray-700 dark:text-gray-300'}`}>
                                    <ServerIcon className="w-4 h-4 ml-2" /> محلی (رایگان)
                                </Button>
                            </div>
                             {apiProvider === 'local' && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    مطمئن شوید که برنامه Ollama در حال اجراست. ممکن است سرعت کمتری داشته باشد.
                                </p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">توضیحات پست</label>
                            <textarea
                                id="description"
                                rows={5}
                                value={postDescription}
                                onChange={(e) => setPostDescription(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                                placeholder="مثال: عکسی از یک توله‌سگ گلدن رتریور که در دشتی پر از گل هنگام غروب آفتاب بازی می‌کند."
                            />
                        </div>
                        <div>
                           <label htmlFor="tone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">لحن کپشن</label>
                           <Select
                                id="tone"
                                value={options.tone}
                                onChange={(e) => setOptions(prev => ({ ...prev, tone: e.target.value as Tone }))}
                           >
                                {Object.values(Tone).map(t => <option key={t} value={t}>{t}</option>)}
                           </Select>
                        </div>
                        <div>
                            <label htmlFor="length" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                طول کپشن (حدود {options.captionLength} کلمه)
                            </label>
                            <Slider
                                id="length"
                                min={20}
                                max={150}
                                step={10}
                                value={options.captionLength}
                                onChange={(e) => setOptions(prev => ({...prev, captionLength: parseInt(e.target.value)}))}
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">همراه با اموجی</span>
                            <Toggle
                                checked={options.includeEmojis}
                                onChange={(e) => setOptions(prev => ({...prev, includeEmojis: e.target.checked}))}
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">همراه با هشتگ</span>
                            <Toggle
                                checked={options.includeHashtags}
                                onChange={(e) => setOptions(prev => ({...prev, includeHashtags: e.target.checked}))}
                            />
                        </div>
                        <Button
                            onClick={handleGenerate}
                            disabled={appState === AppState.LOADING}
                            className="w-full flex justify-center items-center gap-2"
                        >
                            {appState === AppState.LOADING ? (
                                <>
                                    در حال ساخت...
                                    <Spinner />
                                </>
                            ) : (
                                <>
                                    <SparklesIcon className="w-5 h-5" />
                                     ساخت کپشن
                                </>
                            )}
                        </Button>
                    </div>
                </Card>
            </div>

            <div className="lg:col-span-2">
                <h2 className="text-2xl font-semibold mb-6">کپشن‌های ساخته‌شده</h2>
                <div className="flex flex-col gap-6">
                    {appState === AppState.IDLE && (
                        <Card className="text-center py-16">
                            <p className="text-gray-500 dark:text-gray-400">کپشن‌های شما در اینجا نمایش داده خواهند شد.</p>
                        </Card>
                    )}
                     {appState === AppState.LOADING && (
                        <Card className="text-center py-16 flex flex-col items-center gap-4">
                            <Spinner className="w-8 h-8" />
                            <p className="text-gray-500 dark:text-gray-400">در حال نوشتن بهترین کلمات...</p>
                        </Card>
                    )}
                    {appState === AppState.ERROR && error && (
                        <Card className="border-red-500/50 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 flex items-start gap-4 p-4">
                           <AlertTriangleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                           <div>
                                <h3 className="font-semibold">ساخت کپشن ناموفق بود</h3>
                                <p className="text-sm">{error}</p>
                           </div>
                        </Card>
                    )}
                    {appState === AppState.SUCCESS && captions.map(caption => (
                        <CaptionResult key={caption.id} caption={caption} />
                    ))}
                </div>
            </div>
        </div>
    );
};