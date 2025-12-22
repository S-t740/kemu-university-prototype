// OTP Service for email and SMS verification
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Resend client
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Generate a 6-digit OTP
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Calculate OTP expiry (10 minutes from now)
export const getOTPExpiry = () => {
    return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
};

// Send OTP via Email using Resend
export const sendOTPEmail = async (email, otp) => {
    console.log('========================================');
    console.log(`📧 EMAIL OTP Sent to: ${email}`);
    console.log(`   OTP Code: ${otp}`);
    console.log('========================================');

    // If Resend is not configured, just log (development mode)
    if (!resend) {
        console.log('⚠️  Resend not configured - email logged to console only');
        return { success: true, message: 'OTP sent to email (dev mode)' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'KeMU Admissions <onboarding@resend.dev>',
            to: email,
            subject: 'Your KeMU Registration Verification Code',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                        <div style="background: linear-gradient(135deg, #4a0072 0%, #1a237e 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 24px;">Kenya Methodist University</h1>
                            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 14px;">Admissions Portal</p>
                        </div>
                        <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                            <h2 style="color: #333; margin: 0 0 20px; font-size: 20px;">Verification Code</h2>
                            <p style="color: #666; line-height: 1.6; margin: 0 0 30px;">
                                Please use the following code to verify your email address and complete your registration:
                            </p>
                            <div style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); border-radius: 8px; padding: 25px; text-align: center; margin: 0 0 30px;">
                                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4a0072;">${otp}</span>
                            </div>
                            <p style="color: #999; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
                                ⏰ This code will expire in <strong>10 minutes</strong>.
                            </p>
                            <p style="color: #999; font-size: 13px; line-height: 1.6; margin: 0;">
                                If you did not request this code, please ignore this email.
                            </p>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                            <p style="color: #aaa; font-size: 12px; text-align: center; margin: 0;">
                                © ${new Date().getFullYear()} Kenya Methodist University. All rights reserved.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `
        });

        if (error) {
            console.error('Resend error:', error);
            return { success: false, message: 'Failed to send verification email', error: error.message };
        }

        console.log('✅ Email sent successfully via Resend:', data?.id);
        return { success: true, message: 'OTP sent to email', emailId: data?.id };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, message: 'Failed to send verification email', error: error.message };
    }
};

// Send OTP via SMS (stub - logs to console)
export const sendOTPSMS = async (phoneCode, phone, otp) => {
    const fullPhone = `${phoneCode}${phone}`;

    console.log('========================================');
    console.log(`📱 SMS OTP Sent to: ${fullPhone}`);
    console.log(`   OTP Code: ${otp}`);
    console.log('========================================');

    // TODO: Integrate with SMS provider (AfricasTalking, Twilio, etc.)
    // Example with AfricasTalking:
    // const africastalking = require('africastalking')({ ... });
    // await africastalking.SMS.send({
    //   to: [fullPhone],
    //   message: `Your KeMU registration code is: ${otp}. Valid for 10 minutes.`
    // });

    return { success: true, message: 'OTP sent to phone' };
};

// Verify OTP
export const verifyOTP = (storedOTP, providedOTP, expiry) => {
    if (!storedOTP || !expiry) {
        return { valid: false, error: 'No OTP found. Please request a new code.' };
    }

    if (new Date() > new Date(expiry)) {
        return { valid: false, error: 'OTP has expired. Please request a new code.' };
    }

    if (storedOTP !== providedOTP) {
        return { valid: false, error: 'Invalid OTP. Please check and try again.' };
    }

    return { valid: true };
};

export default {
    generateOTP,
    getOTPExpiry,
    sendOTPEmail,
    sendOTPSMS,
    verifyOTP
};
