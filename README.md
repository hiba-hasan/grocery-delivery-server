# 🛒 Grocery Delivery Web App – Backend

This is the backend server for the **Grocery Delivery Application(GROCERYGO)**, built using **Node.js**, **Express**, and **MongoDB**. It handles all business logic including user/seller authentication, product management, cart functionality, address handling, and order placement with payment via **Stripe** or **Cash on Delivery**.

## Features

- User & Seller Authentication (JWT + HTTP-only cookies)
- Product management for sellers
- Cart management with MongoDB
- Address saving & listing
- Order placement: Cash on Delivery or Stripe Checkout
- Stripe Webhook listener for payment verification
- Error handling middleware and secure routing

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB (with Mongoose)
- **Auth:** JWT, Cookies
- **Payments:** Stripe
- **File Uploads:** Cloudinary
- **Environment Configs:** dotenv
- **Deployment:** Vercel + GitHub

## Project Structure
configs
  cloudinary config,multer and database connection
controllers
  logic for user,seller,product,cart,address,order
middlewares
  user authentication, seller authentication and error handling middleware
models
  mongoose schemas: user,order,adderess,product
routes
  api route files
server.js

    
  
