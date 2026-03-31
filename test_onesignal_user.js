const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');
dotenv.config({ path: path.join(__dirname, '.env') });
const DeliveryAgent = require('./models/DeliveryAgent');

async function checkAgent() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find the delivery agent the user just tested with
    const agent = await DeliveryAgent.findOne({ name: /roshin/i });
    if (!agent) {
      console.log('Agent Roshin Davis not found in database.');
      process.exit(1);
    }

    const externalId = agent._id.toString();
    console.log(`\nFound Agent: ${agent.name} | External_ID: ${externalId}`);
    
    console.log('\nChecking OneSignal to see if this External_ID has a device registered from the mobile app...');
    // Ask OneSignal if this external ID actually has a registered device
    const onesignalUrl = `https://onesignal.com/api/v1/apps/${process.env.ONESIGNAL_APP_ID}/users/by/external_id/${externalId}`;
    
    const response = await axios.get(onesignalUrl, {
      headers: {
        Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
      }
    });

    console.log('\n--- OneSignal API Response ---');
    console.log(JSON.stringify(response.data, null, 2));
    
    const hasPushDevice = response.data.subscriptions?.some(sub => sub.type === 'Android' || sub.type === 'iOS');
    if (hasPushDevice) {
        console.log('\n✅ OneSignal confirms this user HAS a registered phone.');
    } else {
        console.log('\n❌ OneSignal confirms this user DOES NOT have a push-enabled device registered.');
    }

  } catch (err) {
    console.log('\n--- OneSignal API Error ---');
    if (err.response && err.response.status === 404) {
      console.log(`❌ ERROR 404: OneSignal could not find any user with external_id "${externalId}".`);
      console.log('This strictly means the mobile app has NOT called OneSignal.login(...) with this agent ID yet.');
    } else {
      console.log(err.response ? err.response.data : err.message);
    }
  } finally {
    process.exit(0);
  }
}

checkAgent();
