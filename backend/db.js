const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/LiftMan';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected at', mongoURI);
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

module.exports = mongoose;