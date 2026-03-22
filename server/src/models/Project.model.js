const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status:      { type: String, enum: ["planning", "active", "on-hold", "completed"], default: "planning" },
    priority:    { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
    startDate:   { type: Date },
    endDate:     { type: Date },
    owner:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members:     [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    team:        { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    tags:        [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
