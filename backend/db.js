import mongoose from "mongoose";

export const connectDB = async() => {
    await mongoose.connect("mongodb+srv://jaja:ilovekiara@cluster0.yrdoiha.mongodb.net/");
    console.log("MongoDB connected!")
}