
import type React from 'react';
import type { Timestamp } from 'firebase/firestore';

export interface ChatMessage {
  id?: string; // for key
  role: 'user' | 'model';
  parts: { text: string }[];
  timestamp?: Timestamp;
  groundingLinks?: any[];
}

export interface Page {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<any>;
  hidden?: boolean;
}

export interface Trip {
  id: string;
  userId: string;
  startingPoint: string;
  destination: string;
  duration: string;
  budget: string;
  interests: string;
  itinerary: string;
  packingList?: string;
  budgetBreakdown?: string;
  createdAt: Timestamp;
}

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  bio: string;
  interests: string;
  receiveEmails: boolean;
  photoURL: string | null;
  profileComplete: boolean;
  tosAccepted?: boolean;
  tosAcceptedAt?: string;
  // Security features
  phoneForRecovery?: string;
  twoFactorEnabled?: boolean;
  twoFactorMethod?: 'email' | 'phone';
  twoFactorVerifiedDevices?: string[];
  lastPasswordChange?: string;
  lastEmailChange?: string;
}

export interface Activity {
  id: string;
  userId: string;
  type: 'trip-planner' | 'text-playground' | 'image-generation' | 'image-analysis' | 'image-editor' | 'code-assistant';
  createdAt: Timestamp;
  data: {
    // Common fields
    prompt?: string;
    resultText?: string;

    // Image related fields
    inputImageUrl?: string;
    outputImageUrl?: string;
    generationMode?: 'quality' | 'realistic';

    // Trip planner specific
    destination?: string;
    duration?: string;

    // Code assistant specific
    language?: string;

    // Email writer specific
    emailTo?: string;
    emailSubject?: string;
    emailTone?: string;

    [key: string]: any; // for other form fields
  };
}