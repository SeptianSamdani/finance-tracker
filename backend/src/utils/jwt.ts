import jwt from 'jsonwebtoken';
import config from '../config/env.js';

interface JwtPayload {
  id: number;
  email: string;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: '7d', // Token valid for 7 days
  });
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, config.jwtSecret) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};