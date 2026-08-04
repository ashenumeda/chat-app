import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,  
            required: true,
            unique: true, // ensures that each email is unique in the database
        },
        password: {
            type: String,
            required: true,
            minlength: 6, // ensures that the password is at least 6 characters long
        },
        fullname: {
            type: String,
            required: true,
        },
        profilePic: {
            type: String,
            default: "", // default value for profilePic is an empty string
        },
    },
    { timestamps: true } // automatically adds createdAt and updatedAt fields to the schema
);

const User = mongoose.model("User", userSchema); // creates a model named "User" based on the userSchema

export default User;
