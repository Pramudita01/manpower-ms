const mongoose = require('mongoose');

const SubAgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  contact: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'pending'], 
    default: 'active',
    lowercase: true 
  },
  // We don't manually input this; we calculate it later based on workers
  totalWorkersBrought: { type: Number, default: 0 } 
}, { timestamps: true });

module.exports = mongoose.model('SubAgent', SubAgentSchema);