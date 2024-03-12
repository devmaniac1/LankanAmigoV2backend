const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const functions = require("firebase-functions");
const userRouter = require("./routes/userRoutes");
const googleRouter = require("./routes/googleRoutes");
const tripadvisorRouter = require("./routes/tripAdvisorRoutes");
const serpRouter = require("./routes/serpRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 3002;

const mongoDB = `mongodb+srv://lankanamigo:${process.env.DATABASE_PASSWORD}@cluster.2yzcprp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster`;

app.use("/api/users", userRouter);
app.use("/googleAPI", googleRouter);
app.use("/tripadvisorAPI", tripadvisorRouter);
app.use("/serpAPI", serpRouter);
app.get("/", (req, res) => {
  res.json({
    status: process.env.GOOGLEAPI,
    port: process.env.PORT,
    portD: PORT,
  });
});

mongoose
  .connect(mongoDB)
  .then(() => {
    const connection = mongoose.connection;
    connection.once("open", () => {
      console.log("connected");
    });
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

exports.api = functions.https.onRequest(app);
