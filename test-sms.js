import axios from 'axios';

const API_KEY = '8640d244-dd4a-4637-8e8a-470bad1b151a';
const BASE_URL = 'https://sms.smsnotifygh.com';

async function testSMS() {
  try {
    // Test balance check
    console.log('Checking SMS balance...');
    const balanceResponse = await axios.get(`${BASE_URL}/api/smsapibalance`, {
      params: { key: API_KEY }
    });
    console.log('Balance Response:', balanceResponse.data);

    // Test sending SMS
    console.log('\nSending test SMS...');
    const phone = '233244123456'; // Replace with your test phone number
    const message = 'This is a test message from Market Connect';
    
    // Using the documented API endpoint
    const smsResponse = await axios.get(`${BASE_URL}/api/sms/send`, {
      params: {
        key: API_KEY,
        to: phone,
        msg: message,
        sender_id: 'MC'
      }
    });
    
    console.log('SMS Response:', smsResponse.data);
  } catch (error) {
    console.error('Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
}

testSMS(); 