// In-memory storage for OTPs (replace with Redis/database in production)
const otpStore = new Map();

// OTP configuration
const OTP_CONFIG = {
  length: 6,
  expiryMinutes: 10,
  maxAttempts: 3
};

/**
 * Generate a random OTP
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < OTP_CONFIG.length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

/**
 * Store OTP with metadata
 * @param {string} phone - Phone number
 * @param {string} otp - Generated OTP
 */
const storeOTP = (phone, otp) => {
  const expiryTime = Date.now() + (OTP_CONFIG.expiryMinutes * 60 * 1000);
  otpStore.set(phone, {
    otp,
    expiryTime,
    attempts: 0,
    verified: false
  });
};

/**
 * Verify OTP
 * @param {string} phone - Phone number
 * @param {string} otp - OTP to verify
 * @returns {boolean} Whether OTP is valid
 */
const verifyOTP = (phone, otp) => {
  const storedData = otpStore.get(phone);
  
  if (!storedData) {
    console.log(`No OTP found for phone: ${phone}`);
    return false;
  }

  if (storedData.verified) {
    console.log(`OTP already verified for phone: ${phone}`);
    return false;
  }

  if (storedData.attempts >= OTP_CONFIG.maxAttempts) {
    console.log(`Max attempts reached for phone: ${phone}`);
    otpStore.delete(phone);
    return false;
  }

  if (Date.now() > storedData.expiryTime) {
    console.log(`OTP expired for phone: ${phone}`);
    otpStore.delete(phone);
    return false;
  }

  storedData.attempts++;
  
  if (storedData.otp === otp) {
    storedData.verified = true;
    console.log(`OTP verified successfully for phone: ${phone}`);
    return true;
  }

  console.log(`Invalid OTP attempt for phone: ${phone}. Attempts: ${storedData.attempts}`);
  return false;
};

/**
 * Request new OTP
 * @param {string} phone - Phone number
 * @returns {string} Generated OTP
 */
export const requestOTP = (phone) => {
  // Clear any existing OTP for this phone
  otpStore.delete(phone);
  
  // Generate new OTP
  const otp = generateOTP();
  
  // Store OTP with metadata
  storeOTP(phone, otp);
  
  // In development, log the OTP
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEVELOPMENT MODE] OTP for ${phone}: ${otp}`);
  }
  
  return otp;
};

/**
 * Verify OTP
 * @param {string} phone - Phone number
 * @param {string} otp - OTP to verify
 * @returns {boolean} Whether OTP is valid
 */
export const verifyOTPCode = (phone, otp) => {
  return verifyOTP(phone, otp);
};

/**
 * Check if OTP exists and is valid
 * @param {string} phone - Phone number
 * @returns {boolean} Whether OTP exists and is valid
 */
export const hasValidOTP = (phone) => {
  const storedData = otpStore.get(phone);
  return storedData && !storedData.verified && Date.now() <= storedData.expiryTime;
};

/**
 * Clear OTP for a phone number
 * @param {string} phone - Phone number
 */
export const clearOTP = (phone) => {
  otpStore.delete(phone);
}; 