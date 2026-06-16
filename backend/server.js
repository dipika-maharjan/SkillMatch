import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

connectDB();

const app = express();


// Middleware
app.use(cors());

app.use(express.json());


// Routes
app.get("/", (req, res) => {
  res.send("SkillMatch API Running");
});

app.post("/test", (req, res) => {
  console.log("TEST ROUTE HIT");
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
