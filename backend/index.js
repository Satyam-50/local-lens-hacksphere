import jwt from "jsonwebtoken";
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
import { loginSchema } from "./validators/auth.schema.js";

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

app.post("/login", async (req, res) => {
  try {
    console.log("🔥 /login HIT", req.body);

    // 1️⃣ Validate input
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues[0].message,
      });
    }

    const { email, password } = parsed.data;

    // 2️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 4️⃣ Create JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5️⃣ Send token
    return res.json({
      message: "Login successful",
      token,
    });

  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});



// app.get(function(req, res){
    
// })

// app.put(function(req, res){
    
// })

app.listen(5000);