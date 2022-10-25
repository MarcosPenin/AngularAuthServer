const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config();

const { dbConnection } = require("./db/config");


const app = express();

//db
dbConnection();


//main page
app.use(express.static("public"))



app.use(cors());

app.use(express.json());


//routes
app.use("/api/auth", require("./routes/auth"))

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
});

