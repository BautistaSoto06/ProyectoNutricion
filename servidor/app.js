import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import encuestaRouter from './src/routes/v1/encuestaRouter.js';
import encuestaRouterV2 from './src/routes/v2/encuestaRouter.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/encuestas', encuestaRouter);
app.use('/api/v2/encuestas', encuestaRouterV2);

const PORT = process.env.PORT || 3000;


if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el local http://localhost:${PORT}`);
    });
}

// Exportamos la app para que Vercel la pueda consumir como Serverless Function
export default app;

