const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const functions = require("firebase-functions");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const userRouter = require("./routes/userRoutes");
const googleRouter = require("./routes/googleRoutes");
const tripadvisorRouter = require("./routes/tripAdvisorRoutes");
const serpRouter = require("./routes/serpRoutes");
const globalErrorHandler = require("./controllers/errorController");

const BusFare = require("./models/BusFare");
const BusStopFare = require("./models/BusStopFare");
const catchAsync = require("./utils/catchAsync");

const app = express();

//1. MIDDLEWARE

app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(cors());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://lankanamigo.vercel.app/"],
  })
);
app.use(bodyParser.json());
app.use(express.json());

app.use(mongoSanitize());
app.use(xss());

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

app.get(
  "/busFare",
  catchAsync(async (req, res) => {
    const { StopFare } = req.query;

    const busFares = await BusStopFare.find({ StopFare });

    res.json(busFares);
  })
);

app.use(globalErrorHandler);

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
