// server.js
const express = require("express");
const app = express();
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("Coupon API Running Successfully 🚀");
});

// routers
const couponRouter = require("./router/couponRouter");
const authRouter = require("./router/authRouter");

// All API routes
app.use("/api", couponRouter);
app.use("/api", authRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
