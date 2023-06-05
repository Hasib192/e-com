const { readdirSync } = require("fs");
const express = require("express");
const app = express();
const morgan = require("morgan");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("combined"));
app.use(helmet());
app.use("*", (req, res) => {
  res.send("Please use proper route");
});

mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server listening on PORT ${PORT}`);
    });
  })
  .catch((error) => console.log("Connection failed: " + error));

readdirSync("./routes").map((r) => app.use("/api/v1", require(`./routes/${r}`)));
