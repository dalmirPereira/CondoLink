import { Router, Request, Response } from 'express';
import { findUserByEmail, updateUser } from '../services/userServices';
const { generateAuthTokens } = require("../controllers/authController");


const router = Router();
//require for password crypt
const bcrypt = require('bcrypt');
//require for token
const jwt = require('jsonwebtoken');

interface Login {
    email: string;
    password: string;
}

interface User {
    id: number;
    fullName: string;
    email: string;
    password: string;
    buildingId: number;
    blockId: number;
    roleCode: number;
    companyName: string;
    phone: string;
    approvedBy: number;
    unit: string;
    refreshToken: string
}

//a POST request to login user.
router.post('/', async (req: Request<{}, {}, Login>, res: Response): Promise<void> => {
    const { email, password } = req.body;

    //check if they existe
    if (!email || !password) {
        return res.status(400)
            .json({ message: 'Email and password are required.' });
    }

    //get user information
    const user: User | null = await findUserByEmail(email);

    //if user doesnt exist
    if (!user) {
        return res.status(401)
            .json({ message: 'Invalid username or email.' });
    }

    //check if approved by admin
    if (!user?.approvedBy && user.roleCode != 3 && user.roleCode != 2) {
        return res.status(401)
            .json({ message: 'Unauthorized access. Your user needs to be approved by your building' });
    }
    
    //if user name found then compare the password 
    const match = await bcrypt.compare(password, user.password);

    if (match) {
        try {
            const { accessToken, refreshToken } = await generateAuthTokens(user.email, user.id, user.roleCode);

            //Save the refreshToken in the DB:
            const result = await updateUser(user.id, refreshToken)

            const safeUser = {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                roleCode: user.roleCode,
                buildingId: user.buildingId,
                blockId: user.blockId,
                companyName: user.companyName,
                aprovedBy: user.approvedBy,
                unit: user.unit,
                phone: user.phone,
                accessToken
            };
            
            // Why use cookies to send the refresh token?
            // Storing the refresh token in an httpOnly cookie protects it from being accessed or manipulated by JavaScript in the browser, 
            // mitigating risks such as cross-site scripting (XSS) attacks. It also allows automatic inclusion in requests to the backend 
            // for token refresh operations without exposing it to the client-side code.
            res.cookie('jwt', refreshToken, {
                httpOnly: true,       // Cookie not accessible via JavaScript (protects against XSS attacks)
                sameSite: 'None',     // Allow the cookie to be sent with cross-site requests (necessary for frontend and backend on different origins)
                secure: true,         // Send cookie only over HTTPS connections (important for security in production)
                // sameSite: 'Strict', // Alternative: restrict cookie to same-site requests only (more secure, but may break cross-origin use cases)
                // secure: false,      // For local development without HTTPS (only use when testing locally)
                maxAge: 24 * 60 * 60 * 1000 // Cookie expiration time (1 day in milliseconds)
            });
            res.json({ ...safeUser });

        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }

    } else {
        res.status(401).json({ message: 'Invalid Password.' });
    }

});


//a GET request to refresh access to login user.
router.get('/refresh', async (req: Request, res: Response): Promise<void> => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.status(401).json({ message: 'Refresh token missing' });
    }

    const refreshToken = cookies.jwt; //access cookie sent as 'jwt' on login.

    try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as jwt.JwtPayload;

        // Find user by ID from decoded token
        const user: User | null = await findUserByEmail(decoded.UserInfo.email);
        if (!user) {
            return res.status(403).json({ message: 'User not found' });
        }

        // Check if refresh token matches the one in DB
        if (user.refreshToken !== refreshToken) {
           
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        

        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } = await generateAuthTokens(user.email, user.id, user.roleCode);

        // Update refresh token in DB (optional but recommended for rotation)
        await updateUser(user.id, newRefreshToken);

        // Set new refresh token in cookie
        res.cookie('jwt', newRefreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        console.log("accessToken updated")
        // Send new access token
        res.json({ accessToken });

    } catch (err: any) {
        console.error(err);
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
});


module.exports = router;
