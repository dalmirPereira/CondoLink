import { Request, Response, NextFunction } from 'express';

// Extend the Request type to include custom 'roles' property
interface CustomRequest extends Request {
  roles?: number;
}

const verifyRoles = (...allowedRoles: number[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req?.roles) return res.sendStatus(401);

    const rolesArray = [...allowedRoles];
    const result = rolesArray.includes(req.roles);

    if (!result) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;