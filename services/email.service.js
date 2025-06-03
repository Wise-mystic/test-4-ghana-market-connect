import axios from 'axios';

const SMS_CONFIG = {
  API_KEY: process.env.SMS_NOTIFY_API_KEY,
  BASE_URL: 'https://sms.smsnotifygh.com'
};

const formatPhoneNumber = (phone) => {
  // Remove any non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If it's a Ghana number (233XXXXXXXXX)
  if (digits.startsWith('233') && digits.length === 12) {
    return digits;
  }
  
  // If it's a Ghana number without country code (0XXXXXXXXX)
  if (digits.startsWith('0') && digits.length === 10) {
    return `233${digits.substring(1)}`;
  }
  
  return digits;
};

const checkBalance = async () => {
  try {
    const response = await axios.get(`${SMS_CONFIG.BASE_URL}/api/smsapibalance`, {
      params: { key: SMS_CONFIG.API_KEY }
    });
    console.log('SMS Balance Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error checking SMS balance:', error.response?.data || error.message);
    return null;
  }
};

export const sendVerificationSMS = async (phone, token) => {
  try {
    if (!SMS_CONFIG.API_KEY) {
      throw new Error('SMS API key is not configured');
    }

    const formattedPhone = formatPhoneNumber(phone);
    
    console.log('Attempting to send verification SMS:', {
      originalPhone: phone,
      formattedPhone,
      tokenLength: token.length
    });

    const message = `Your verification code is: ${token}. This code will expire in 24 hours.`;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEVELOPMENT MODE] Verification code for ${formattedPhone}: ${token}`);
      return true;
    }

    const response = await axios.post(`${SMS_CONFIG.BASE_URL}/api/sms/send`, {
      key: SMS_CONFIG.API_KEY,
      to: formattedPhone,
      msg: message,
      sender_id: 'MC'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = response.data;
    console.log('SMS API Response:', result);

    if (result.success) {
      console.log('SMS sent successfully');
      return true;
    } else {
      throw new Error(result.message || 'Failed to send SMS');
    }
  } catch (error) {
    console.error('Error sending verification SMS:', {
      error: error.message,
      response: error.response?.data,
      phone,
      formattedPhone: formatPhoneNumber(phone)
    });
    throw error;
  }
};

export const sendPinResetSMS = async (phone, token) => {
  try {
    if (!SMS_CONFIG.API_KEY) {
      throw new Error('SMS API key is not configured');
    }

    const formattedPhone = formatPhoneNumber(phone);
    
    console.log('Attempting to send PIN reset SMS:', {
      originalPhone: phone,
      formattedPhone,
      tokenLength: token.length
    });

    const message = `Your PIN reset code is: ${token}. This code will expire in 1 hour.`;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEVELOPMENT MODE] PIN reset code for ${formattedPhone}: ${token}`);
      return true;
    }

    const response = await axios.post(`${SMS_CONFIG.BASE_URL}/api/sms/send`, {
      key: SMS_CONFIG.API_KEY,
      to: formattedPhone,
      msg: message,
      sender_id: 'MC'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = response.data;
    console.log('SMS API Response:', result);

    if (result.success) {
      console.log('SMS sent successfully');
      return true;
    } else {
      throw new Error(result.message || 'Failed to send SMS');
    }
  } catch (error) {
    console.error('Error sending PIN reset SMS:', {
      error: error.message,
      response: error.response?.data,
      phone,
      formattedPhone: formatPhoneNumber(phone)
    });
    throw error;
  }
}; 