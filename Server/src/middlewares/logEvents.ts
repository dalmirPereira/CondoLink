import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

import { Request, Response, NextFunction } from 'express';

const logEvents = async (message: string, logName: string): Promise<void> => {
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    const logsDir = path.join(__dirname, '..', 'logs');
    if (!fs.existsSync(logsDir)) {
      await fsPromises.mkdir(logsDir);
    }

    await fsPromises.appendFile(path.join(logsDir, logName), logItem);
  } catch (err) {
    console.log(err);
  }
};

const logger = (req: Request, res: Response, next: NextFunction): void => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { logger, logEvents };