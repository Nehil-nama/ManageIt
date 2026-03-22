const mongoose = require("mongoose");
const dotenv   = require("dotenv");
dotenv.config();

const User    = require("../models/User.model");
const Project = require("../models/Project.model");
const Task    = require("../models/Task.model");
const Team    = require("../models/Team.model");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  // Clear existing
  await Promise.all([User.deleteMany(), Project.deleteMany(), Task.deleteMany(), Team.deleteMany()]);
  console.log("Cleared collections");

  // Users
  const [alice, bob, carol] = await User.create([
    { name: "Alice Johnson", email: "alice@workpulse.com", password: "password123", role: "admin"   },
    { name: "Bob Smith",     email: "bob@workpulse.com",   password: "password123", role: "manager" },
    { name: "Carol White",   email: "carol@workpulse.com", password: "password123", role: "member"  },
  ]);
  console.log("✅ Users seeded");

  // Team
  const team = await Team.create({
    name: "Product Team", description: "Core product development team",
    lead: alice._id, members: [alice._id, bob._id, carol._id],
  });

  // Projects
  const [p1, p2] = await Project.create([
    {
      name: "Website Redesign", description: "Redesign the company website with modern UI/UX",
      status: "active", priority: "high",
      startDate: new Date("2026-03-01"), endDate: new Date("2026-03-31"),
      owner: alice._id, members: [alice._id, bob._id, carol._id], team: team._id,
      tags: ["design","frontend"],
    },
    {
      name: "API Integration", description: "Integrate third-party payment and analytics APIs",
      status: "planning", priority: "medium",
      startDate: new Date("2026-04-01"), endDate: new Date("2026-04-30"),
      owner: bob._id, members: [bob._id, carol._id], team: team._id,
      tags: ["backend","api"],
    },
  ]);
  console.log("✅ Projects seeded");

  // Tasks
  await Task.create([
    { title: "Design homepage mockup",       project: p1._id, reporter: alice._id, assignee: bob._id,   status: "done",        priority: "high",   dueDate: new Date("2026-03-10") },
    { title: "Implement navigation bar",     project: p1._id, reporter: alice._id, assignee: carol._id, status: "in-progress", priority: "medium", dueDate: new Date("2026-03-18") },
    { title: "Mobile responsiveness",        project: p1._id, reporter: bob._id,   assignee: carol._id, status: "todo",        priority: "medium", dueDate: new Date("2026-03-25") },
    { title: "Set up Stripe payment",        project: p2._id, reporter: bob._id,   assignee: bob._id,   status: "todo",        priority: "urgent", dueDate: new Date("2026-04-10") },
    { title: "Analytics dashboard widgets",  project: p2._id, reporter: bob._id,   assignee: alice._id, status: "in-review",   priority: "low",    dueDate: new Date("2026-04-20") },
  ]);
  console.log("✅ Tasks seeded");

  console.log("\n🎉 Seed complete! Login with:");
  console.log("   Email:    alice@workpulse.com");
  console.log("   Password: password123");
  mongoose.disconnect();
};

seed().catch((err) => { console.error(err); mongoose.disconnect(); });
