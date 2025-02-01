const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app")
dotenv.config({ path: "./config.env" });

// uncaughtException error
process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception! Shutting down...");
    console.error(err.name, err.message);
    process.exit(1);
});


const DB = process.env.DATABASE_LOCAL
mongoose.connect(DB, { useNewUrlParser: true, }).then((connection) => {
    console.log(connection.connections);
    console.log("DB connection successful!");
}).catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
});


const port = process.env.PORT ?? 4000;

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

// unhandledRejection error
process.on("unhandledRejection", (err) => {
    console.error("❌ Unhandled Rejection! Shutting down...");
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
