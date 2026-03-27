const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
const Permission = require('./models/Permission');
const fs = require('fs');

async function listPermissions() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const perms = await Permission.find({}, 'permission_name group page_url').lean();
        fs.writeFileSync('permissions_detailed.json', JSON.stringify(perms, null, 2));
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
listPermissions();
