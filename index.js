const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const authRouter = require("./routes/authRoutes");
const billingRouter = require("./routes/billingRoutes");
const surveyRouter = require("./routes/surveyRoutes");

require("colors");
require("./models/User");
require("./services/passport");
const { MONGO_URI, cookieKey } = require("./config/keys");

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Database connected".yellow));

const app = express();

app.use(express.json());

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [cookieKey],
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRouter);
app.use("/", billingRouter);
app.use("/", surveyRouter);

if (process.env.NODE_ENV === "production") {
  // Make sure express will server up production assets like our main.js or main.css fil

  app.use(express.static("client/build"));

  // Make sure express will serve up the index.html file if it doesn't recognize the incomming requests route
  const path = require("path");

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}`.cyan);
});
