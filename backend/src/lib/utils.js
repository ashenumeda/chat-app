import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const { JWT_SECRET } = process.env;
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment variables.");
    }

    const token = jwt.sign({ userId: userId }, JWT_SECRET, {
        expiresIn: "7d", // token expires in 7 days
    });

    res.cookie("jwt", token, {
        httpOnly: true, // cookie cannot be accessed by client-side JavaScript (prevents XSS attacks)
        secure: process.env.NODE_ENV === "production", // cookie is only sent over HTTPS in production
        sameSite: "strict", // cookie is only sent for same-site requests (prevents CSRF attacks)
        maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expires in 7 days
    });

    return token;
}
