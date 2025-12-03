// db/coupon-store.js
// export array and helper functions for tests and controllers

let coupons = [
    // seed examples (you can remove or modify)
    // {
    //   code: "WINTER",
    //   description: "Welcome for new users",
    //   discountType: "FLAT",
    //   discountValue: 100,
    //   maxDiscountAmount: 0,
    //   startDate: "2025-01-01T00:00:00Z",
    //   endDate: "2025-12-31T23:59:59Z",
    //   usageLimitPerUser: 1,
    //   eligibility: { allowedUserTiers: ["NEW"] }
    // }
];

module.exports = {
    coupons,
    add(c) { coupons.push(c); },
    findByCode(code) { return coupons.find(x => x.code === code); },
    getAll() { return coupons; }
};
