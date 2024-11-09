import mongoose from 'mongoose';

const MONGODB = process.env.MONGO_URI;

const database = async () => {
  try {   

    // Connecting to  database
    await mongoose.connect(MONGODB);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

export default database;
