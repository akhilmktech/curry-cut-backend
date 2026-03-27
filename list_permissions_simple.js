const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
const Permission = require('./models/Permission');

async function listPermissions() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const groups = await Permission.distinct('group');
        for(const g of groups) {
            const perms = await Permission.find({group: g}, 'permission_name').lean();
            console.log(`GROUP: ${g}`);
            perms.forEach(p => console.log(`  - ${p.permission_name}`));
        }
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
listPermissions();
