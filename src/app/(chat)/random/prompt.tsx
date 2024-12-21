'use client';

import { useState } from 'react';
import promptData from '@/data/prompts.json';

interface Props {
    onPromptSelect: (prompt: string | null) => void;
}

export default function PromptSelector({ onPromptSelect }: Props) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const categories = Object.entries(promptData.prompts);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
            <div className="w-full max-w-3xl bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-4 sm:p-6 backdrop-blur-lg animate-in slide-in-from-bottom-4 duration-200">
                <button
                    onClick={() => onPromptSelect(null)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 transition-colors bg-gray-800 rounded-full p-1.5 border border-gray-700"
                    aria-label="Close"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-base sm:text-lg md:text-2xl font-black mb-3 sm:mb-4 text-left text-white">
                    SELECT A <span className="text-[#752add]">PROMPT</span>
                </h2>

                <div className="space-y-2 sm:space-y-4 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    {categories.map(([key, category]) => (
                        <div key={key} className="space-y-2">
                            <button
                                onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                                className="w-full text-left p-2 sm:p-3 md:p-4 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all hover:bg-gray-700 border border-gray-700"
                            >
                                <h3 className="font-semibold text-sm sm:text-base md:text-lg text-white">
                                    {category.name}
                                </h3>
                            </button>
                            
                            {selectedCategory === key && (
                                <div className="ml-4 space-y-2">
                                    {category.prompts.map((prompt, index) => (
                                        <button
                                            key={index}
                                            onClick={() => onPromptSelect(prompt)}
                                            className="w-full text-left p-2 sm:p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all border border-gray-700/50"
                                        >
                                            <p className="text-gray-200 text-xs sm:text-sm">{prompt}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
