import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    user?: {
        uid: string;
        email?: string;
        emailVerified?: boolean;
    };
}

export interface TextGenerationRequest {
    prompt: string;
    systemInstruction?: string;
    model?: string;
}

export interface ImageGenerationRequest {
    prompt: string;
    mode?: string;
}

export interface ImageAnalysisRequest {
    imageData: string;
    mimeType: string;
    prompt?: string;
}

export interface ImageEditRequest {
    imageData: string;
    mimeType: string;
    editPrompt: string;
}

export interface CodeRequest {
    code: string;
    mode: 'debug' | 'explain' | 'optimize' | 'generate';
    language: string;
}

export interface TripRequest {
    form: {
        startingPoint: string;
        destination: string;
        duration: string;
        budget: string;
        interests: string;
    };
    options: {
        dining?: boolean;
        transport?: boolean;
        alternatives?: boolean;
        proTips?: boolean;
    };
}

export interface TripExtraRequest {
    type: 'packing' | 'budget';
    tripInfo: {
        destination: string;
        duration: string;
        interests: string;
        budget?: string;
    };
}

export interface TwoFactorSendRequest {
    email: string;
}

export interface TwoFactorVerifyRequest {
    email: string;
    code: string;
    deviceFingerprint: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}
