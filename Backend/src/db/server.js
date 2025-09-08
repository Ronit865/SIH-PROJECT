import mongo from 'mongoose';
// import { DB_NAME } from '../constant.js';

const connectDB = async () => {
  try {
    await mongo.connect(`${process.env.MONGODB_URI}/Alumni-Project`, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully✅');
  } catch (error) {
    console.error('MongoDB connection failed❌:', error);
    process.exit(1); // Exit the process with failure
  }
}

export default connectDB;