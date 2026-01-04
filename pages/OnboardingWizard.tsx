import React, { useState, useRef, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Icon } from '../components/Icon';
import { Spinner } from '../components/Spinner';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassCard } from '../components/GlassCard';

interface StepProps {
    data: FormData;
    updateData: (field: string, value: any) => void;
    errors: Record<string, string>;
}

interface FormData {
    // Step 1: Personal Info
    firstName: string;
    lastName: string;
    phone: string;
    // Step 2: Account
    email: string;
    password: string;
    confirmPassword: string;
    // Step 3: Profile
    dob: string;
    gender: string;
    photoURL: string | null;
    photoFile: File | null;
    // Step 4: Location
    address: string;
    city: string;
    state: string;
    country: string;
    // Step 5: Interests
    bio: string;
    interests: string;
    receiveEmails: boolean;
}

const STEPS = [
    { id: 1, title: 'Personal Info', icon: 'person', description: 'Tell us about yourself' },
    { id: 2, title: 'Account', icon: 'lock', description: 'Create your secure account' },
    { id: 3, title: 'Profile', icon: 'badge', description: 'Customize your profile' },
    { id: 4, title: 'Location', icon: 'location_on', description: 'Where are you from?' },
    { id: 5, title: 'Interests', icon: 'interests', description: 'What interests you?' },
];

const initialFormData: FormData = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    gender: '',
    photoURL: null,
    photoFile: null,
    address: '',
    city: '',
    state: '',
    country: '',
    bio: '',
    interests: '',
    receiveEmails: true,
};

// Step 1: Personal Info
const Step1PersonalInfo: React.FC<StepProps> = ({ data, updateData, errors }) => (
    <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                    First Name *
                </label>
                <input
                    type="text"
                    value={data.firstName}
                    onChange={(e) => updateData('firstName', e.target.value)}
                    placeholder="John"
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border ${errors.firstName ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent text-slate-900 dark:text-white transition-all`}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Last Name *
                </label>
                <input
                    type="text"
                    value={data.lastName}
                    onChange={(e) => updateData('lastName', e.target.value)}
                    placeholder="Doe"
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border ${errors.lastName ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent text-slate-900 dark:text-white transition-all`}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>
        </div>
        <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Phone <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
                type="tel"
                value={data.phone}
                onChange={(e) => updateData('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent text-slate-900 dark:text-white transition-all"
            />
        </div>
    </div>
);

// Step 2: Account
const Step2Account: React.FC<StepProps> = ({ data, updateData, errors }) => (
    <div className="space-y-5">
        <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Email Address *
            </label>
            <input
                type="email"
                value={data.email}
                onChange={(e) => updateData('email', e.target.value)}
                placeholder="john@example.com"
                className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent text-slate-900 dark:text-white transition-all`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Password *
            </label>
            <input
                type="password"
                value={data.password}
                onChange={(e) => updateData('password', e.target.value)}
                placeholder="At least 6 characters"
                className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border ${errors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent text-slate-900 dark:text-white transition-all`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>
        <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Confirm Password *
            </label>
            <input
                type="password"
                value={data.confirmPassword}
                onChange={(e) => updateData('confirmPassword', e.target.value)}
                placeholder="Re-enter your password"
                className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent text-slate-900 dark:text-white transition-all`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>
    </div>
);

// Step 3: Profile
const Step3Profile: React.FC<StepProps & { fileInputRef: React.RefObject<HTMLInputElement>, onPhotoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ data, updateData, errors, fileInputRef, onPhotoSelect }) => (
    <div className="space-y-5">
        {/* Photo Upload */}
        <div className="flex items-center gap-5">
            <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-slate-200 dark:bg-slate-700 overflow-hidden border-2 border-slate-300 dark:border-slate-600">
                    {data.photoURL ? (
                        <img src={data.photoURL} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-400">
                            {data.firstName?.[0]?.toUpperCase() || '?'}
                        </div>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 p-2 bg-aurora-500 rounded-full text-white shadow-lg hover:bg-aurora-600 transition-colors"
                >
                    <Icon name="camera_alt" className="text-sm" />
                </button>
                <input type="file" ref={fileInputRef} onChange={onPhotoSelect} className="hidden" accept="image/*" />
            </div>
            <div>
                <p className="font-medium text-slate-900 dark:text-white">Profile Photo</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Click to upload (optional)</p>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Date of Birth
                </label>
                <input
                    type="date"
                    value={data.dob}
                    onChange={(e) => updateData('dob', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent text-slate-900 dark:text-white transition-all"
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Gender
                </label>
                <select
                    value={data.gender}
                    onChange={(e) => updateData('gender', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent text-slate-900 dark:text-white transition-all"
                >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
            </div>
        </div>
    </div>
);

// Step 4: Location
const Step4Location: React.FC<StepProps> = ({ data, updateData }) => (
    <div className="space-y-5">
        <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Address
            </label>
            <input
                type="text"
                value={data.address}
                onChange={(e) => updateData('address', e.target.value)}
                placeholder="123 Main Street"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent text-slate-900 dark:text-white transition-all"
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                    City
                </label>
                <input
                    type="text"
                    value={data.city}
                    onChange={(e) => updateData('city', e.target.value)}
                    placeholder="New York"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent text-slate-900 dark:text-white transition-all"
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                    State / Province
                </label>
                <input
                    type="text"
                    value={data.state}
                    onChange={(e) => updateData('state', e.target.value)}
                    placeholder="NY"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent text-slate-900 dark:text-white transition-all"
                />
            </div>
        </div>
        <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Country
            </label>
            <input
                type="text"
                value={data.country}
                onChange={(e) => updateData('country', e.target.value)}
                placeholder="United States"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent text-slate-900 dark:text-white transition-all"
            />
        </div>
    </div>
);

// Step 5: Interests
const Step5Interests: React.FC<StepProps> = ({ data, updateData }) => (
    <div className="space-y-5">
        <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Bio
            </label>
            <textarea
                value={data.bio}
                onChange={(e) => updateData('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent text-slate-900 dark:text-white transition-all resize-none"
            />
        </div>
        <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Interests
            </label>
            <input
                type="text"
                value={data.interests}
                onChange={(e) => updateData('interests', e.target.value)}
                placeholder="AI, Design, Music, Travel..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent text-slate-900 dark:text-white transition-all"
            />
        </div>
        <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-aurora-400 transition-colors">
            <input
                type="checkbox"
                checked={data.receiveEmails}
                onChange={(e) => updateData('receiveEmails', e.target.checked)}
                className="w-5 h-5 rounded text-aurora-600 focus:ring-aurora-500 border-slate-300"
            />
            <div>
                <p className="font-medium text-slate-900 dark:text-white text-sm">Email Updates</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Receive updates about new AI features</p>
            </div>
        </label>
    </div>
);

import { useAuth } from '../context/AuthContext';

export const OnboardingWizard: React.FC<{ onComplete?: () => void; onBack?: () => void }> = ({ onComplete, onBack }) => {
    const { user, loading } = useAuth(); // Get loading state
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [globalError, setGlobalError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize with existing user data if available
    useEffect(() => {
        if (!loading && user) {
            setFormData(prev => ({
                ...prev,
                firstName: prev.firstName || user.displayName?.split(' ')[0] || '',
                lastName: prev.lastName || user.displayName?.split(' ').slice(1).join(' ') || '',
                email: user.email || '',
                photoURL: user.photoURL || null
            }));

            // If user exists, we are in "Completion Mode"
            // We can intelligently decide where to start or just let them review Step 1
        }
    }, [user, loading]);

    const updateData = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                photoFile: file,
                photoURL: URL.createObjectURL(file)
            }));
        }
    };

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};

        switch (step) {
            case 1:
                if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
                if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
                break;
            case 2:
                // Only validate account fields if this is a NEW user (no auth user present)
                if (!user) {
                    if (!formData.email.trim()) newErrors.email = 'Email is required';
                    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
                    if (!formData.password) newErrors.password = 'Password is required';
                    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
                    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
                    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            if (currentStep < 5) {
                let nextStep = currentStep + 1;

                // Skip Step 2 (Account) if user is already logged in
                if (user && nextStep === 2) {
                    nextStep = 3;
                }

                setCurrentStep(nextStep);
            } else {
                handleSubmit();
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            let prevStep = currentStep - 1;

            // Skip Step 2 (Account) if user is already logged in going back
            if (user && prevStep === 2) {
                prevStep = 1;
            }

            setCurrentStep(prevStep);
        } else if (onBack) {
            onBack();
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setGlobalError('');

        try {
            let currentUser = user;

            // Scenario 1: New User (Email/Pass flow) - Create Auth User first
            if (!currentUser) {
                const userCredential = await auth.createUserWithEmailAndPassword(formData.email, formData.password);
                currentUser = userCredential.user;
            }

            if (!currentUser) throw new Error('Could not create or find user.');

            let photoURL = formData.photoURL || currentUser.photoURL;

            // Upload photo if new file selected
            if (formData.photoFile) {
                const storageRef = ref(storage, `profile_pictures/${currentUser.uid}`);
                await uploadBytes(storageRef, formData.photoFile);
                photoURL = await getDownloadURL(storageRef);
            }

            // Save/Update user profile
            await db.collection('users').doc(currentUser.uid).set({
                uid: currentUser.uid,
                email: currentUser.email || formData.email,
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                phone: formData.phone.trim(),
                dob: formData.dob,
                gender: formData.gender,
                photoURL: photoURL,
                address: formData.address.trim(),
                city: formData.city.trim(),
                state: formData.state.trim(),
                country: formData.country.trim(),
                bio: formData.bio.trim(),
                interests: formData.interests.trim(),
                receiveEmails: formData.receiveEmails,
                profileComplete: true, // FLAG: Profile is now complete
                updatedAt: new Date().toISOString()
            }, { merge: true }); // Merge to preserve existing Google data

            if (onComplete) onComplete();
        } catch (err: any) {
            let errorMessage = 'An error occurred. Please try again.';
            if (err.code) {
                switch (err.code) {
                    case 'auth/email-already-in-use': errorMessage = 'This email is already registered.'; break;
                    case 'auth/invalid-email': errorMessage = 'Invalid email address.'; break;
                    case 'auth/weak-password': errorMessage = 'Password is too weak.'; break;
                    default: errorMessage = err.message;
                }
            }
            setGlobalError(errorMessage);
            // Go back to account step ONLY if it's an auth creation error (and implies we were trying to create a user)
            if (err.code?.startsWith('auth/') && !user) {
                setCurrentStep(2);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading spinner while Auth context is initializing
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <AnimatedBackground variant="subtle" />
                <Spinner size="lg" />
            </div>
        );
    }

    const currentStepData = STEPS.find(s => s.id === currentStep)!;
    const progress = (currentStep / STEPS.length) * 100;

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <AnimatedBackground variant="intense" />

            <div className="relative z-10 w-full max-w-lg">
                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        {STEPS.map((step) => (
                            <div
                                key={step.id}
                                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${step.id < currentStep
                                    ? 'bg-aurora-500 text-white'
                                    : step.id === currentStep
                                        ? 'bg-gradient-to-r from-aurora-500 to-rose-500 text-white shadow-lg'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                                    }`}
                            >
                                {step.id < currentStep ? (
                                    <Icon name="check" className="text-lg" />
                                ) : (
                                    <Icon name={step.icon} className="text-lg" />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-aurora-500 to-rose-500 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Card */}
                <GlassCard className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-gradient-to-br from-aurora-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Icon name={currentStepData.icon} className="text-white text-2xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {currentStepData.title}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                            {currentStepData.description}
                        </p>
                    </div>

                    {/* Step Content */}
                    <div className="min-h-[240px]">
                        {currentStep === 1 && <Step1PersonalInfo data={formData} updateData={updateData} errors={errors} />}
                        {currentStep === 2 && <Step2Account data={formData} updateData={updateData} errors={errors} />}
                        {currentStep === 3 && <Step3Profile data={formData} updateData={updateData} errors={errors} fileInputRef={fileInputRef} onPhotoSelect={handlePhotoSelect} />}
                        {currentStep === 4 && <Step4Location data={formData} updateData={updateData} errors={errors} />}
                        {currentStep === 5 && <Step5Interests data={formData} updateData={updateData} errors={errors} />}
                    </div>

                    {/* Global Error */}
                    {globalError && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-red-600 dark:text-red-400 text-sm mt-4">
                            <Icon name="error" className="text-lg flex-shrink-0" />
                            <p>{globalError}</p>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex gap-3 mt-8">
                        <button
                            onClick={handleBack}
                            disabled={isLoading}
                            className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                        >
                            <Icon name="arrow_back" />
                            {currentStep === 1 ? 'Login' : 'Back'}
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={isLoading}
                            className="flex-1 py-3 px-4 bg-gradient-to-r from-aurora-600 to-rose-600 hover:from-aurora-500 hover:to-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-aurora-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Spinner size="sm" />
                            ) : (
                                <>
                                    {currentStep === 5 ? 'Create Account' : 'Next'}
                                    <Icon name={currentStep === 5 ? 'check' : 'arrow_forward'} />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Step indicator */}
                    <p className="text-center text-xs text-slate-400 mt-4">
                        Step {currentStep} of {STEPS.length}
                    </p>
                </GlassCard>
            </div>
        </div>
    );
};
