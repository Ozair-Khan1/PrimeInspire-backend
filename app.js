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

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://prime-inspire-clone.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.options('*', cors())

app.use('/api/auth', router)

module.exports = app