const axios = require('axios');

async function testStatusUpdate() {
   const BASE_URL = 'http://localhost:3002/api/V1';
   try {
      console.log("1. Logging in...");
      const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
         email: "currycutadmin@mail.com",
         password: "currycut@123"
      });
      const token = loginRes.data.accessToken;
      const userId = loginRes.data._id;
      console.log(`Success! User ID: ${userId}`);

      console.log("2. Fetching orders...");
      const ordersRes = await axios.get(`${BASE_URL}/orders?limit=20`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      const unassignedOrder = ordersRes.data.data.find(o => !o.assigned_agent);
      
      if (!unassignedOrder) {
         console.log("No unassigned order found to test.");
         return;
      }
      console.log(`Found unassigned order: ${unassignedOrder.order_id}`);

      console.log("3. Marking as Pickup...");
      await axios.post(`${BASE_URL}/orders/pickup`, 
         { order_id: unassignedOrder.order_id },
         { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Success! Status updated.");

      console.log("4. Verifying assignment...");
      const detailRes = await axios.get(`${BASE_URL}/orders/all/${unassignedOrder._id}`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      const updatedOrder = detailRes.data.data;
      
      console.log("--- RESULTS ---");
      console.log(`Order ID: ${updatedOrder.order_id}`);
      console.log(`Status: ${updatedOrder.fulfillment_status}`);
      console.log(`Modified By: ${updatedOrder.modified_by}`);
      console.log(`Assigned Agent (ID): ${updatedOrder.assigned_agent._id || updatedOrder.assigned_agent}`);
      console.log(`Agent Type: ${updatedOrder.agent_type}`);
      
      if (updatedOrder.modified_by === userId && (updatedOrder.assigned_agent._id === userId || updatedOrder.assigned_agent === userId)) {
         console.log("✅ TEST PASSED: Modification tracked and Agent auto-assigned successfully.");
      } else {
         console.log("❌ TEST FAILED: Discrepancy in modification or assignment tracking.");
      }

   } catch (err) {
      console.error("Test failed:", err.response?.data || err.message);
   }
}

testStatusUpdate();
