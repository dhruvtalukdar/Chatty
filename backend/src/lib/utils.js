import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '' 
    });

    res.cookie('token', token, { 
        httpOnly: true
    });
    return token;
} 