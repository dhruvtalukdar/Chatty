import User from '../models/user.model.js';
import Message from '../models/message.model.js';

import cloudinary from '../lib/cloudinary.js';
import { getRecieverSocketId } from '../lib/socket.js';

// need to use middleware
export const getUsersForSidebar = async (req, res) => {
    try {
        const { email } = req.body;
        const requestedUser = await User.findOne({email});

        if (!requestedUser) {
            return res.status(404).json({ message: "User not found!"});
        }

        const loggedInUserId = requestedUser._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId }}).select("-password");

        res.status(200).json(filteredUsers);
    }
    catch (err) {
        console.error("Error fetching users: ", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatWithId } = req.params;
        const loggedInUserId = req.user._id;
        
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId, recieverId: userToChatWithId },
                { senderId: userToChatWithId, recieverId: loggedInUserId },
            ],
        });

        res.status(200).json(messages);
    } catch (err) {
        console.error("Error fetching messages: ", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: recieverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            // upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        const recieverSocketId = getRecieverSocketId(recieverId);
        if (recieverSocketId) {
            io.to(recieverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    }
    catch (err) {
        console.error("Error sending message: ", err.message);
        res.status(500).json({ message: "Internal Server error" });
    }
}