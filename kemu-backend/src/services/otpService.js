// OTP Service for email and SMS verification

// Generate a 6-digit OTP
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Calculate OTP expiry (10 minutes from now)
export const getOTPExpiry = () => {
    return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
};

// Send OTP via Email (stub - logs to console)
export const sendOTPEmail = async (email, otp) => {
    console.log('========================================');
    console.log(`📧 EMAIL OTP Sent to: ${email}`);
    console.log(`   OTP Code: ${otp}`);
    console.log('========================================');

    // TODO: Integrate with Nodemailer for real email sending
    // Example with Nodemailer:
    // const transporter = nodemailer.createTransport({ ... });
    // await transporter.sendMail({
    //   from: '"KeMU Admissions" <admissions@kemu.ac.ke>',
    //   to: email,
    //   subject: 'Your KeMU Registration Code',
    //   html: `
    //     <h2>KeMU Registration Verification</h2>
    //     <p>Your verification code is: <strong>${otp}</strong></p>
    //     <p>This code expires in 10 minutes.</p>
    //   `
    // });

    return { success: true, message: 'OTP sent to email' };
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
