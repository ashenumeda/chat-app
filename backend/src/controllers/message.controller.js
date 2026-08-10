import { text } from "express";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const contacts = await User.find({ _id: { $ne: loggedInUserId } }).select("-password"); // exclude password field
        res.status(200).json(contacts);
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMessagesByUserId = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const otherUserId = req.params.id;

        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: loggedInUserId }
            ]
        }).sort({ createdAt: 1 }); // sort messages by creation time in ascending order
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const loggedInUserId = req.user._id;
        const receiverId = req.params.id;

        let imageUrl = null;
        if (image) {
            // uplpload base64 image to cloudinary and get the url
            const uploadedResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadedResponse.secure_url;
        }

        const newMessage = new Message({
            senderId: loggedInUserId,
            receiverId: receiverId,
            text: text || "",
            image: imageUrl || ""
        });

        await newMessage.save();

        // TODO: send message in real-time using socket.io

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // Find all the messages where the logged-in user is either the sender or the receiver
        const messages = await Message.find({ // This gives a list of all messages involving the logged-in user
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId }
            ]
        });

        // Extract unique user IDs of chat partners
        const chatPartnerIds = new Set();
        messages.forEach((message) => {
            if (message.senderId.toString() !== loggedInUserId.toString()) {
                chatPartnerIds.add(message.senderId);
            }
            if (message.receiverId.toString() !== loggedInUserId.toString()) {
                chatPartnerIds.add(message.receiverId);
            }
        });

        // Find the user details for each chat partner
        const chatPartners = await User.find({ _id: { $in: Array.from(chatPartnerIds) } }).select("-password"); /* Here, mongodb use 
            B-tree search to find users in time complexity of O(log n) for each user, where n is the number of users in the database. 
            The overall time complexity for this operation is O(m log n), where m is the number of unique chat partners. 
            This is efficient for a large number of users.
        */
        res.status(200).json(chatPartners);
    } catch (error) {
        console.error("Error fetching chat partners:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};