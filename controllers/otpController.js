import OTPService from '../services/otpService.js';

const otpService = new OTPService();

export const sendOTP = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required'
            });
        }

        const result = await otpService.generateAndSendOTP(phoneNumber);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Error in sendOTP:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;

        if (!phoneNumber || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Phone number and OTP are required'
            });
        }

        const result = otpService.verifyOTP(phoneNumber, otp);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Error in verifyOTP:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}; 