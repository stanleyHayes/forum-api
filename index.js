const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const UserRoutes = require("./routes/Users");
const ReplyRoutes = require("./routes/Replies");
const TopicRoutes = require("./routes/Topics");

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGODB_CONNECTION_URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false}).then(function () {
    console.log("Connected successfully to MongoDB");
}).catch(function (error) {
    console.log(`Error: ${error.message}`);
});


app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/replies", ReplyRoutes);
app.use("/api/v1/topics", TopicRoutes);

app.listen(process.env.PORT, function () {
    console.log(`Server connected on port ${process.env.PORT}`);
});