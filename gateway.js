const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const app = express();

app.use(express.json());

const SECRET_KEY = 'your-secret-key'; // Use env vars in production

// Dummy user for demo
const users = {
    alice: 'password123'
};

// Login route to issue JWT
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// Middleware to verify JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Protected route to User Service
app.get('/user/:id', authenticateToken, async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:3001/user/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).send('User Service unavailable');
    }
});

// Protected route to Product Service
app.get('/product/:id', authenticateToken, async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:3002/product/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Product Service unavailable');
    }
});

app.listen(3000, () => console.log('API Gateway with Auth running on port 3000'));
