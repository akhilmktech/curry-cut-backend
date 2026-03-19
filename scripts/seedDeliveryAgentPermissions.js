/**
 * Run this script to seed Delivery Agent permissions into the database.
 * Usage: node backend/scripts/seedDeliveryAgentPermissions.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Permission = require('../models/Permission');

const deliveryAgentPermissions = [
  {
    permission_name: 'Delivery Agent List',
    page_url: '/delivery-agents',
    group: 'Delivery Agent',
  },
  {
    permission_name: 'Delivery Agent Add',
    page_url: '/create-delivery-agent',
    group: 'Delivery Agent',
  },
  {
    permission_name: 'Delivery Agent Edit',
    page_url: '/create-delivery-agent',
    group: 'Delivery Agent',
  },
  {
    permission_name: 'Delivery Agent Delete',
    page_url: '/delivery-agents',
    group: 'Delivery Agent',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.DB_URI || process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const perm of deliveryAgentPermissions) {
      const existing = await Permission.findOne({ permission_name: perm.permission_name });
      if (existing) {
        console.log(`✓ Already exists: ${perm.permission_name}`);
      } else {
        await Permission.create(perm);
        console.log(`✅ Created: ${perm.permission_name}`);
      }
    }

    console.log('\nDone! Now go to Admin → Roles and assign these permissions to the Admin role.');
  } catch (err) {
    console.error('Error seeding permissions:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
