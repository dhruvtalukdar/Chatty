import express from 'express';
import User from './models/user.model.js';
import { connectDB } from './config/mongoose-connection.js';
import authRouter from './routes/auth.route.js';
import messageRouter from './routes/message.route.js';
import cloudinaryRoute from './routes/cloudinary.route.js';

const app = express();

connectDB();
app.use(express.json());

app.get('/', async (req, res) => {
    res.send("hello world");
})
// app.get('/', async (req, res) => {
//     const user = new User({ fullName: "John Doe", email: "john@example.com", password: "password123" });
//     await user.save();
//     console.log(user); 

//     res.send(`This is your real time chat application which is running on /api ${user._id}, ${user.name}, ${user.email},  ${user.createdAt}`);
// });

app.use('/auth', authRouter);
app.use('/cloudinary', cloudinaryRoute);
app.use('/messages', messageRouter);

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});