const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app")
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE_LOCAL

mongoose.connect(DB, { useNewUrlParser: true, }).then((connection) => {
    console.log(connection.connections);
    console.log("DB connection successful!");
})


const port = process.env.PORT ?? 4000;

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});