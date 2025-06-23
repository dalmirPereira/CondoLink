import { Request, Response, NextFunction } from 'express';
const whitelist = require('../config/whitelist');

const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin; // 'origin' is lowercase and in headers object

  if (origin && whitelist.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', 'true'); // header value must be string
  }
  
  next();
};

module.exports = credentials;