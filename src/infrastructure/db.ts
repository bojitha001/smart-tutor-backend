import mongoose from "mongoose";

export const connectDB = async () => {
    try {
    const connnectionString = "mongodb+srv://smarttutor:smarttutor2025@cluster0.is6xv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    await mongoose.connect(connnectionString);
    console.log("DB connection successfull!")
    } catch (error) {
        console.log("DB connection failed!")
    }
}