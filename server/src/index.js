const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth",     require("./routes/auth.routes"));
app.use("/api/users",    require("./routes/user.routes"));
app.use("/api/projects", require("./routes/project.routes"));
app.use("/api/tasks",    require("./routes/task.routes"));
app.use("/api/teams",    require("./routes/team.routes"));

// Health check
app.get("/", (req, res) => res.json({ message: "WorkPulse API is running 🚀" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
