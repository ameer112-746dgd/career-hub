import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // 1. Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.log("❌ Auth Error: No token found in headers");
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    // 2. Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
    
    // 3. Attach user to request
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      console.log("❌ Auth Error: Token valid, but user not found in DB");
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    next();
  } catch (error) {
    console.error("❌ Auth Error: Token verification failed", error);
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};