const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
const Permission = require('./models/Permission');

async function consolidatePermissions() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Update all "Delivery" group permissions to "Delivery Agent"
        const updateResult = await Permission.updateMany(
            { group: 'Delivery' },
            { $set: { group: 'Delivery Agent' } }
        );
        console.log(`Updated ${updateResult.modifiedCount} permissions from 'Delivery' -> 'Delivery Agent'`);

        // 2. Remove redundant "Delivery Agent Edit" if it exists (since "Delivery Agent Update" is used)
        const deleteResult = await Permission.deleteOne({ permission_name: 'Delivery Agent Edit' });
        if (deleteResult.deletedCount > 0) {
            console.log("Removed redundant 'Delivery Agent Edit' permission.");
        }

        // 3. Ensure "Delivery Agent Update" is in "Delivery Agent" group (redundant but safe)
        await Permission.updateOne(
            { permission_name: 'Delivery Agent Update' },
            { $set: { group: 'Delivery Agent' } }
        );

        console.log('Consolidation completed successfully.');
        await mongoose.connection.close();
    } catch (err) {
        console.error('Error during consolidation:', err);
        process.exit(1);
    }
}

consolidatePermissions();
