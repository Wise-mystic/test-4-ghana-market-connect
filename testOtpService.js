import OTPService from './otpService.js';

// Create an instance of OTPService
const otpService = new OTPService();

// Test phone number (replace with your test number)
const TEST_PHONE_NUMBER = '02xxxxxxxx'; // Replace with your test phone number

async function runTests() {
    console.log('Starting OTP Service Tests...\n');

    try {
        // Test 1: Generate and Send OTP
        console.log('Test 1: Sending OTP...');
        const sendResult = await otpService.generateAndSendOTP(TEST_PHONE_NUMBER);
        console.log('Send Result:', sendResult);
        console.log('Test 1 completed.\n');

        // Test 2: Verify OTP (using a dummy OTP)
        console.log('Test 2: Verifying OTP...');
        const verifyResult = otpService.verifyOTP(TEST_PHONE_NUMBER, '123456');
        console.log('Verify Result:', verifyResult);
        console.log('Test 2 completed.\n');

        // Test 3: Generate OTP (direct method test)
        console.log('Test 3: Generating OTP...');
        const generatedOTP = otpService.generateOTP();
        console.log('Generated OTP:', generatedOTP);
        console.log('Test 3 completed.\n');

    } catch (error) {
        console.error('Test failed with error:', error);
    }
}

// Run the tests
runTests(); 