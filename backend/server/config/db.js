import mongoose from "mongoose";

const connectDB = async () => {

  try {

    // console.log("Mongo URI:", process.env.MONGODB_URI);

    mongoose.connection.once("open", () => {
  console.log("✅ Connected to MongoDB:", mongoose.connection.name);
});


        
    await mongoose.connect(`${process.env.MONGODB_URI}`, {
      serverSelectionTimeoutMS: 30000, // prevents buffering timeout
    });

    console.log(" Database connected successfully");
    
  } catch (error) {
    console.error(" Database connection failed:", error.message);
    process.exit(1); 
  }
};

export default connectDB;
