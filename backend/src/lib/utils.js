import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


// export const generateToken = (userId, res) => {
//     const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '' 
//     });

//     res.cookie('token', token, { 
//         httpOnly: true
//     });
//     return token;
// } 

export const generateToken = (user, res) => {
    const token = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET);

    res.cookie('token', token, { 
        httpOnly: true
    });
    return token;
};

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}