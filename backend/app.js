const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models");
const { setHeaders } = require("./middleware");

const PORT = process.env.PORT || 3005;

const app = express();
app.use(express.json({ limit: "25mb" }));
app.use(bodyParser.json({ limit: "25mb" }));
app.use(bodyParser.urlencoded({ limit: "25mb", extended: true }));
app.use(cors());

// Configure headers
app.use(setHeaders);

// Set routes
app.use("/api/example", require("./routes/Example"));
app.use("/api/map-example", require("./routes/MapExample"));
app.use("/api/user-geometry", require("./routes/UserGeometryRoutes"));
app.use("/api/controls-list-param", require("./routes/ControlsListParamRoutes"));
app.use("/api/landing-controls", require("./routes/LandingControlsRoutes"));
app.use("/api/results", require("./routes/ResultsRoutes"));
app.use("/api/functions", require("./routes/FunctionRoutes"));
app.use("/api/list-inputs", require("./routes/ListInputsRoutes"));
app.use("/api/list-input-types", require("./routes/ListInputTypesRoutes"));
app.use("/api/list-input-bins", require("./routes/ListInputBinsRoutes"));
app.use("/api/list-input-value-types", require("./routes/ListInputValueTypesRoutes"));

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
