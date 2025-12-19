import mongoose from "mongoose";

const connectDB = async () => {

  try {
        
    await mongoose.connect(`${process.env.MONGODB_URI}/MovieTicket`, {
      serverSelectionTimeoutMS: 30000, // prevents buffering timeout
    });

    console.log(" Database connected successfully");
    
  } catch (error) {
    console.error(" Database connection failed:", error.message);
    process.exit(1); 
  }
};

export default connectDB;
