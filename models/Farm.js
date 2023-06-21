const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  snsid: {
    type: String,
    required: true,
    unique:true
  },
  uss: {
    type: String,
    required: true,
    unique: true,
  },
  hash: {
    type: String,
    required: true,
    unique:true
  },
  name:{
    type:String,
    required:true
  }
});

module.exports = mongoose.model('Farm', linkSchema,'farms');
