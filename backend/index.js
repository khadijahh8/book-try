import express from "express";
import cors from "cors";
import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/booknook")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

const app = express();

app.use(cors());
app.use(express.json());

// SIGNUP route
app.post("/api/signup", async (req, res) => {
  console.log("Received signup:", req.body);

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "All fields are required" });
  }

  try {
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Database error" });
  }
});

// GET all users from MongoDB
app.get("/api/user", async (req, res) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (error) {
    res.json({ success: false, message: "Database error" });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});