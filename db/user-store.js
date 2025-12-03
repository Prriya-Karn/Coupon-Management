// db/user-store.js
// simple in-memory users: password plaintext for demo (assignment allows no auth)
const users = [
    {
        userId: "demo-1",
        email: "hire-me@anshumat.org",
        password: "HireMe@2025!", // MUST be present per assignment
        userTier: "NEW",
        country: "IN",
        lifetimeSpend: 0,
        ordersPlaced: 0
    },
    // you can add more users as needed
];

module.exports = {
    users,
    findByEmail(email) { return users.find(u => u.email === email); },
    findById(id) { return users.find(u => u.userId === id); }
};
