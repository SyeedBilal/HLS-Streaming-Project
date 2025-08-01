const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const dbUrl=process.env.MONGO_DB_URI

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(dbUrl);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
