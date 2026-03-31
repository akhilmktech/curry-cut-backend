const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const Permission = require('../models/Permission');
const Role = require('../models/Role');

const testPermissionNames = [
  'Test',
  'test permission',
  'test permission 2',
  'test permission 3',
  'test permission 4',
  'dd'
];

async function removeTestPermissions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find the permissions to delete
    const permsToDelete = await Permission.find({
      permission_name: { $in: testPermissionNames },
    });

    if (permsToDelete.length === 0) {
      console.log('No test permissions found. Nothing to remove.');
      process.exit(0);
    }

    const permIds = permsToDelete.map((p) => p._id);
    console.log(`Found ${permIds.length} test permissions to remove.`);

    // Pull these permission IDs from all roles
    const roleUpdateResult = await Role.updateMany(
      { permissions: { $in: permIds } },
      { $pull: { permissions: { $in: permIds } } }
    );
    console.log(`Updated ${roleUpdateResult.modifiedCount} role(s) — removed test permissions.`);

    // Delete the permissions
    const deleteResult = await Permission.deleteMany({
      _id: { $in: permIds },
    });
    console.log(`Deleted ${deleteResult.deletedCount} test permission(s) from DB.`);

    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

removeTestPermissions();
