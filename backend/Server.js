require('dotenv').config();
const app = require("./SRC/app");
const ConnectDB = require('./SRC/Db/Db');

ConnectDB();

app.listen(3000,"0.0.0.0",()=>{
    console.log("Server is running on port 3000");
})
