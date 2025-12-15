
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors({
  origin: "http://localhost:5173",
}));


// DB connection
import { connectDB } from "./db.js";
connectDB();

import User from "./models/User.js";
import bcrypt from "bcrypt";

app.use(express.json()); //body-reader

import { signupSchema } from "./validators/auth.schema.js";

app.post("/signup", async (req, res) => {
  try {
    console.log("🔥 /signup HIT");
    console.log("BODY:", req.body);

    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues[0].message,
      });
    }

    const { fullName, email, password } = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "User created" });

  } catch (err) {
    console.error("❌ SIGNUP CRASHED:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});




// app.get(function(req, res){
    
// })

// app.put(function(req, res){
    
// })

app.listen(5000);