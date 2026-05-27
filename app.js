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

// Aseguramos que Express pueda encontrar tu CSS y tu script.js en Vercel
app.use(express.static(process.cwd()));

// Cuando alguien entre a la raíz, le enviamos el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'index.html'));
});


if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el local http://localhost:${PORT}`);
    });
}

// Exportamos la app para que Vercel la pueda consumir como Serverless Function
export default app;

