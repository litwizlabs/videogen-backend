import jwt from 'jsonwebtoken';

export const generateToken = (userId: string): string => {
    const secretKey = process.env.JWT_SECRET || 'your_secret_key';
    const token = jwt.sign({ id: userId }, secretKey);
    return token;
};

