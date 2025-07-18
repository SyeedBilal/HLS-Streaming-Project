const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const dbUrl="mongodb+srv://syeedbilalkirmaney:Programming.in1@mongodbairbnb.wik5q.mongodb.net/VideoTranscoding?retryWrites=true&w=majority&appName=MONGODBAIRBNB'"

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
