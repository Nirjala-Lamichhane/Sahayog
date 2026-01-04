import express from 'express';
import passport from '../config/passportConfig.js';

const router = express.Router();

// Initiate Google OAuth login
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

// Google OAuth callback
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/failure',
        session: false // Set to true if using sessions
    }),
    (req, res) => {
        // On successful authentication
        // req.user contains the user object from passportConfig
        const user = req.user;
        
        // You can redirect to frontend with token or user data
        // Or create a JWT token here and send it
        res.json({
            success: true,
            user: {
                googleId: user.googleId,
                name: user.name,
                email: user.email,
                picture: user.picture
            },
            message: 'Google authentication successful'
        });
    }
);

// Failure route
router.get('/failure', (req, res) => {
    res.status(401).json({
        success: false,
        message: 'Google authentication failed'
    });
});

// Logout route (if using sessions)
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Logout failed' });
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

export default router;

