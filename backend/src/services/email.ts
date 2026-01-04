import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('⚠️ Email service not configured. 2FA emails will not be sent.');
        return null;
    }

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

/**
 * Send a 2FA verification code via email
 */
export const send2FACode = async (
    email: string,
    code: string
): Promise<boolean> => {
    const transporter = createTransporter();

    if (!transporter) {
        console.log(`[DEV MODE] 2FA code for ${email}: ${code}`);
        return true;
    }

    try {
        await transporter.sendMail({
            from: `"Shadow Showcase" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Your Shadow Showcase Verification Code',
            html: `
        <div style="font-family: system-ui, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 16px; text-align: center;">
            <h1 style="color: white; margin: 0 0 10px;">Shadow Showcase</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 0;">Two-Factor Authentication</p>
          </div>
          <div style="padding: 30px; text-align: center;">
            <p style="color: #666; margin-bottom: 20px;">Your verification code is:</p>
            <div style="background: #f5f5f5; border-radius: 12px; padding: 20px; font-size: 32px; font-weight: bold; letter-spacing: 8px; font-family: monospace;">
              ${code}
            </div>
            <p style="color: #999; margin-top: 20px; font-size: 14px;">This code expires in 10 minutes.</p>
          </div>
        </div>
      `,
        });

        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
    email: string,
    resetLink: string
): Promise<boolean> => {
    const transporter = createTransporter();

    if (!transporter) {
        console.log(`[DEV MODE] Password reset link for ${email}: ${resetLink}`);
        return true;
    }

    try {
        await transporter.sendMail({
            from: `"Shadow Showcase" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Reset Your Shadow Showcase Password',
            html: `
        <div style="font-family: system-ui, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 16px; text-align: center;">
            <h1 style="color: white; margin: 0;">Password Reset</h1>
          </div>
          <div style="padding: 30px; text-align: center;">
            <p style="color: #666; margin-bottom: 20px;">Click the button below to reset your password:</p>
            <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Reset Password
            </a>
            <p style="color: #999; margin-top: 20px; font-size: 14px;">This link expires in 1 hour.</p>
          </div>
        </div>
      `,
        });

        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
};
