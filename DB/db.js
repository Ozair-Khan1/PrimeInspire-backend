const mongoose = require('mongoose')

const connectDB = async () => {
    
    try {
    console.log("Attempting to connect to MongoDB..."); // Add this
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error)
    }

}

module.exports = connectDB