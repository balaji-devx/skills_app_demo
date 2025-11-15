const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    roll: String,
    name: String,
    guardianPhone: { type: String, default: null },
    skills: [String]
});

module.exports = mongoose.model('Student', StudentSchema);
