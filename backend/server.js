require("dotenv").config()
const app = require('./src/app')

const PORT = process.env.PORT || 10000
const connectToDb = require('./src/connection/db')

connectToDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("DB connection failed:", err.message);
    });
