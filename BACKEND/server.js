import { app } from './app.js'
import { connectDB } from './config/db.js'

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`server is running http://localhost:${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log(`connection failed ${error}`)
    })