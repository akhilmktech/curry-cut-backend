const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const DeliveryAgent = require('./models/DeliveryAgent');

async function checkAgents() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const agents = await DeliveryAgent.find({}, 'name email avatar');
        console.log('Current Delivery Agents in DB:');
        console.log(JSON.stringify(agents, null, 2));
        await mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkAgents();
