import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import encuestaRouter from './src/routes/v1/encuestaRouter.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static('.'));

app.use('/api/v1/encuestas', encuestaRouter);

// Servir archivos estáticos (index.html, styless.css, script.js)
app.use(express.static(process.cwd()));

// Solo arrancamos el servidor en desarrollo, en producción lo maneja Vercel como Serverless Function
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'index.html'));
});
app.get('/styless.css', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'styless.css'));
});
app.get('/script.js', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'script.js'));
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el local http://localhost:${PORT}`);
    });
}

// Exportamos la app para que Vercel la pueda consumir como Serverless Function
export default app;

