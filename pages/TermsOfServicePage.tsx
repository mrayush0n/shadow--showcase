import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassCard } from '../components/GlassCard';

interface TermsOfServicePageProps {
    onAccept: () => void;
}

// Full Terms of Service content component
const FullTermsContent: React.FC = () => (
    <div className="space-y-6 text-sm">
        <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Welcome to Shadow Showcase</h3>
            <p className="text-slate-600 dark:text-slate-300">
                By accessing and using Shadow Showcase, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this application.
            </p>
        </div>

        <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">1. Use License</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-2">
                Permission is granted to use Shadow Showcase and Shadow SI for personal, non-commercial purposes. This license does not include:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1 ml-2">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose</li>
                <li>Attempting to reverse engineer any software</li>
                <li>Removing any copyright or proprietary notations</li>
                <li>Transferring the materials to another person</li>
            </ul>
        </div>

        <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">2. AI-Generated Content</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-2">
                Shadow Showcase uses advanced AI technology (Shadow SI) to generate content. You acknowledge that:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1 ml-2">
                <li>AI-generated content may not always be accurate or appropriate</li>
                <li>You are responsible for reviewing and verifying all generated content</li>
                <li>Shadow Showcase is not liable for decisions made based on AI output</li>
                <li>Generated content should not be used for illegal or harmful purposes</li>
            </ul>
        </div>

        <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">3. User Data & Privacy</h3>
            <p className="text-slate-600 dark:text-slate-300">
                We respect your privacy and are committed to protecting your personal data. Your usage data may be collected to improve our services. We do not sell your personal information to third parties.
            </p>
        </div>

        <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">4. Account Security</h3>
            <p className="text-slate-600 dark:text-slate-300">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Please notify us immediately of any unauthorized use.
            </p>
        </div>

        <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">5. Service Modifications</h3>
            <p className="text-slate-600 dark:text-slate-300">
                Shadow Showcase reserves the right to modify or discontinue the service at any time without prior notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
            </p>
        </div>

        <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">6. Limitation of Liability</h3>
            <p className="text-slate-600 dark:text-slate-300">
                In no event shall Shadow Showcase or its suppliers be liable for any damages arising out of the use or inability to use the materials or services provided by Shadow Showcase.
            </p>
        </div>

        <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">7. Governing Law</h3>
            <p className="text-slate-600 dark:text-slate-300">
                These terms and conditions are governed by and construed in accordance with applicable laws, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
        </div>

        <div className="mt-4 p-3 bg-aurora-100 dark:bg-aurora-900/30 rounded-lg border border-aurora-200 dark:border-aurora-700/50">
            <p className="text-xs text-aurora-700 dark:text-aurora-300 font-medium">
                Last updated: December 2024
            </p>
        </div>
    </div>
);

export const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({ onAccept }) => {
    const [isChecked, setIsChecked] = useState(false);
    const [showFullTerms, setShowFullTerms] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <AnimatedBackground variant="intense" />

            <div className="relative z-10 w-full max-w-md">
                <GlassCard className="p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Terms of Use
                        </h1>
                    </div>

                    {/* Checkbox with Terms Link */}
                    <label className="flex items-start gap-3 cursor-pointer mb-6">
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                            className="w-5 h-5 mt-0.5 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                            I accept and agree to the{' '}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowFullTerms(!showFullTerms);
                                }}
                                className="text-cyan-600 dark:text-cyan-400 underline hover:text-cyan-700 dark:hover:text-cyan-300 font-medium"
                            >
                                Terms of Use
                            </button>
                            .
                        </span>
                    </label>

                    {/* Expandable Full Terms */}
                    {showFullTerms && (
                        <div className="mb-6 max-h-64 overflow-y-auto bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                            <FullTermsContent />
                        </div>
                    )}

                    {/* Continue Button */}
                    <button
                        onClick={onAccept}
                        disabled={!isChecked}
                        className={`w-full py-3.5 px-4 font-semibold rounded-full transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-wide text-sm ${isChecked
                                ? 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white shadow-lg shadow-rose-500/30 cursor-pointer'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                            }`}
                    >
                        Continue
                    </button>
                </GlassCard>
            </div>
        </div>
    );
};
