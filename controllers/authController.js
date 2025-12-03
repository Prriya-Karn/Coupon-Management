// controller/authController.js
const users = require("../db/user-store");

const login = (req, res) => {
    const { email, password } = req.body;
    const u = users.findByEmail(email);
    if (!u || u.password !== password) {
        return res.status(401).json({ msg: "Invalid email or password" });
    }
    // return user object (no JWT needed for assignment). Client can use userId to call APIs.
    return res.status(200).json({
        msg: "Login success (demo)",
        user: {
            userId: u.userId,
            email: u.email,
            userTier: u.userTier,
            country: u.country,
            lifetimeSpend: u.lifetimeSpend,
            ordersPlaced: u.ordersPlaced
        }
    });
};

module.exports = login;