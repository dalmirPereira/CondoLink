const jwt = require('jsonwebtoken');
import { Request, Response, NextFunction } from 'express';

interface DecodedToken {
  UserInfo: {
    roles: number;
  };
}

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    return res.sendStatus(401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as DecodedToken;

    (req as any).roles = decoded.UserInfo.roles;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" }); //token invalid or expired
  }
};

module.exports = verifyJWT;
