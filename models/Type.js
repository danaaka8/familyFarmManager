const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true
  },
  value: {
    type: String,
    required: true,
    unique: true,
  }
});

module.exports = mongoose.model('Type', linkSchema,'types');
