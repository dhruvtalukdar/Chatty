import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// without acess token
// export const protectRoute = async (req, res, next) => {
//     try {
//         // get the token from the cookies
//         console.log("Recieved Token: ", req.cookies.token);
//         const token = req.cookies.token;

//         // check if the token is valid
//         if (!token) {
//             return res.status(401).json( { message: "Unauthorized - No Token Provided" });
//         }

//         // decode the token
//         const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

//         if (!decodedToken) {
//             return res.status(401).json({ message: "Unauthorized - Invalid Token" });
//         }

//         // verify the decode and get the user
//         const decodedUser = await User.findById(decodedToken.id).select("-password");

//         if (!decodedUser) {
//             return res.status(404).json({ message: "User not found!"});
//         }

//         req.user = decodedUser; // attach the user to the request object

//         next();
//     }
//     catch (error) {
        // console.error("Error in protectRoute middleware:", error.message);
        // res.status(500).json({ message: "Internal server error" });
//     }
// }

// with access token(AUthorization headers)
export const protectRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({ meessage: "Unauthorized - No Token Provided" });
        }

        const token = authHeader.split(" ")[1];
        console.log("Recieved Token: ", token);

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        }
        catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Unauthorized - Token Expired" });
            }
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });

        }
        const decodedUser = await User.findById(decodedToken.id).select("-password");

        if(!decodedUser) {
            return res.status(404).json({ message: "User not found!"});
        };

        req.user = decodedUser;

        next();
    }
    catch(error) {
        console.error("Error in protectRoute middleware:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}