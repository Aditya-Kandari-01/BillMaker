const express = require('express')
const cors = require('cors');
const app = express()


app.use(express.json())
app.use(cors({ 
    origin:"http://localhost:5173",
    credentials:true
}))

// Require all the routes here
const customerRouter = require("./routes/customerRouter");

app.use("/data/customer",customerRouter)

app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app

