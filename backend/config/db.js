// Importing the Mongoose library to use MongoDB
const mongoose = require("mongoose");

// Asynchronous function to connect to MongoDB database
const connectDB = async () => {
  try {
    // mongoose.connect to connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Console logging to indicate established connection
    console.log(`MongoDB Connected : ${conn.connection.host}`);
  } catch (error) {
    // Console logging to indicate error
    console.log(`Error : ${error.message}`);
    process.exit();
  }
};

module.exports = connectDB;
