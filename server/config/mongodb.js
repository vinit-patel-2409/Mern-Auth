import mongoose from "mongoose";

// Set strictQuery option to suppress deprecation warning
mongoose.set('strictQuery', false);

const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log('MongoDB connected'));
    mongoose.connection.on('error', (err) => console.log('MongoDB error:', err));
    
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;