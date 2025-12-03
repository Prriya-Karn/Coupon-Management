// server.js
const express = require("express");
const app = express();
app.use(express.json());

// routers
const couponRouter = require("./router/couponRouter");
const authRouter = require("./router/authRouter");

app.use("/api", couponRouter);
app.use("/api", authRouter);

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
    console.log("Server running on port 3000");
});