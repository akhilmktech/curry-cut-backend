const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
const Permission = require('../models/Permission');
const Role = require('../models/Role');

async function assignVisibilityToAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminRole = await Role.findOne({ role_name: /admin/i });
    if (!adminRole) {
      console.log('Admin role not found');
      process.exit(1);
    }

    const visibilityPerms = await Permission.find({ group: 'Sidebar Visibility' });
    const visibilityIds = visibilityPerms.map(p => p._id);

    // Add new IDs to existing permissions, avoiding duplicates
    const currentPerms = adminRole.permissions.map(id => id.toString());
    let added = 0;
    for (const id of visibilityIds) {
      if (!currentPerms.includes(id.toString())) {
        adminRole.permissions.push(id);
        added++;
      }
    }

    if (added > 0) {
      await adminRole.save();
      console.log(`Added ${added} visibility permissions to Admin role`);
    } else {
      console.log('Admin role already has all visibility permissions');
    }

    process.exit();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

assignVisibilityToAdmin();
