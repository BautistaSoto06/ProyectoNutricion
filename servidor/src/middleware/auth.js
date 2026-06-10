import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No autorizado.' });
    }
    try {
        req.admin = jwt.verify(header.slice(7), process.env.JWT_SECRET);
        next();
    } catch {
        return res.status(401).json({ success: false, message: 'Token inválido o expirado.' });
    }
};
