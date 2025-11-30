const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGODB_URI;

const mongoConnection = async () => {
  try {
    if (!url) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }
    await mongoose.connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error while connecting mongoDB:", error.message);
    process.exit(1);
  }
};
module.exports = mongoConnection;
