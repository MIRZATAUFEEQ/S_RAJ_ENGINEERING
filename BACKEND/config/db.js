import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const connectionInstense = await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME
        })
        console.log(`DB connection successfully with ${connectionInstense.connection.host}`)
    } catch (error) {
        console.log(`connection failed ${error}`)
    }
}

export { connectDB }