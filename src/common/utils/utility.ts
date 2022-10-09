import { Request } from 'express';
import { JwtFromRequestFunction } from 'passport-jwt';

export const extractToken: JwtFromRequestFunction = (
  request: Request,
): string | null => {
  try {
    const token = request.cookies['jwt'];
    return token;
  } catch (err) {
    return null;
  }
};
