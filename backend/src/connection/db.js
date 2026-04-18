const mongoose = require("mongoose")

async function connectToDb() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('successfully connected to db')
    } catch (error) {
        console.log(error)
    }
    
}

module.exports = connectToDb