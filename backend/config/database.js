const mongoose = require("mongoose");

let isConnected = false;

const connectDatabase = async () => {

    if (isConnected && mongoose.connection.readyState === 1) {
        return;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined.");
    }

    try {

        await mongoose.connect(process.env.MONGODB_URI);

        isConnected = true;

        console.log("MongoDB connected successfully.");

    } catch (error) {

        isConnected = false;

        console.error("MongoDB connection failed:");
        console.error(error.message);

        throw error;
    }
};

module.exports = connectDatabase;