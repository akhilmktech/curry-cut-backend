const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Role = require('./models/Role'); // Roles should be defined if referenced by User model.

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const user = await User.findOne({ email: 'admin@mail.com' });
        if (user) {
            console.log("User found:", user.email);
            console.log("Hashed password:", user.password);
        } else {
            console.log("User not found: admin@mail.com");
        }
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
    }
};

checkUser();
