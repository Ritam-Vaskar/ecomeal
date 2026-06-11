import mongoose from 'mongoose';
let hasConnected = false;
export async function connectMongo() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        return false;
    }
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        hasConnected = true;
        return true;
    }
    catch (error) {
        hasConnected = false;
        return false;
    }
}
export function isMongoConnected() {
    return hasConnected && mongoose.connection.readyState === 1;
}
