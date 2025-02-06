const mongoose = require('mongoose');


// MongoDB Atlas connection URI
const mongoURI = "mongodb+srv://gm4175urjitupadhyay:URJIT2024u@gdgcamuapp.gcluk.mongodb.net/GDGCAMUAPP?retryWrites=true&w=majority";

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

async function connectToDatabase() {
    try {
        const connection = await mongoose.connect(mongoURI, options);
        console.log('MongoDB connected');
        return connection;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);  }
}

connectToDatabase();

module.exports = mongoose;
