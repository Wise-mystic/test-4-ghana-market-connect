import https from 'https';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

class OTPService {
    constructor() {
        this.BASE_URL = 'sms.smsnotifygh.com';
        this.API_KEY = process.env.SMS_API_KEY;
        this.SENDER_ID = process.env.SMS_SENDER_ID;
        this.OTP_LENGTH = 6;
        this.OTP_VALIDITY_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
        
        // Validate required environment variables
        if (!this.API_KEY || !this.SENDER_ID) {
            console.error('Missing required environment variables:');
            if (!this.API_KEY) console.error('- SMS_API_KEY is not set');
            if (!this.SENDER_ID) console.error('- SMS_SENDER_ID is not set');
            console.error('Please set these variables in your .env file');
        }
        
        // In production, use Redis or another database instead of Map
        this.otpStore = new Map();
    }

    async generateAndSendOTP(phoneNumber) {
        try {
            // Check if environment variables are set
            if (!this.API_KEY || !this.SENDER_ID) {
                return {
                    success: false,
                    message: 'SMS service is not properly configured. Please check your environment variables.'
                };
            }

            // Generate OTP
            const otp = this.generateOTP();
            console.log(`Generated OTP for ${phoneNumber}: ${otp}`);
            
            // Create message
            const message = `Your OTP is: ${otp}. Valid for 5 minutes.`;
            
            // Send OTP via SMS
            console.log(`Attempting to send SMS to ${phoneNumber}`);
            const sendResult = await this.sendSMS(phoneNumber, message);
            console.log('SMS send result:', sendResult);
            
            if (sendResult.success) {
                // Store OTP if message sent successfully
                this.otpStore.set(phoneNumber, {
                    otp,
                    timestamp: Date.now()
                });
                console.log(`OTP stored for ${phoneNumber}`);
                return { success: true, message: 'OTP sent successfully' };
            } else {
                console.error('Failed to send SMS:', sendResult);
                return { success: false, message: `Failed to send OTP: ${sendResult.message}` };
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            return { success: false, message: 'Failed to send OTP due to technical issues' };
        }
    }

    verifyOTP(phoneNumber, otp) {
        console.log(`Verifying OTP for ${phoneNumber}`);
        console.log('Current OTP store:', Array.from(this.otpStore.entries()));
        
        const otpData = this.otpStore.get(phoneNumber);
        
        if (!otpData) {
            console.log(`No OTP found for ${phoneNumber}`);
            return { success: false, message: 'No OTP found for this phone number' };
        }
        
        if (!this.isOTPValid(otpData.timestamp)) {
            console.log(`OTP expired for ${phoneNumber}`);
            this.otpStore.delete(phoneNumber);
            return { success: false, message: 'OTP has expired' };
        }
        
        const isValid = otpData.otp === otp;
        console.log(`OTP validation result for ${phoneNumber}: ${isValid ? 'valid' : 'invalid'}`);
        
        if (isValid) {
            this.otpStore.delete(phoneNumber); // Remove OTP after successful verification
            console.log(`OTP removed for ${phoneNumber} after successful verification`);
        }
        
        return {
            success: isValid,
            message: isValid ? 'OTP verified successfully' : 'Invalid OTP'
        };
    }

    generateOTP() {
        // Generate a secure random number
        const randomBytes = crypto.randomBytes(3); // 3 bytes = 6 digits
        const otp = parseInt(randomBytes.toString('hex'), 16) % 1000000;
        return otp.toString().padStart(6, '0');
    }

    sendSMS(phoneNumber, message) {
        return new Promise((resolve, reject) => {
            try {
                // Properly encode all URL parameters
                const params = new URLSearchParams({
                    key: this.API_KEY,
                    to: phoneNumber,
                    msg: message,
                    sender_id: this.SENDER_ID
                });

                const options = {
                    hostname: this.BASE_URL,
                    path: `/smsapi?${params.toString()}`,
                    method: 'GET'
                };

                console.log('Sending SMS with options:', {
                    hostname: options.hostname,
                    path: options.path,
                    method: options.method
                });

                const req = https.request(options, (res) => {
                    let data = '';
                    
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    
                    res.on('end', () => {
                        try {
                            console.log('Raw SMS API response:', data);
                            const response = JSON.parse(data.trim());
                            console.log('Parsed SMS API response:', response);
                            resolve(response);
                        } catch (error) {
                            console.error('Error parsing response:', error);
                            reject(new Error('Failed to parse SMS response'));
                        }
                    });
                });
                
                req.on('error', (error) => {
                    console.error('Error sending SMS:', error);
                    reject(new Error('Failed to send SMS'));
                });
                
                req.end();
            } catch (error) {
                console.error('Error in sendSMS:', error);
                reject(error);
            }
        });
    }

    isOTPValid(timestamp) {
        const isValid = (Date.now() - timestamp) < this.OTP_VALIDITY_DURATION;
        console.log(`OTP timestamp: ${timestamp}, Current time: ${Date.now()}, Valid: ${isValid}`);
        return isValid;
    }
}

export default OTPService; 