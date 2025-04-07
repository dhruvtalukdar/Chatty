import { registerUser, loginUser } from '../services/auth.service.js';
import User from '../models/user.model.js';
import cloudinary from '../lib/cloudinary.js';


export const register = async (req, res) => {
    try {
        const { email, fullName, password } = req.body;
        const { user, token } = await registerUser(email, password, fullName);

        // console.log(user._id);
        res.cookie("token", token);
        res.status(201).json({
            user, token
        });
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
        const { user, token } = await loginUser(email, password);

        res.cookie("token", token, {
            httpOnly: true,
            path: "/",
        });

        console.log("Cookie headers has been set");
        // res.json({ success: true, message: "Login successful!", redirectUrl: "/users/about", token: `${token}` });
        console.log("User logged in successfully");
        res.status(200).json({
            user, token
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

export const logout = (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
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
// export const signup = async (req, res) => {
//     const { email, fullName, password } = req.body;

//     try {
//         if (!fullName || !email || !password) {
//             return res.Status(400).json({ message: "All fields are required" });
//         }

//         if (password.length < 6) {
//             return res.status(400).json({ message: "Password must be at least 6 characters" });
//         }

//         const user = await User.findOne({ email});

//         if (user) {
//             return res.status(400).json({ message: "User already exists" });
//         }

//         const hashedPassword = await hashPassword(password); 

//         const newUser = new User({
//             email,
//             fullName,
//             password: hashedPassword
//         });

//         if (newUser) {
//             generateToken(newUser, res);
//             await newUser.save();

//             res.status(201).json({
//                 _id: newUser._id,
//                 email: newUser.email,
//                 fullName: newUser.fullName,
//                 profilePic: newUser.profilePic
//             });
//         } else {
//             res.status(400).json({ message: "Invalid user data" });
//         } 
//     }
//     catch (error) {
//         console.log("Error in signup controller: ", error.message);
//         res.status(500).json({ message: "Something went wrong" });
//     }
// } 

// export const login = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         if (!email || !password) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);

//         if (!isMatch) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         generateToken(user, res);

//         res.status(200).json({
//             _id: user._id,
//             email: user.email,
//             fullName: user.fullName,
//             profilePic: user.profilePic
//         });
//     }
//     catch (error) {
//         console.log("Error in login controller: ", error.message);
//         res.status(500).json({ message: "Something went wrong" });
//     }
// }

// export const logout = (req, res) => {
//     try {
//         res.cookie("jwt", "", { maxAge: 0});
//         res.status(200).json({ message: "Logged out successfully" });
//     }
//     catch (error) {
//         console.log("Error in logout controller: ", error.message);
//         res.status(500).json({ message: "Something went wrong" });
//     }
// };

// export const updateProfile = async (req, res) => {
//     try {
//         const { profilePic } = req.body;
//         const userId = req.user._id;

//         if (!profilePic) {
//             return res.status(400).json({ message: "Profile picture is required" });
//         }

//         const uploadResponse = await cloudinary.uploader.upload(profilePic);
//         const updatedUser = await User.findByIdAndUpdate(
//             userId, 
//             { profilePic: uploadResponse.secure_url }, 
//             { new: true }
//         );

//         res.status(200).json(updatedUser);
//     }
//     catch (error) {
//         console.log("Error in updateProfile controller: ", error.message);
//         res.status(500).json({ message: "Something went wrong" });
//     }
// }

// export const checkAuth = (req, res) => {
//     try {
//         res.status(200).json(req.user);
//     }
//     catch (error) {
//         console.log("Error in checkAuth controller: ", error.message);
//         res.status(500).json({ message: "Something went wrong" });
//     }
// }