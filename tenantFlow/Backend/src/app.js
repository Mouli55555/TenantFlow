require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const dashboardRoutes = require("./routes/dashboard.routes");
const authRoutes = require("./routes/auth.routes");
const protectedRoutes = require("./routes/protected.routes");
const userRoutes = require("./routes/users.routes");
const projectRoutes = require("./routes/projects.routes");
const taskRoutes = require("./routes/tasks.routes");
const tenantsRoutes = require("./routes/tenants.routes");

const app = express();

app.use(express.json());

// ---- CORS CONFIG (Express 5 safe) ----
const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS ||
  "http://frontend:3000,http://localhost:3000,http://localhost:5173")
  .split(",")
  .map(o => o.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS blocked: " + origin));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// ❌ DO NOT use app.options("*", ...) in Express 5

// ---- ROUTES ----
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/tenants", tenantsRoutes);

// ---- HEALTH CHECK (MANDATORY) ----
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

module.exports = app;
