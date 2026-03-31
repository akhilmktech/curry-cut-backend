const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
const DeliveryAgent = require('./models/DeliveryAgent');

async function checkIds() {
  await mongoose.connect(process.env.MONGO_URI);
  
  // Look up ALL agents named Roshin
  const roshins = await DeliveryAgent.find({ name: /roshin/i });
  console.log("--- Agents Named Roshin ---");
  roshins.forEach(r => console.log(`Name: ${r.name} | ID: ${r._id.toString()}`));
  
  // Look up who exactly owns the 69bcd84b3da542e8a0d37e3c ID
  const registeredIdOwner = await DeliveryAgent.findById("69bcd84b3da542e8a0d37e3c");
  console.log("\n--- Who owns 69bcd84b3da542e8a0d37e3c ? ---");
  if (registeredIdOwner) {
      console.log(`Name: ${registeredIdOwner.name} | ID: ${registeredIdOwner._id.toString()}`);
  } else {
      console.log(`No agent found in DB with ID 69bcd84b3da542e8a0d37e3c`);
  }
  
  process.exit(0);
}

checkIds();
