const express = require('express')
const dotEnv = require('dotenv')
const router = require('./routes/auth.route')
const cookieParser = require('cookie-parser')
const cors = require('cors')


dotEnv.config()
const app = express()
app.set("trust proxy", 1);
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: "https://prime-inspire-clone.vercel.app",
  credentials: true,
}));

app.options("*", cors());

app.use('/api/auth', router)

module.exports = app