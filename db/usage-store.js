// db/usage-store.js
// usageCounts[userId] = { COUPONCODE: count }
const usageCounts = {};

module.exports = {
    usageCounts,
    getCount(userId, code) {
        if (!usageCounts[userId]) return 0;
        return usageCounts[userId][code] || 0;
    },
    increment(userId, code) {
        if (!usageCounts[userId]) usageCounts[userId] = {};
        usageCounts[userId][code] = (usageCounts[userId][code] || 0) + 1;
    }
};
