
import React from 'react';
import { Icon } from '../components/Icon';
import { GlassCard } from '../components/GlassCard';
import type { Page } from '../types';
import { useAuth } from '../context/AuthContext';

interface HomePageProps {
  pages: Page[];
  setActivePageId: (id: string) => void;
}

const featureConfig: { [key: string]: { description: string, gradient: string, icon: string, span: string, comingSoon?: boolean } } = {
  tripPlanner: {
    description: "AI-curated itineraries with real-world grounding.",
    gradient: "from-emerald-500 to-teal-600",
    icon: "travel_explore",
    span: "md:col-span-2"
  },
  textPlayground: {
    description: "Advanced text generation with Thinking Mode.",
    gradient: "from-aurora-500 to-aurora-700",
    icon: "edit_note",
    span: ""
  },
  codeDebugger: {
    description: "Fix bugs instantly with deep code analysis.",
    gradient: "from-amber-500 to-orange-600",
    icon: "code",
    span: "md:col-span-2"
  },
  imagePlayground: {
    description: "Generate, edit, and analyze images in one studio.",
    gradient: "from-rose-500 to-pink-600",
    icon: "palette",
    span: "md:col-span-2"
  },
  voiceChat: {
    description: "Real-time voice interactions with AI.",
    gradient: "from-red-500 to-rose-600",
    icon: "graphic_eq",
    span: ""
  },
  videoPlayground: {
    description: "Create stunning videos with Veo 3.",
    gradient: "from-cyan-500 to-blue-600",
    icon: "movie_filter",
    span: ""
  },
  audioPlayground: {
    description: "Transcribe and synthesize audio.",
    gradient: "from-violet-500 to-purple-600",
    icon: "mic",
    span: ""
  },
  // Coming Soon Features
  musicStudio: {
    description: "AI music generation and stem splitting.",
    gradient: "from-pink-500 to-rose-600",
    icon: "music_note",
    span: "",
    comingSoon: true
  },
  threeDStudio: {
    description: "Text-to-3D model creation.",
    gradient: "from-cyan-500 to-teal-600",
    icon: "view_in_ar",
    span: "",
    comingSoon: true
  },
  documentChat: {
    description: "Chat with PDFs and documents (RAG).",
    gradient: "from-orange-500 to-amber-600",
    icon: "description",
    span: "",
    comingSoon: true
  },
  agentBuilder: {
    description: "Build custom AI personas.",
    gradient: "from-indigo-500 to-purple-600",
    icon: "smart_toy",
    span: "",
    comingSoon: true
  },
  gallery: {
    description: "Share and discover community creations.",
    gradient: "from-red-500 to-pink-600",
    icon: "collections",
    span: "",
    comingSoon: true
  },
  promptMarket: {
    description: "Curated prompt library for all tools.",
    gradient: "from-teal-500 to-green-600",
    icon: "storefront",
    span: "",
    comingSoon: true
  },
  canvas: {
    description: "Infinite whiteboard for creative ideas.",
    gradient: "from-lime-500 to-green-600",
    icon: "dashboard",
    span: "",
    comingSoon: true
  },
  // Wave 2 Coming Soon
  podcastStudio: {
    description: "Convert text to podcasts with AI voices.",
    gradient: "from-purple-500 to-violet-600",
    icon: "podcasts",
    span: "",
    comingSoon: true
  },
  dataInsights: {
    description: "Upload data, get AI-powered charts and analysis.",
    gradient: "from-blue-500 to-cyan-600",
    icon: "insights",
    span: "",
    comingSoon: true
  },
  presentationBuilder: {
    description: "Generate slide decks from any topic.",
    gradient: "from-orange-500 to-red-600",
    icon: "slideshow",
    span: "",
    comingSoon: false
  },
  emailComposer: {
    description: "AI-powered email drafting and replies.",
    gradient: "from-green-500 to-emerald-600",
    icon: "mail",
    span: "",
    comingSoon: false
  },
  avatarStudio: {
    description: "Generate AI avatars and profile pictures.",
    gradient: "from-pink-500 to-rose-600",
    icon: "face",
    span: "",
    comingSoon: false
  },
  resumeBuilder: {
    description: "Generate ATS-optimized resumes.",
    gradient: "from-indigo-500 to-blue-600",
    icon: "description",
    span: "",
    comingSoon: false
  },
  seoOptimizer: {
    description: "Analyze and improve content for search engines.",
    gradient: "from-teal-500 to-cyan-600",
    icon: "search",
    span: "",
    comingSoon: false
  },
  meetingNotes: {
    description: "Get summaries, action items, and decisions.",
    gradient: "from-yellow-500 to-amber-600",
    icon: "summarize",
    span: "",
    comingSoon: false
  },
  aiTutor: {
    description: "Interactive learning with personalized explanations.",
    gradient: "from-emerald-500 to-green-600",
    icon: "school",
    span: "",
    comingSoon: false
  },
  productPhoto: {
    description: "AI product shots and background replacement.",
    gradient: "from-red-500 to-rose-600",
    icon: "photo_camera",
    span: "",
    comingSoon: false
  },
  // Wave 3 Coming Soon
  socialMedia: {
    description: "Generate posts, captions & hashtags for any platform.",
    gradient: "from-pink-500 to-purple-600",
    icon: "share",
    span: "",
    comingSoon: false
  },
  aiTranslator: {
    description: "Translate text with cultural context in 100+ languages.",
    gradient: "from-blue-500 to-indigo-600",
    icon: "translate",
    span: "",
    comingSoon: false
  },
  storyWriter: {
    description: "Generate stories, characters & creative writing.",
    gradient: "from-amber-500 to-orange-600",
    icon: "auto_stories",
    span: "",
    comingSoon: false
  },
  fitnessCoach: {
    description: "Personalized workouts, meal plans & progress tracking.",
    gradient: "from-green-500 to-emerald-600",
    icon: "fitness_center",
    span: "",
    comingSoon: false
  },
  memeGenerator: {
    description: "Create viral memes with AI suggestions.",
    gradient: "from-yellow-500 to-orange-600",
    icon: "sentiment_very_satisfied",
    span: "",
    comingSoon: false
  },
};

export const HomePage: React.FC<HomePageProps> = ({ pages, setActivePageId }) => {
  const { isAdmin } = useAuth();
  const features = pages.filter(p => p.id !== 'home' && !p.hidden);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px] animate-aurora mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px] animate-aurora animation-delay-2000 mix-blend-screen" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-cyan-500/20 rounded-full blur-[100px] animate-pulse-glow mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-20">

        {/* Hero Section */}
        <section className="text-center space-y-8 relative">

          {/* Branding Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 backdrop-blur-md shadow-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aurora-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-aurora-500"></span>
            </span>
            <span className="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-200">
              Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-aurora-500 to-cyan-500">Shadow Si</span>
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black tracking-tighter leading-[1.1]">
            <span className="block text-slate-900 dark:text-white drop-shadow-sm">Shadow</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 animate-shimmer bg-[length:200%_auto]">
              Showcase
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
            The ultimate multimodal AI playground. Generate images, analyze code, and interact with intelligence like never before.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <button
              onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Creating <Icon name="arrow_forward" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>

          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="capabilities" className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
            <h2 className="text-2xl font-bold text-slate-400 uppercase tracking-widest">Capabilities</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[240px]">
            {features.map(page => {
              const config = featureConfig[page.id] || {
                description: "Explore advanced AI capabilities.",
                gradient: "from-slate-500 to-slate-600",
                icon: page.icon,
                span: "",
                comingSoon: false
              };

              // Admin users bypass Coming Soon restrictions
              const isComingSoon = isAdmin ? false : config.comingSoon;

              return (
                <GlassCard
                  key={page.id}
                  hover={!isComingSoon}
                  gradient
                  onClick={() => !isComingSoon && setActivePageId(page.id)}
                  className={`group relative overflow-hidden p-8 flex flex-col justify-between ${config.span} border-0 ring-1 ring-white/10 dark:ring-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-xl ${isComingSoon ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                >
                  {/* Coming Soon Badge */}
                  {isComingSoon && (
                    <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                      Coming Soon
                    </div>
                  )}

                  <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 ${!isComingSoon ? 'group-hover:opacity-10' : ''} transition-opacity duration-500`} />

                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg mb-6 ${!isComingSoon ? 'group-hover:scale-110' : 'grayscale-[20%]'} transition-transform duration-500`}>
                      <Icon name={config.icon} className="text-3xl text-white" />
                    </div>

                    <h3 className={`text-2xl font-bold text-slate-800 dark:text-white mb-2 ${!isComingSoon ? 'group-hover:translate-x-1' : ''} transition-transform duration-300`}>
                      {page.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {config.description}
                    </p>
                  </div>

                  {/* Arrow for active features only */}
                  {!isComingSoon && (
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                      <Icon name="arrow_forward" className={`text-2xl text-transparent bg-clip-text bg-gradient-to-r ${config.gradient}`} />
                    </div>
                  )}

                  {/* Coming Soon indicator */}
                  {isComingSoon && (
                    <div className="absolute bottom-4 right-4 flex items-center gap-1 text-amber-500">
                      <Icon name="schedule" className="text-lg" />
                      <span className="text-xs font-medium">Launching Soon</span>
                    </div>
                  )}
                </GlassCard>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-20 pb-8 text-center border-t border-slate-200 dark:border-slate-800/50">
          <p className="text-slate-500 dark:text-slate-500 font-medium">
            © {new Date().getFullYear()} Shadow Showcase. Powered by <span className="text-aurora-600 dark:text-aurora-400">Shadow Si</span>.
          </p>
        </footer>
      </div>
    </div>
  );
};
