const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const taskSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status:      { type: String, enum: ["todo", "in-progress", "in-review", "done"], default: "todo" },
    priority:    { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
    project:     { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    assignee:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reporter:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dueDate:     { type: Date },
    tags:        [{ type: String }],
    comments:    [commentSchema],
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
