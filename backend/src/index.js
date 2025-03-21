import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("This is your real time chat application which is running on /api");
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});