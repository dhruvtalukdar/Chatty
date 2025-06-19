import User from "../models/user.model.js"
import { createAccessToken, createRefreshToken, hashPassword } from "../lib/utils.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

export const registerUser = async (email, password, fullName) => {
    try{
        // check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error("User already exists");
        }

        // hash password
        const hashedPassword = await hashPassword(password)

        // create user
        const createdUser = await User.create({
            email,
            password: hashedPassword,
            fullName
        });

        // generate token
        const refreshToken = createRefreshToken(createdUser._id);
        const accessToken = createAccessToken(createdUser._id);
        return { user: createdUser, accessToken, refreshToken }
    }
    catch (err) {
        throw err;
    }
}

export const loginUser = async (email, password) => {
    try {
        // check if user already exists
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            throw new Error("Invalid credentials");
        }

        // check password
        const isMatch = await bcrypt.compare(password, existingUser.password);

        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        // generate token
        const accessToken = createAccessToken(existingUser._id);
        const refreshToken = createRefreshToken(existingUser._id);
        return { user: existingUser, accessToken, refreshToken };
    }
    catch (err) {
        throw err;
    }
}

export const refreshAccessToken = async (refreshToken) => {
    try {
        const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
        if (!decodedToken)  return res.status(404).json({ message: "Unauthorized - Invalid Token"})

        const decodedUser = await User.findById(decodedToken.id).select("-password");
        if (!decodedUser) return res.status(404).json({ message: "User not found!"})

        const newAccessToken = createAccessToken(decodedUser._id);

        return newAccessToken;
    }
    catch (err) {
        console.error("Error refreshing token:", err.message);
        return res.status(403).json({ message: "Invalid refresh token" });
    }
}
// regsiter : getting th user details -- checking if user already exists -- if not create a new user -- generate token -- return user & token
// login : check if user exists -- check password -- generate token -- return user & token