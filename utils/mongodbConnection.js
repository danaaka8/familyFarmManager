const mongoose = require('mongoose');

// Connect to MongoDB
// const MONGODB_URI = 'mongodb://localhost:27017/family-farm';
const uri = 'mongodb+srv://danaaka8:p6TPp7ILrQUlDKfE@cluster0.uyhqfof.mongodb.net/familyFarm'
mongoose.connect(uri, {
  useUnifiedTopology: true,
}).then(() => console.log('connected'));
