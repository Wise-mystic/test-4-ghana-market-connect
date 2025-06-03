import https from 'https';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

class OTPService {
    constructor() {
        this.BASE_URL = 'sms.smsnotifygh.com';
        this.API_KEY = process.env.SMS_API_KEY; // Store in environment variables
        this.SENDER_ID = process.env.SMS_SENDER_ID; // Store in environment variables
        this.OTP_LENGTH = 6;
        this.OTP_VALIDITY_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
        
        // In production, use Redis or another database instead of Map
        this.otpStore = new Map();
    }

    async generateAndSendOTP(phoneNumber) {
        try {
            // Generate OTP
            const otp = this.generateOTP();
            
            // Create message
            const message = `Your OTP is: ${otp}. Valid for 5 minutes.`;
            
            // Send OTP via SMS
            const sendResult = await this.sendSMS(phoneNumber, message);
            
            if (sendResult.includes('successfully')) {
                // Store OTP if message sent successfully
                this.otpStore.set(phoneNumber, {
                    otp,
                    timestamp: Date.now()
                });
                return { success: true, message: 'OTP sent successfully' };
            } else {
                return { success: false, message: `Failed to send OTP: ${sendResult}` };
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            return { success: false, message: 'Failed to send OTP due to technical issues' };
        }
    }

    verifyOTP(phoneNumber, otp) {
        const otpData = this.otpStore.get(phoneNumber);
        
        if (!otpData) {
            return { success: false, message: 'No OTP found for this phone number' };
        }
        
        if (!this.isOTPValid(otpData.timestamp)) {
            this.otpStore.delete(phoneNumber);
            return { success: false, message: 'OTP has expired' };
        }
        
        const isValid = otpData.otp === otp;
        if (isValid) {
            this.otpStore.delete(phoneNumber); // Remove OTP after successful verification
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
            const encodedMessage = encodeURIComponent(message);
            const path = `/smsapi?key=${this.API_KEY}&to=${phoneNumber}&msg=${encodedMessage}&sender_id=${this.SENDER_ID}`;
            
            const options = {
                hostname: this.BASE_URL,
                path: path,
                method: 'GET'
            };

            const req = https.request(options, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    try {
                        const response = this.interpretResponse(data.trim());
                        resolve(response);
                    } catch (error) {
                        reject(error);
                    }
                });
            });
            
            req.on('error', (error) => {
                console.error('Error sending SMS:', error);
                reject(new Error('Failed to send SMS'));
            });
            
            req.end();
        });
    }

    isOTPValid(timestamp) {
        return (Date.now() - timestamp) < this.OTP_VALIDITY_DURATION;
    }

    interpretResponse(response) {
        switch (response) {
            case '1000':
                return 'Message sent successfully';
            case '1002':
                return 'Message not sent';
            case '1003':
                return 'Insufficient balance';
            case '1004':
                return 'Invalid API Key';
            case '1005':
                return 'Invalid phone number';
            case '1006':
                return 'Invalid Sender ID';
            case '1008':
                return 'Empty message';
            default:
                return `Unknown response: ${response}`;
        }
    }
}

export default OTPService; 