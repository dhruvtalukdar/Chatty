import { generateToken, hashPassword} from '../lib/utils';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
    const { email, fullName, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.Status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const user = await User.findOne({ email});

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await hashPassword(password); 

        const newUser = new User({
            email,
            fullName,
            password: hashedPassword
        });

        if (newUser) {
            generateToken(newUser, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                profilePic: newUser.profilePic
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        } 
    }
    catch (error) {
        console.log("Error in signup controller: ", error.message);
        res.status(500).json({ message: "Something went wrong" });
    }
} 

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user, res);

        res.status(200).json({
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePic: user.profilePic
        });
    }
    catch (error) {
        console.log("Error in login controller: ", error.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0});
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.log("Error in logout controller: ", error.message);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

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
    }
    catch (error) {
        console.log("Error in updateProfile controller: ", error.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    }
    catch (error) {
        console.log("Error in checkAuth controller: ", error.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}