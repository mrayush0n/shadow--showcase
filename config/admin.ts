// Admin Configuration
// Add admin emails here to grant full access to all features (bypass Coming Soon)

export const ADMIN_EMAILS = [
    'admin@shadowshowcase.com',
    'admin@shadowsi.com',
    // Add more admin emails as needed
];

// Check if an email is an admin
export const isAdminEmail = (email: string | null | undefined): boolean => {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase());
};
