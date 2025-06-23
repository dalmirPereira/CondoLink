import { CorsOptions } from 'cors';

const whitelist = require('./whitelist');

const corsOptions: CorsOptions = {
  origin: (origin: any, callback: (err: Error | null, allow?: boolean) => void) => {
    if (origin === undefined || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;