// controller/createCouponController.js
const store = require("../db/coupon-store");

// Helper to validate ISO date strings (optional)
function isValidDateString(s) {
    if (!s) return false;
    const d = new Date(s);
    return !isNaN(d.getTime());
}

const createCouponController = (req, res) => {
    try {
        const {
            code, description, discountType, discountValue,
            maxDiscountAmount = 0, startDate, endDate,
            usageLimitPerUser = 0, eligibility = {}
        } = req.body;

        // Basic validation
        if (!code || !discountType || discountValue == null) {
            return res.status(400).json({ msg: "code, discountType and discountValue required" });
        }

        const dt = discountType.toString().toUpperCase();
        if (dt !== "FLAT" && dt !== "PERCENT") {
            return res.status(400).json({ msg: 'discountType must be "FLAT" or "PERCENT"' });
        }

        if (startDate && !isValidDateString(startDate)) {
            return res.status(400).json({ msg: "startDate must be a valid ISO date string" });
        }
        if (endDate && !isValidDateString(endDate)) {
            return res.status(400).json({ msg: "endDate must be a valid ISO date string" });
        }

        const exists = store.findByCode(code);
        if (exists) {
            return res.status(400).json({ msg: "Coupon code already exists" });
        }

        const newCoupon = {
            code,
            description: description || "",
            discountType: dt,
            discountValue: Number(discountValue),
            maxDiscountAmount: Number(maxDiscountAmount || 0),
            startDate: startDate || null,
            endDate: endDate || null,
            usageLimitPerUser: Number(usageLimitPerUser || 0),
            eligibility: eligibility || {}
        };

        store.add(newCoupon);

        return res.status(200).json({ msg: "Coupon created successfully", coupon: newCoupon });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

module.exports = createCouponController;
