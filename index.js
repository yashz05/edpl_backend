var express = require("express");

var cors = require("cors");
var app = express();
var { connect } = require("mongoose");
var { expressjwt: jwt } = require("express-jwt");
var cache = require("./others/redis");

const jwt_secret = "cYvPcHRFzRHGLwflceKdSYJIbPmDdJ";
var health = require("./health/health");
var sales_team = require("./routes/sales_teamRoutes");
var sales_teamModel = require("./models/sales_teamModel");
var company = require("./routes/companyRoutes");
var sales = require("./routes/sales_ordersRoutes");
var dispatch = require("./routes/dispatch_ordersRoutes");
var photos = require("./routes/photosRoutes");
var photos_directory = require("./routes/photos_directoriesRoutes");
var approval_menu = require("./routes/approval_menuRoutes");
var customer_historyRoutes = require("./routes/customer_historyRoutes");
var customer_history_euroRoutes = require("./routes/customer_history_euroRoutes");
var customer_grade = require("./routes/customer_gradeRoutes");
var customer_type = require("./routes/customer_typeRoutes");
var laminate_data = require("./routes/laminate_dataRoutes");
var sample_requests = require("./routes/sample_request_companyRoutes");
var collection_requests = require("./routes/daily_collectionRoutes");
app.use(cors());
app.use(express.json());
connect(process.env.MONOGODB_URL, {
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PSWD,
  authSource: "admin",
})
  .then(() => console.log("Connected to DB"))
  .catch((error) => console.error(error.message));
// CORS
var allowedOrigins = ["https://hoppscotch.io", "http://example2.com"];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

// CORS END

app.use(
  "/api/edpl/*",
  jwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] })
);

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.json({
      message: "User not authorized",
    });
  }
});
app.use("/assets", express.static("public"));
app.use("/api/edpl/*", async function (req, res, next) {
  var token = req.auth.uuid;
  if (token == null) {
    res.status(401).json({
      message: "invalid token!",
    });
  }
  var getuser = await sales_teamModel.findOne({
    uuid: token,
  });
  if (getuser != null && getuser.active === true) {
    next();
  } else {
    res.status(401).json({
      message: "sales person inactive",
    });
  }
});

app.get("/", async (req, res) => {
  // await cache.cachecheck("home", { message: "ok" }, req, res, "r");
  res.json({ message: "ok" });
});

app.use("/api/health", health);
app.use("/api/auth/sales_team", sales_team);
app.use("/api/edpl/company", company);
app.use("/api/edpl/sales", sales);
app.use("/api/edpl/dispatch", dispatch);
app.use("/api/edpl/photos", photos);
app.use("/api/edpl/photos_directory", photos_directory);
app.use("/api/edpl/aproval_menu", approval_menu);
app.use("/api/edpl/customer_history", customer_historyRoutes);
app.use("/api/edpl/customer_history_euro", customer_history_euroRoutes);
app.use("/api/edpl/customer_grade", customer_grade);
app.use("/api/edpl/customer_type", customer_type);
app.use("/api/edpl/laminate", laminate_data);
app.use("/api/edpl/sample_requests", sample_requests);
app.use("/api/edpl/collection_data", collection_requests);

app.listen(8092, () => {
  console.log("APP STARTED " + jwt_secret);
});
