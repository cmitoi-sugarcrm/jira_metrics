const mongoose = require('mongoose');

const FilterSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // To associate filters with users
  projects: [String], // Selected projects
  labels: [String], // Selected labels
  quarters: [String], // Selected quarters
});

module.exports = mongoose.model('Filter', FilterSchema);
