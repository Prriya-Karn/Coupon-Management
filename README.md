# Assignment Name: Coupon Management
# Role: Software Developer


# Coupon Management

## Project Overview
Simple backend service that supports:
- Create coupons with eligibility rules
- Return best matching coupon given user + cart input

## Tech Stack
- Node.js
- Express

## How to Run
1. Install dependencies:
   npm install express
2. Start server:
   node server.js
3. Server runs at http://localhost:3000

## APIs
- POST /api/create-coupon
  Body: { code, description, discountType, discountValue, maxDiscountAmount, startDate, endDate, usageLimitPerUser, eligibility }

- GET /api/coupons
  Returns list of stored coupons

- POST /api/best-coupon
  Body: { user: { userId, userTier, country, lifetimeSpend, ordersPlaced }, cart: { items: [...] } }
  or: { user, cartValue: number }.
  Optional: include `"apply": true` to increment usage count (if coupon has usageLimitPerUser).

- POST /api/login
  Body: { email, password }
  Demo account available: email `hire-me@anshumat.org`, password `HireMe@2025!`

## AI Usage Note
I used ChatGPT to speed up code-writing and validation.

