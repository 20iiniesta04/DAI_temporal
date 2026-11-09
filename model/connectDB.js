// ./model/connectDB.js
import mongoose from 'mongoose';

const url = 'mongodb://root:example@localhost:27017/DAI?authSource=admin';

export default async function connectDB() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
}

