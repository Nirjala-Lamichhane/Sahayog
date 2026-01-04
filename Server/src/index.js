import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from './config/passportConfig.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize passport
app.use(passport.initialize());

// Routes
app.use('/auth', authRoutes);

// Health check route
app.get('/', (req, res) => {
    res.json({ message: 'Sahayog Server is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

