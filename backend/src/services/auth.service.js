import User from "../models/user.model.js"
import { generateToken, hashPassword } from "../lib/utils.js";
import bcrypt from 'bcryptjs';

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
        const token = generateToken(createdUser);
        return { user: createdUser, token }
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
        const token = generateToken(existingUser);
        return { user: existingUser, token }
    }
    catch (err) {
        throw err;
    }
}

// regsiter : getting th user details -- checking if user already exists -- if not create a new user -- generate token -- return user & token
// login : check if user exists -- check password -- generate token -- return user & token