import jwt from 'jsonwebtoken';

export class AdminController {
    login(req, res) {
        const { username, password } = req.body ?? {};

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Usuario y contraseña requeridos.' });
        }

        if (username !== process.env.ADMIN_USER || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ success: false, message: 'Credenciales incorrectas.' });
        }

        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '8h' });
        return res.status(200).json({ success: true, token });
    }
}
