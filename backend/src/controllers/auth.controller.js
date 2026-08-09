import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandler.js";

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
        try {
            await sendWelcomeEmail(newUser.email, newUser.fullname, process.env.CLIENT_URL);
        } catch (error) {
            console.error("Error sending welcome email:", error);
        }

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" }); // never tell user which one is wrong for security reasons
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" }); // never tell user which one is wrong for security reasons
        }

        generateToken(user._id, res); // generate token and send response   

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.error("Error in login controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    res.cookie("jwt", "", {maxAge: 0});
    res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (req, res) => {
    try {
        const profilePic = req.body // need to figure out how to get the profile pic from the request body
        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required" });
        }

        const userId = req.user._id; // get the user id from the request object (set by the protectedRoute middleware)

        const uploadedResponse = await cloudinary.uploader.upload(profilePic); // upload the profile picture to Cloudinary

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadedResponse.secure_url },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error in updateProfile controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};