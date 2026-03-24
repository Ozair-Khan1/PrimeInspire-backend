const express = require('express')
const router = require('./routes/auth.route')
const cookieParser = require('cookie-parser')
const cors = require('cors')


const app = express()
app.set("trust proxy", 1);
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "https://prime-inspire-clone.vercel.app",
    credentials: true
}))

app.use('/api/auth', router)

module.exports = app