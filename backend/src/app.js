const express = require("express");
const cors = require("cors");

const websiteRoutes = require("./routes/website.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/websites", websiteRoutes);

app.use(errorMiddleware);

module.exports = app;