const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session')
cosnt sesseion = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/auth/auth-routes');

// Database Connnection
mongoose.connect(
    'mongodb+srv://ajamanka72:Amadou%40567pass@ecommercescluster0.tqkbi.mongodb.net/'
    ).then(()=>console.log('MongoDB Connected!')
    ).catch((error) => console.log(error));

// Declare App
const app = express();

// Create PORT
const PORT = process.env.PORT || 4000;

// Cors
app.use(cors({
    origin: 'http://localhost:5173', // Allow frontend URL here
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Cache-Control',
        'Expires',
        'Pragma'
    ],
    credentials: true
}));

// Allow requests from your frontend origin
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    credentials: true // Allow credentials (optional)
};

app.use(cors(corsOptions));

app.use(cookieParser()); 
app.use(express.json());
app.use('/api/auth', authRouter)

// Run server
app.listen((PORT), (req, res) => {
    console.log('Server Started on PORT 4000');
});
