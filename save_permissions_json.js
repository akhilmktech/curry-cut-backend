const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
const Permission = require('./models/Permission');
const fs = require('fs');

async function listPermissions() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const groups = await Permission.distinct('group');
        const result = {};
        for(const g of groups) {
            const perms = await Permission.find({group: g}, 'permission_name').lean();
            result[g] = perms.map(p => p.permission_name);
        }
        fs.writeFileSync('permissions_data.json', JSON.stringify(result, null, 2));
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
listPermissions();
