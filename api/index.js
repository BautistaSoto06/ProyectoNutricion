import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

import Encuesta from './models/Encuesta.js'; 

const app = express();
app.disable('x-powered-by');

const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ['https://proyecto-nutricion.vercel.app']
    : ['http://localhost:5173'];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

const requireAuth = (req, res, next) => {
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


// funciones reutilizables para obtener y guardar encuestas
const getEncuestasHandler = async (req, res) => {
    try {
        const { data, error } = await supabase.from('survey_responses').select('*');
        if (error) throw error;
        const encuestas = (data ?? []).map(row => new Encuesta(row));
        res.status(200).json({ success: true, count: encuestas.length, data: encuestas });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener encuestas', error: error.message });
    }
};

const submitEncuestaHandler = async (req, res, successMessage) => {
    try {
        const body = req.body;
        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ success: false, message: 'No se recibieron datos en el cuerpo de la solicitud.' });
        }
        const encuesta = new Encuesta(body);
        if (!encuesta.isValid()) {
            return res.status(422).json({ success: false, message: 'Los valores numéricos deben estar entre 1 y 10.' });
        }
        const { data, error } = await supabase.from('survey_responses').insert([encuesta.toDatabaseJson()]).select();
        if (error) throw new Error(`Error de Supabase: ${error.message}`);
        if (!data || data.length === 0) throw new Error('Supabase no devolvió el registro insertado.');
        const guardada = new Encuesta(data[0]);
        res.status(201).json({ success: true, message: successMessage, data: guardada });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error interno', error: error.message });
    }
};

//  RUTAS DE LA API 
// v3 Admin login
app.post('/api/v3/admin/login', (req, res) => {
    const { username, password } = req.body ?? {};
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Usuario y contraseña requeridos.' });
    }
    if (username !== process.env.ADMIN_USER || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: 'Credenciales incorrectas.' });
    }
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '8h' });
    return res.status(200).json({ success: true, token });
});

// v3 — Encuestas
app.get('/api/v3/encuestas/data', requireAuth, getEncuestasHandler);
app.post('/api/v3/encuestas/submit', (req, res) => submitEncuestaHandler(req, res, 'Encuesta registrada correctamente.'));

// v2 Legacy routes 
app.get('/api/v2/encuestas/data', getEncuestasHandler);
app.post('/api/v2/encuestas/submit', (req, res) => submitEncuestaHandler(req, res, 'Encuesta v2 guardada con éxito'));

export default app;