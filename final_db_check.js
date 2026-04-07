const mongoose = require('mongoose');
require('dotenv').config();

async function checkDatabase() {
   try {
      console.log("Connecting to DB...");
      await mongoose.connect(process.env.MONGODB_URI);
      
      const Order = require('./models/Order');
      
      console.log("Fetching last 5 modified orders...");
      const orders = await Order.find()
         .sort({ updatedAt: -1 })
         .limit(5)
         .populate('assigned_agent')
         .lean();

      if (orders.length === 0) {
         console.log("No orders found.");
         return;
      }

      orders.forEach(o => {
         console.log("-------------------");
         console.log(`Order ID: ${o.order_id}`);
         console.log(`Financial Status: ${o.financial_status}`);
         console.log(`Fulfillment Status: ${o.fulfillment_status}`);
         console.log(`Modified By: ${o.modified_by}`);
         console.log(`Assigned Agent: ${o.assigned_agent ? o.assigned_agent.name || o.assigned_agent._id : 'None'}`);
         console.log(`Agent Collection: ${o.agent_type}`);
         console.log(`Updated At: ${o.updatedAt}`);
      });

      process.exit(0);
   } catch (err) {
      console.error(err);
      process.exit(1);
   }
}

checkDatabase();
