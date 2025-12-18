import mongoose from "mongoose";

// Function to connect to the mongodb database
export const connectDB = async () =>{
    try {
        mongoose.connection.on('connected', ()=> console.log('Database Connected'));
        mongoose.connection.on('error', (err)=> console.log('MongoDB connection error:', err));
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.log('MongoDB Connection Failed:', error.message);
        console.log('Server will continue without database...');
        // Don't exit, let server run without DB for now
    }
}