const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Permission = require('../models/Permission');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedPermissions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const newPermissions = [
      {
        permission_name: 'Delivery Agent List',
        page_url: '/delivery-agents',
        group: 'Delivery'
      },
      {
        permission_name: 'Delivery Agent Add',
        page_url: '/delivery-agents', // Modal based, so same page
        group: 'Delivery'
      }
    ];

    for (const p of newPermissions) {
      const exists = await Permission.findOne({ permission_name: p.permission_name });
      if (!exists) {
        await Permission.create(p);
        console.log(`Permission added: ${p.permission_name}`);
      } else {
        console.log(`Permission already exists: ${p.permission_name}`);
      }
    }

    console.log('Seeding completed');
    process.exit();
  } catch (err) {
    console.error('Error seeding permissions:', err);
    process.exit(1);
  }
};

seedPermissions();
