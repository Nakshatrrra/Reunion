const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  priority: { type: Number, required: true, min: 1, max: 5 },
  status: { type: String, enum: ['pending', 'finished'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
