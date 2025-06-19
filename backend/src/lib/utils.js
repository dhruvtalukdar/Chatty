import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const generateToken = (user) => {
    return jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET)
};

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

// Access token is used to access protected routes
export const createAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
}

// Refresh token is used to get a new access token when the access token expires
export const createRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}


// export const generateToken = (userId, res) => {
//     const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '' 
//     });

//     res.cookie('token', token, { 
//         httpOnly: true
//     });
//     return token;
// } 

// export const generateToken = (user, res) => {
//     const token = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET);

//     res.cookie('token', token, { 
//         httpOnly: true
//     });
//     return token;
// };