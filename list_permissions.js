const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
const Permission = require('./models/Permission');

async function listPermissions() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const permissions = await Permission.find({}, 'permission_name group').lean();
        const groups = {};
        permissions.forEach(p => {
            if (!groups[p.group]) groups[p.group] = [];
            groups[p.group].push(p.permission_name);
        });
        console.log('--- PERMISSION GROUPS ---');
        for (const group in groups) {
            console.log(`[${group}]: ${groups[group].join(', ')}`);
        }
        await mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}
listPermissions();
