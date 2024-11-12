const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const bodyParser = require('body-parser');
const app = express();
app.use(express.json());

app.use(bodyParser.json());
app.use(express.static('public')); // Assuming manifest.json is in the 'public' directory


app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/api/awt')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            if (user.password === password) {
                res.json({ message: 'success' });
            } else {
                res.status(401).json({ message: 'Incorrect password' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error: ' + error });
    }
});

// User registration route
app.post('https:localhost:3001/api/awt/users', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const newUser = new User({
            name,
            email,
            password,
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error: ' + err });
    }
});



      


app.listen(3001, () => {
    console.log('Server is running on port 3001');
});