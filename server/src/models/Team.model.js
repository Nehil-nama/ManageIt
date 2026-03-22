const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    lead:        { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members:     [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    projects:    [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    avatar:      { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
