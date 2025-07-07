require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const corsOptions = require("./config/corsOptions");
const credentials = require("./middlewares/credentials");
const { logger } = require("./middlewares/logEvents");
const errorHandler = require("./middlewares/errorHandler");
const verifyJWT = require("./middlewares/verifyJWT");
const verifyRoles = require("./middlewares/verifyRoles");
const ROLES_LIST = require("./config/roles_list");

const app = express();


app.use(logger); // Custom logger middleware
app.use(credentials); // Handle options credentials check (before CORS) & fetch cookies credentials
app.use(cors(corsOptions)); // CORS
app.use(express.json()); // Built-in middleware for JSON parsing
app.use(cookieParser()); // Middleware for cookies (for refresh tokens)
app.use("/", express.static(path.join(__dirname, "/public"))); // Serve static files

// Public routes
app.use("/register", require("./routes/registerRoute"));
app.use("/buildings", require("./routes/buildingsRoute"))
app.use("/auth", require("./routes/authRoute")); // /refresh is in this route

//JWT verification middleware
app.use(verifyJWT);

// Protected routes with role verification
app.use("/dashboard", verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Subs, ROLES_LIST.Resident ), require("./routes/dashboardRoute"));
app.use("/admin", verifyRoles(ROLES_LIST.Admin), require("./routes/adminRoutes"));

// Custom error handler middleware
app.use(errorHandler);

module.exports = app;