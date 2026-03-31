const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
dotenv.config({ path: path.join(__dirname, '.env') });
const sendNotification = require('./utils/sendNotification');
const DeliveryAgent = require('./models/DeliveryAgent');

async function testOneSignalWithRealId() {
  const registeredId = "69bcd84b3da542e8a0d37e3c";
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const agent = await DeliveryAgent.findById(registeredId);
    
    console.log("--- DB Lookup ---");
    if (agent) {
        console.log(`Found Agent in DB with this ID: ${agent.name} (${agent.email})`);
    } else {
        console.log(`WARNING: No agent found in DB with ID ${registeredId}`);
    }

    console.log("\n--- Sending Notification ---");
    const response = await sendNotification(
      registeredId,
      "Test Push Success! 🎉",
      "This is a live test notification from the Currys Cut Admin Backend.",
      { test: true }
    );
    
    fs.writeFileSync('test_real_result.json', JSON.stringify({
        success: true,
        response: response
    }, null, 2));
    
  } catch (err) {
    fs.writeFileSync('test_real_result.json', JSON.stringify({
        success: false,
        error: err.message
    }, null, 2));
  } finally {
      process.exit();
  }
}

testOneSignalWithRealId();
