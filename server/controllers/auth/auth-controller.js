const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.js');

const registerUser = async (req, res) => {
    const { name, email, password, repeatPassword } = req.body;

    try {
        // Check for missing fields
        if (!name || !email || !password || !repeatPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // Check for password mismatch
        if (password !== repeatPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match',
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exists. Please log in.',
            });
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(password, 12);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashPassword,
        });

        // Save the user in the database
        await newUser.save();

        // Generate a token
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET || 'defaultSecret',
            { expiresIn: '1h' }
        );

        // Send a success response
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
        });
    } catch (e) {
        console.error('Error during registration:', e);
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later.',
        });
    }
};

// Login Async
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const existingLoginUser = await User.findOne({ email });
        if (!existingLoginUser) {
            return res.status(404).json({
                success: false,
                message: 'User does not exist. Please register',
            });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, existingLoginUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect password',
            });
        }

        const token = jwt.sign(
            { id: existingLoginUser._id, 
                email: existingLoginUser.email, 
                role: existingLoginUser.role },
            process.env.JWT_SECRET || 'defaultSecret',
            { expiresIn: '1h' }
        );

        // If login is successful and cookies
        res.cookie('token', token, {
            httpOnly: true, secure : false
        }).status(200).json({
            success: true,
            message: 'Login successful',
            user : {
                email : existingLoginUser.email,
                role : existingLoginUser.role,
                id : existingLoginUser.id,
            }
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
        });
    }
};

// Logout
const logout = async () => {
    try {
        await fetch("http://localhost:4000/api/auth/logout", {
            method: 'POST',
            credentials: 'include',
        });
        dispatch(authSlice.actions.logout());
    } catch (error) {
        console.error('Logout Error:', error);
    }
};


// Auth middleware
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token; // Access cookie from the request
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized user. Please login',
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecret');
        req.user = decoded;
        next(); // Proceed to the next middleware/route
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token. Please login again.',
        });
    }
};

module.exports = {registerUser, loginUser, logout, authMiddleware}