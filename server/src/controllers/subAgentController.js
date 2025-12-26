const SubAgent = require('../models/SubAgent');

// Get all agents
exports.getSubAgents = async (req, res) => {
  try {
    const agents = await SubAgent.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: agents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new agent
exports.createSubAgent = async (req, res) => {
  try {
    const agent = await SubAgent.create(req.body);
    res.status(201).json({ success: true, data: agent });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};