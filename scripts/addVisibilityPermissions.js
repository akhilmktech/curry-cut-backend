const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
const Permission = require('../models/Permission');

const visibilityPermissions = [
  { permission_name: 'View Dashboard Section', page_url: '/dashboard', group: 'Sidebar Visibility' },
  { permission_name: 'View Orders Section', page_url: '/orders', group: 'Sidebar Visibility' },
  { permission_name: 'View Users Section', page_url: '/users', group: 'Sidebar Visibility' },
  { permission_name: 'View Delivery Agents Section', page_url: '/delivery-agents', group: 'Sidebar Visibility' },
  { permission_name: 'View Roles Section', page_url: '/roles', group: 'Sidebar Visibility' },
  { permission_name: 'View Products Section', page_url: '/products', group: 'Sidebar Visibility' }
];

async function seedVisibilityPermissions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    for (const p of visibilityPermissions) {
      const exists = await Permission.findOne({ permission_name: p.permission_name });
      if (!exists) {
        await Permission.create(p);
        console.log(`Permission added: ${p.permission_name}`);
      } else {
        console.log(`Permission already exists: ${p.permission_name}`);
      }
    }

    console.log('Seeding visibility permissions completed');
    process.exit();
  } catch (err) {
    console.error('Error seeding permissions:', err);
    process.exit(1);
  }
}

seedVisibilityPermissions();
