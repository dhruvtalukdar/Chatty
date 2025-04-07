import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
    try {
        // get the token from the cookies
        const token = req.cookies.jwt;

        // check if the token is valid
        if (!token) {
            return res.status(401).json( { message: "Unauthorized - No Token Provided" });
        }

        // decode the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedToken) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }

        // verify the decode and get the user
        const decodedUser = await User.findById(decodedToken.id).select("-password");

        if (!decodedUser) {
            return res.status(404).json({ message: "User not found!"});
        }

        req.user = decodedUser; // attach the user to the request object
    }
    catch (error) {
        console.error("Error in protectRoute middleware:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}