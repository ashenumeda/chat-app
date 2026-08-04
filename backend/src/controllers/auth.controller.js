import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
    const { fullname, email, password } = req.body;

    try {
        if (!fullname || !email || !password) {    // check if all fields are provided
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {    // check if password is at least 6 characters long
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // check if emails valid by regex ( regular expression )
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({ email }); // check
        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash the password before saving it to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            await newUser.save(); // save the new user to the database
            generateToken(newUser._id, res); // generate token and send response

            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
        // todo: send a welcome email to the user

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Server error" });
    }
}
