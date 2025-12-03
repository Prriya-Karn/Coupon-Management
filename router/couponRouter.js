// router/couponRouter.js
const express = require("express");
const router = express.Router();


const { listCouponsController } = require("../db/coupon-store");
const createCouponController = require("../controllers/createCouponController");
const bestCouponController = require("../controllers/bestCouponController");

// routes
router.post("/create-coupon", createCouponController);
router.post("/best-coupon", bestCouponController);
router.get("/coupons", (req, res) => {
    res.json({ coupons: require("../db/coupon-store").getAll() });
});

module.exports = router;
