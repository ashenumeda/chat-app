import express from "express";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/auth.route.js"; //importing the auth routes from the auth.route.js file 
import messageRoutes from "./routes/message.route.js"; //importing the message routes from the message.route.js file
import { connectDB } from "./lib/db.js";

import dns from 'node:dns';

/* * ========================================================================
 * MONGODB SRV CONNECTION FIX (Local Development Only)
 * ========================================================================
 * ISSUE: Local ISPs (especially in Sri Lanka) and strict routers often fail 
 * to resolve complex MongoDB Atlas '+srv' DNS records. This results 
 * in an 'ECONNREFUSED querySrv' crash when starting the server.
 * * FIX:   This script bypasses the local router and forces Node.js to use 
 * Google's Public DNS to find the database IP addresses directly.
 * * SAFETY: We wrap this in an environment check. It MUST be disabled in 
 * production (Sevalla) so the app can use the cloud provider's 
 * faster, secure, and encrypted internal DNS routing.
 * ========================================================================
 */

// Only apply this fix if we are running locally on our own machine
if (process.env.NODE_ENV !== 'PRODUCTION') {
  dns.setDefaultResultOrder('ipv4first');   // 1. Force IPv4 priority to prevent silent timeouts from bad IPv6 routing
  dns.setServers(['8.8.8.8', '8.8.4.4']);   // 2. Override default ISP router and point directly to Google's DNS servers
  console.log("🛠️  Using custom Google DNS to bypass local MongoDB connection limits");
}

dotenv.config();

const app = express();
const __dirname = path.resolve();

const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse incoming JSON requests ( req.body )

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// make ready for deployment
if (process.env.NODE_ENV === "DEVELOPMENT") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    connectDB(); // Connect to the database when the server starts
});
