import mongoose from 'mongoose';

// Disable operation buffering so queries fail immediately or switch to fallback instead of freezing for 10 seconds
mongoose.set('bufferCommands', false);

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/habit_planner', {
      serverSelectionTimeoutMS: 2000, // Timeout after 2s instead of 30s
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB] Notice: ${error.message}. Running with High-Performance Persistent JSON Storage Engine.`);
  }
};

export const isDBConnected = () => mongoose.connection.readyState === 1;

export default { connectDB, isDBConnected };
