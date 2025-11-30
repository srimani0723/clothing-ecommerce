const mongoose = require("mongoose");
require("dotenv").config();

const dbURL = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(dbURL, {
      dbName: "clothing-ecommerce",
    });

    console.log(`MongoDB Connected: ${conn.connection.name}`);
  } catch (error) {
    console.error("DB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
