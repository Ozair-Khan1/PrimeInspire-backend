const dotEnv = require('dotenv')
dotEnv.config()
const app = require('./app')
const connectDB = require('./DB/db')

connectDB()
const PORT = process.env.PORT_NUM;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;