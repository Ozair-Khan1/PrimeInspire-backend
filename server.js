const express = require('express');
const app = express();
const dotEnv = require('dotenv')
const connectDB = require('./DB/db')

dotEnv.config()
connectDB()
const PORT = process.env.PORT_NUM|| 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;