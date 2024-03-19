const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

// dotenv config
dotenv.config();

// mongodb connection
connectDB();

// rest object
const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    optionSuccessStatus: 200,
  })
);
// middlewares
app.use(express.json());
app.use(morgan("dev")); // -- app engine
app.use("/images", express.static(path.join(__dirname, "Images")));

// routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
// PORT
const PORT = process.env.PORT || 8080;

// listen port
app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_MODE} mode and listening on ${process.env.PORT}`
      .bgCyan.white
  );
});
