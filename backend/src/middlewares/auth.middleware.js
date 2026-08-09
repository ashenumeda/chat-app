import jwt from "jsonwebtoken";
import User from "../models/User.js";
import 'dotenv/config';

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized: Invalid token"});
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found"});
        }

        req.user = user; // attach user to request object
        next(); // proceed to the next middleware or route handler
    } catch (error) {
        console.error("Error in protectedRoute middleware:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};