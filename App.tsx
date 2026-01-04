
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { AnimatedBackground } from './components/AnimatedBackground';
import type { Page } from './types';
import { HomePage } from './pages/HomePage';
import { TextPlaygroundPage } from './pages/TextPlaygroundPage';
import { useAuth } from './context/AuthContext';
import { Spinner } from './components/Spinner';
import { AuthPage } from './pages/AuthPage';
import { OnboardingWizard } from './pages/OnboardingWizard';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { VoiceChatPage } from './pages/VoiceChatPage';
import { VideoPlaygroundPage } from './pages/VideoPlaygroundPage';
import { AudioPlaygroundPage } from './pages/AudioPlaygroundPage';
import { TripPlannerPage } from './pages/TripPlannerPage';
import { ProfilePage } from './pages/ProfilePage';
import { CodeDebuggerPage } from './pages/CodeAssistantPage';
import { ImagePlaygroundPage } from './pages/ImagePlaygroundPage';
import { Icon } from './components/Icon';
import { ContentToolsPage } from './pages/ContentToolsPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { AccountRecoveryPage } from './pages/AccountRecoveryPage';
import { SecuritySettingsPage } from './pages/SecuritySettingsPage';
import { TwoFactorVerificationPage } from './pages/TwoFactorVerificationPage';
import { auth, db } from './firebase';
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ServicesPage } from './pages/ServicesPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { FaqPage } from './pages/FaqPage';
import { ServiceDetailPage, ServiceType } from './pages/ServiceDetailPage';
import { PricingPage } from './pages/PricingPage';
import { BlogPage } from './pages/BlogPage';
import { LiveDemoPage } from './pages/LiveDemoPage';
import { LegalPage } from './pages/LegalPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { MusicStudioPage } from './pages/MusicStudioPage';
import { ThreeDStudioPage } from './pages/ThreeDStudioPage';
import { DocumentChatPage } from './pages/DocumentChatPage';
import { AgentBuilderPage } from './pages/AgentBuilderPage';
import { GalleryPage } from './pages/GalleryPage';
import { PromptMarketPage } from './pages/PromptMarketPage';
import { CanvasPage } from './pages/CanvasPage';
import { CommandPalette } from './components/CommandPalette';
import { PodcastStudioPage } from './pages/PodcastStudioPage';
import { DataInsightsPage } from './pages/DataInsightsPage';
import { PresentationBuilderPage } from './pages/PresentationBuilderPage';
import { EmailComposerPage } from './pages/EmailComposerPage';
import { AvatarStudioPage } from './pages/AvatarStudioPage';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';
import { SeoOptimizerPage } from './pages/SeoOptimizerPage';
import { MeetingNotesPage } from './pages/MeetingNotesPage';
import { AiTutorPage } from './pages/AiTutorPage';
import { ProductPhotoPage } from './pages/ProductPhotoPage';
import { SocialMediaManagerPage } from './pages/SocialMediaManagerPage';
import { AiTranslatorPage } from './pages/AiTranslatorPage';
import { StoryWriterPage } from './pages/StoryWriterPage';
import { FitnessCoachPage } from './pages/FitnessCoachPage';
import { MemeGeneratorPage } from './pages/MemeGeneratorPage';

// Simple device fingerprint
const getDeviceFingerprint = () => {
  const nav = navigator;
  return btoa(`${nav.userAgent}-${nav.language}-${screen.width}x${screen.height}`).slice(0, 32);
};

const pages: Page[] = [
  { id: 'home', name: 'Home', icon: 'space_dashboard', component: HomePage },
  { id: 'textPlayground', name: 'Text Playground', icon: 'edit_note', component: TextPlaygroundPage },
  { id: 'imagePlayground', name: 'Image Studio', icon: 'palette', component: ImagePlaygroundPage },
  { id: 'videoPlayground', name: 'Video Studio', icon: 'movie_filter', component: VideoPlaygroundPage },
  { id: 'codeDebugger', name: 'Code Assistant', icon: 'code', component: CodeDebuggerPage },
  { id: 'voiceChat', name: 'Voice Chat', icon: 'graphic_eq', component: VoiceChatPage },
  { id: 'audioPlayground', name: 'Audio Tools', icon: 'mic', component: AudioPlaygroundPage },
  { id: 'tripPlanner', name: 'Trip Planner', icon: 'travel_explore', component: TripPlannerPage },
  // Coming Soon - Wave 1
  { id: 'musicStudio', name: 'Music Studio', icon: 'music_note', component: MusicStudioPage },
  { id: 'threeDStudio', name: '3D Generator', icon: 'view_in_ar', component: ThreeDStudioPage },
  { id: 'documentChat', name: 'Doc Chat', icon: 'description', component: DocumentChatPage },
  { id: 'agentBuilder', name: 'AI Agents', icon: 'smart_toy', component: AgentBuilderPage },
  { id: 'gallery', name: 'Gallery', icon: 'collections', component: GalleryPage },
  { id: 'promptMarket', name: 'Prompts', icon: 'storefront', component: PromptMarketPage },
  { id: 'canvas', name: 'Canvas', icon: 'dashboard', component: CanvasPage },
  // Coming Soon - Wave 2
  { id: 'podcastStudio', name: 'Podcast', icon: 'podcasts', component: PodcastStudioPage },
  { id: 'dataInsights', name: 'Data Insights', icon: 'insights', component: DataInsightsPage },
  { id: 'presentationBuilder', name: 'Slides', icon: 'slideshow', component: PresentationBuilderPage },
  { id: 'emailComposer', name: 'Email', icon: 'mail', component: EmailComposerPage },
  { id: 'avatarStudio', name: 'Avatars', icon: 'face', component: AvatarStudioPage },
  { id: 'resumeBuilder', name: 'Resume', icon: 'description', component: ResumeBuilderPage },
  { id: 'seoOptimizer', name: 'SEO', icon: 'search', component: SeoOptimizerPage },
  { id: 'meetingNotes', name: 'Meetings', icon: 'summarize', component: MeetingNotesPage },
  { id: 'aiTutor', name: 'AI Tutor', icon: 'school', component: AiTutorPage },
  { id: 'productPhoto', name: 'Product Photo', icon: 'photo_camera', component: ProductPhotoPage },
  // Coming Soon - Wave 3
  { id: 'socialMedia', name: 'Social Media', icon: 'share', component: SocialMediaManagerPage },
  { id: 'aiTranslator', name: 'Translator', icon: 'translate', component: AiTranslatorPage },
  { id: 'storyWriter', name: 'Story Writer', icon: 'auto_stories', component: StoryWriterPage },
  { id: 'fitnessCoach', name: 'Fitness', icon: 'fitness_center', component: FitnessCoachPage },
  { id: 'memeGenerator', name: 'Memes', icon: 'sentiment_very_satisfied', component: MemeGeneratorPage },
  // Hidden
  { id: 'contentTools', name: 'Content Tools', icon: 'history_edu', component: ContentToolsPage, hidden: true },
  { id: 'profile', name: 'Profile', icon: 'person', component: ProfilePage, hidden: true },
  { id: 'security', name: 'Security', icon: 'shield', component: SecuritySettingsPage, hidden: true },
];

type AuthView = 'landing' | 'login' | 'signup' | 'forgotPassword' | 'accountRecovery' | 'about' | 'contact' | 'services' | 'portfolio' | 'faq' | 'pricing' | 'blog' | 'demo' | 'service-image' | 'service-video' | 'service-text' | 'service-code' | 'service-trip' | 'service-voice' | 'privacy' | 'terms' | '404';

export default function App() {
  const { user, userProfile, loading } = useAuth();
  const [activePageId, setActivePageId] = useState<string>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('landing');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Command Palette keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update document title based on view
  useEffect(() => {
    const titles: Record<string, string> = {
      landing: 'Next Gen AI Platform',
      login: 'Login',
      signup: 'Sign Up',
      forgotPassword: 'Reset Password',
      accountRecovery: 'Account Recovery',
      about: 'About Us',
      contact: 'Contact Us',
      services: 'Our Services',
      portfolio: 'Portfolio',
      pricing: 'Pricing',
      blog: 'Blog',
      demo: 'Live Demo',
      faq: 'FAQ',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      '404': 'Page Not Found'
    };

    let title = titles[authView] || 'Home';

    if (authView.startsWith('service-')) {
      const service = authView.replace('service-', '');
      title = `${service.charAt(0).toUpperCase() + service.slice(1)} Studio`;
    }

    document.title = `${title} | Shadow Showcase`;
  }, [authView]);
  const [twoFactorPending, setTwoFactorPending] = useState(false);
  const [twoFactorChecked, setTwoFactorChecked] = useState(false);

  // Check if 2FA verification is needed
  useEffect(() => {
    const check2FA = async () => {
      if (user && userProfile && userProfile.twoFactorEnabled && !twoFactorChecked) {
        const deviceFingerprint = getDeviceFingerprint();
        const verifiedDevices = userProfile.twoFactorVerifiedDevices || [];

        if (!verifiedDevices.includes(deviceFingerprint)) {
          setTwoFactorPending(true);
        }
        setTwoFactorChecked(true);
      }
    };

    check2FA();
  }, [user, userProfile, twoFactorChecked]);

  // Reset 2FA check on logout
  useEffect(() => {
    if (!user) {
      setTwoFactorPending(false);
      setTwoFactorChecked(false);
    }
  }, [user]);

  // Handle Terms of Service acceptance - save to Firestore
  const handleTosAccept = async () => {
    if (user) {
      try {
        await db.collection('users').doc(user.uid).update({
          tosAccepted: true,
          tosAcceptedAt: new Date().toISOString()
        });
        // Force a refresh by triggering auth state change
        window.location.reload();
      } catch (error) {
        console.error('Error saving ToS acceptance:', error);
      }
    }
  };

  const handleTwoFactorVerified = () => {
    setTwoFactorPending(false);
  };

  const handleTwoFactorCancel = async () => {
    await auth.signOut();
    setTwoFactorPending(false);
    setTwoFactorChecked(false);
    setAuthView('login');
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <AnimatedBackground variant="minimal" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium animate-pulse">
            Loading Shadow Showcase...
          </p>
        </div>
      </div>
    );
  }

  // First, check if user is authenticated
  if (!user) {
    switch (authView) {
      case 'signup':
        return <OnboardingWizard onBack={() => setAuthView('landing')} />;
      case 'login':
        return (
          <AuthPage
            onShowSignup={() => setAuthView('signup')}
            onShowForgotPassword={() => setAuthView('forgotPassword')}
            onShowAccountRecovery={() => setAuthView('accountRecovery')}
          />
        );
      case 'forgotPassword':
        return <ForgotPasswordPage onBack={() => setAuthView('login')} />;
      case 'accountRecovery':
        return <AccountRecoveryPage onBack={() => setAuthView('login')} />;
      case 'about':
        return (
          <AboutPage
            onBack={() => setAuthView('landing')}
            onLogin={() => setAuthView('login')}
            onExplore={() => setAuthView('signup')}
          />
        );
      case 'contact':
        return (
          <ContactPage
            onBack={() => setAuthView('landing')}
            onLogin={() => setAuthView('login')}
            onExplore={() => setAuthView('signup')}
          />
        );
      case 'services':
        return (
          <ServicesPage
            onBack={() => setAuthView('landing')}
            onLogin={() => setAuthView('login')}
            onExplore={() => setAuthView('signup')}
          />
        );
      case 'portfolio':
        return (
          <PortfolioPage
            onBack={() => setAuthView('landing')}
            onLogin={() => setAuthView('login')}
            onExplore={() => setAuthView('signup')}
          />
        );
      case 'faq':
        return (
          <FaqPage
            onBack={() => setAuthView('landing')}
            onLogin={() => setAuthView('login')}
            onExplore={() => setAuthView('signup')}
          />
        );
      case 'pricing':
        return (
          <PricingPage
            onBack={() => setAuthView('landing')}
            onLogin={() => setAuthView('login')}
            onExplore={() => setAuthView('signup')}
          />
        );
      case 'blog':
        return (
          <BlogPage
            onBack={() => setAuthView('landing')}
            onLogin={() => setAuthView('login')}
            onExplore={() => setAuthView('signup')}
          />
        );
      case 'demo':
        return (
          <LiveDemoPage
            onBack={() => setAuthView('landing')}
            onLogin={() => setAuthView('login')}
            onExplore={() => setAuthView('signup')}
          />
        );
      case 'privacy':
        return (
          <LegalPage
            section="privacy"
            onBack={() => setAuthView('landing')}
          />
        );
      case 'terms':
        return (
          <LegalPage
            section="terms"
            onBack={() => setAuthView('landing')}
          />
        );
      case '404':
        return (
          <NotFoundPage
            onBack={() => setAuthView('landing')}
          />
        );
      default: // 'landing' or service detail pages
        // Check for service detail pages
        if (authView.startsWith('service-')) {
          const serviceType = authView.replace('service-', '') as ServiceType;
          return (
            <ServiceDetailPage
              service={serviceType}
              onBack={() => setAuthView('landing')}
              onLogin={() => setAuthView('login')}
              onExplore={() => setAuthView('signup')}
            />
          );
        }
        return (
          <LandingPage
            onLogin={() => setAuthView('login')}
            onExplore={() => setAuthView('signup')}
            onNavigate={(page) => setAuthView(page as AuthView)}
          />
        );
    }
  }

  // Check if 2FA verification is pending
  if (twoFactorPending && user) {
    return (
      <TwoFactorVerificationPage
        user={user}
        onVerified={handleTwoFactorVerified}
        onCancel={handleTwoFactorCancel}
      />
    );
  }

  // User is authenticated - check if they've accepted Terms of Service
  // This only shows for NEW users who haven't accepted ToS yet
  if (userProfile && !userProfile.tosAccepted) {
    return <TermsOfServicePage onAccept={handleTosAccept} />;
  }

  if (userProfile && !userProfile.profileComplete) {
    return <OnboardingWizard onComplete={() => window.location.reload()} />;
  }

  const ActivePageComponent = pages.find(p => p.id === activePageId)?.component || HomePage;
  const activePage = pages.find(p => p.id === activePageId) || pages[0];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground variant="default" />

      {/* Sidebar */}
      <Sidebar
        pages={pages}
        activePageId={activePageId}
        setActivePageId={setActivePageId}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:ml-72 relative z-0 h-full">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-20">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Icon name="menu" className="text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Icon name={activePage.icon} className="text-aurora-500" />
            {activePage.name}
          </h1>
          <div className="w-10" /> {/* Spacer for balance */}
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            <ActivePageComponent pages={pages} setActivePageId={setActivePageId} />
          </div>
        </div>
      </main>

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={(page) => {
          setActivePageId(page);
          setCommandPaletteOpen(false);
        }}
      />
    </div>
  );
}
