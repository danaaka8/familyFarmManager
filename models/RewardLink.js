const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    required: true
  },
  owner:{
    type:String,
    required:true,
  },
  reward:{
    type:String,
    required:true
  }
});

module.exports = mongoose.model('RewardLink', linkSchema,'rewardLinks');
