const Team = require("../models/Team.model");

const getTeams = async (req, res) => {
  try {
    const teams = await Team.find({ members: req.user._id })
      .populate("lead",    "name avatar email")
      .populate("members", "name avatar email")
      .populate("projects","name status");
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("lead",    "name avatar email")
      .populate("members", "name avatar email")
      .populate("projects","name status priority");
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createTeam = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const team = await Team.create({
      name, description,
      lead: req.user._id,
      members: [...new Set([...(members || []), req.user._id.toString()])],
    });
    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.json({ message: "Team deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTeams, getTeam, createTeam, updateTeam, deleteTeam };
