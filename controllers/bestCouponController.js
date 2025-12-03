// controller/bestCouponController.js
const store = require("../db/coupon-store");
const users = require("../db/user-store");
const usageStore = require("../db/usage-store");

// helper
function parseDate(s) {
    if (!s) return null;
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
}

function computeCartStats(body) {
    // Accept either { cartValue } or { cart: { items: [...] } }
    if (body.cartValue != null) {
        return { cartValue: Number(body.cartValue), totalItems: 0, categories: [] };
    }
    const cart = body.cart || { items: [] };
    let cartValue = 0;
    let totalItems = 0;
    const categories = new Set();
    (cart.items || []).forEach(it => {
        const unit = Number(it.unitPrice || 0);
        const qty = Number(it.quantity || 0);
        cartValue += unit * qty;
        totalItems += qty;
        if (it.category) categories.add(it.category);
    });
    return { cartValue, totalItems, categories: Array.from(categories) };
}

const bestCouponController = (req, res) => {
    try {
        const { user = {}, apply = false } = req.body;
        const { cartValue, totalItems, categories } = computeCartStats(req.body);

        const now = new Date();

        const candidates = [];

        for (const coupon of store.getAll()) {
            // 1) date window check
            const start = parseDate(coupon.startDate);
            const end = parseDate(coupon.endDate);
            if (start && now < start) continue;
            if (end && now > end) continue;

            // 2) usage limit per user
            if (coupon.usageLimitPerUser && coupon.usageLimitPerUser > 0) {
                if (!user.userId) {
                    // to evaluate usage we need userId; skip if not provided
                    continue;
                }
                const used = usageStore.getCount(user.userId, coupon.code);
                if (used >= coupon.usageLimitPerUser) continue;
            }

            // 3) eligibility checks
            const e = coupon.eligibility || {};

            // allowedUserTiers
            if (e.allowedUserTiers && e.allowedUserTiers.length > 0) {
                if (!user.userTier || !e.allowedUserTiers.includes(user.userTier)) continue;
            }

            // minLifetimeSpend
            if (e.minLifetimeSpend && Number(user.lifetimeSpend || 0) < Number(e.minLifetimeSpend)) continue;

            // minOrdersPlaced
            if (e.minOrdersPlaced && Number(user.ordersPlaced || 0) < Number(e.minOrdersPlaced)) continue;

            // firstOrderOnly
            if (e.firstOrderOnly) {
                // first order means ordersPlaced === 0
                if (Number(user.ordersPlaced || 0) !== 0) continue;
            }

            // allowedCountries
            if (e.allowedCountries && e.allowedCountries.length > 0) {
                if (!user.country || !e.allowedCountries.includes(user.country)) continue;
            }

            // cart-based
            if (e.minCartValue && Number(cartValue) < Number(e.minCartValue)) continue;

            if (e.minItemsCount && Number(totalItems) < Number(e.minItemsCount)) continue;

            // applicableCategories (coupon valid if at least one item in cart is in these categories)
            if (e.applicableCategories && e.applicableCategories.length > 0) {
                const common = e.applicableCategories.some(cat => categories.includes(cat));
                if (!common) continue;
            }

            // excludedCategories (coupon invalid if any item in excluded categories present)
            if (e.excludedCategories && e.excludedCategories.length > 0) {
                const excludedPresent = e.excludedCategories.some(cat => categories.includes(cat));
                if (excludedPresent) continue;
            }

            // If reached here coupon is eligible — compute discount
            let discount = 0;
            if ((coupon.discountType || "").toUpperCase() === "PERCENT") {
                discount = (Number(coupon.discountValue) / 100) * Number(cartValue || 0);
                if (coupon.maxDiscountAmount && coupon.maxDiscountAmount > 0) {
                    discount = Math.min(discount, coupon.maxDiscountAmount);
                }
            } else { // FLAT
                discount = Number(coupon.discountValue || 0);
            }

            candidates.push({
                coupon,
                discount,
                endDate: parseDate(coupon.endDate) || new Date(8640000000000000) // far future if no endDate
            });
        }

        if (candidates.length === 0) {
            return res.status(200).json({ msg: "No valid coupon found", bestCoupon: null, discount: 0 });
        }

        // choose best: highest discount -> earliest endDate -> lexicographically smallest code
        candidates.sort((a, b) => {
            if (b.discount !== a.discount) return b.discount - a.discount;
            if (a.endDate.getTime() !== b.endDate.getTime()) return a.endDate.getTime() - b.endDate.getTime();
            return a.coupon.code.localeCompare(b.coupon.code);
        });

        const best = candidates[0];

        // if apply=true and userId provided and coupon has usageLimitPerUser >0 -> increment usage
        if (req.body.apply && user.userId && best.coupon.usageLimitPerUser && best.coupon.usageLimitPerUser > 0) {
            usageStore.increment(user.userId, best.coupon.code);
        }

        return res.status(200).json({
            msg: "success",
            bestCoupon: best.coupon.code,
            discount: Number(best.discount)
        });

    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

module.exports = bestCouponController;
