const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
dotenv.config({ path: path.join(__dirname, '.env') });
const sendNotification = require('./utils/sendNotification');

async function testOneSignal() {
  const dummyAgentId = "TEST_AGENT_ID_123";
  try {
    const response = await sendNotification(
      dummyAgentId,
      "Test Notification",
      "This is a test message to verify the API connection.",
      { test: true }
    );
    
    fs.writeFileSync('test_result.json', JSON.stringify({
        success: true,
        response: response
    }, null, 2));
  } catch (err) {
    fs.writeFileSync('test_result.json', JSON.stringify({
        success: false,
        error: err.message
    }, null, 2));
  }
}

testOneSignal();
