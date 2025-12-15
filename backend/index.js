import Post from "./models/Post.js";
import { authMiddleware } from "./middleware/auth.js";
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

    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues[0].message,
      });
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
    });

  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/posts", authMiddleware, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: "All fields required" });
    }

    const post = await Post.create({
      title,
      description,
      category,
      author: req.userId,
    });

    // Populate author before sending response
    await post.populate("author", "fullName");

    res.status(201).json(post);
  } catch (err) {
    console.error("CREATE POST ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "fullName")
      .populate("comments.user", "fullName")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("FETCH POSTS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ FIXED LIKE ENDPOINT
app.post("/posts/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userId = req.userId.toString();

    // Check if user already liked
    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      // Unlike: remove user from likes array
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      // Like: add user to likes array
      post.likes.push(userId);
    }

    await post.save();

    console.log("✅ LIKES UPDATED:", post.likes);

    res.json({ 
      likes: post.likes.length,
      isLiked: !alreadyLiked 
    });
  } catch (err) {
    console.error("❌ LIKE ERROR:", err);
    res.status(500).json({ error: "Like failed" });
  }
});

// ✅ NEW COMMENT ENDPOINT
app.post("/posts/:id/comment", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Comment text required" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Add comment
    post.comments.push({
      user: req.userId,
      text: text.trim(),
    });

    await post.save();

    // Populate the user info for the new comment
    await post.populate("comments.user", "fullName");

    console.log("✅ COMMENT ADDED");

    res.json({ 
      comments: post.comments,
      message: "Comment added" 
    });
  } catch (err) {
    console.error("❌ COMMENT ERROR:", err);
    res.status(500).json({ error: "Comment failed" });
  }
});

app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});