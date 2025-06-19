import { registerUser, loginUser, refreshAccessToken } from '../services/auth.service.js';
import User from '../models/user.model.js';
import cloudinary from '../lib/cloudinary.js';


export const register = async (req, res) => {
    try {
        const { email, fullName, password } = req.body;
        const { user, accessToken, refreshToken } = await registerUser(email, password, fullName);

        // set cookies
        res
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                sameSite: "Strict",
                maxAge: 15 * 60 * 1000, // 15mins
                path: "/"
            })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                sameSite: "Strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                path: "/"       
            });

        res.status(201).json({ user });
        console.log("User registered succesfully");
    }
    catch (err) {
        console.error("Error registering user: ", err.message);
        if (!res.headersSent) {
            if (err.message === "User already exists") {
                return res.status(400).json({ message: err.message });
            }
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken } = await loginUser(email, password);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            sameSite: "strict", // or "Lax" depending on frontend
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: "/",
        });

        console.log("Cookie headers has been set");
        console.log("User logged in successfully");
        // res.json({ success: true, message: "Login successful!", redirectUrl: "/users/about", token: `${token}` });
        res.status(200).json({
            user, accessToken, refreshToken
        })
    }
    catch(err) {
        res.status(400).json(err);
        console.log("Error logging in user: ", err.message);
    }
}


export const getAllUser = async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    }
    catch (error) {
        console.error("Error fetching users: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const logoutUser = async (req, res) => {
    try {
        // Optional : Invalidate refresh token (add to blacklist or remove from DB)
        // blacklist.add(token);
        // res.cookie("token", "", { maxAge: 0 });
        
        // -- Storing the refresh token in DB -- //
        // const refreshToken = req.cookies.refreshToken;
        // if(!refreshToken) {
        //     return res.status(400).json({ message: "No refresh token found!" });
        // }

        // const user = await User.findOne({ refreshToken });

        // if(user) {
        //     user.refreshToken = null;
        //     await user.save();
        // }
        console.log("Cookies received on logout:", req.cookies);


        res.clearCookie("refreshToken", {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/"
        })
        res.status(200).json({ message: "Logged out successfully" });
        console.log("User logged out succesfully");
    }
    catch(error) {
        console.error("Error logging out: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;
        console.log("User ID: ", userId);

        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
    
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );
        
        res.status(200).json(updatedUser);
        console.log("User profile updated successfully");
        }
    catch (error) {
        console.error("Error updating profile: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
        console.log("User authenticated successfully");
    }
    catch (error) {
        console.error("Error checking authentication: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const refresh = async (req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        const newAccessToken = await refreshAccessToken(refreshToken);
        res.json({ newAccessToken: newAccessToken });
    }
    catch(err) {
        console.error("Error generating access token", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
}