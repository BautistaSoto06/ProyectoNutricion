import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import encuestaRouter from './src/routes/v1/encuestaRouter.js';
import encuestaRouterV2 from './src/routes/v2/encuestaRouter.js';
import encuestaRouterV3 from './src/routes/v3/encuestaRouter.js';
import adminRouter    from './src/routes/v3/adminRouter.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/encuestas', encuestaRouter);
app.use('/api/v2/encuestas', encuestaRouterV2);
app.use('/api/v3/encuestas', encuestaRouterV3);
app.use('/api/v3/admin',    adminRouter);

const PORT = process.env.PORT || 3000;


if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el local http://localhost:${PORT}`);
    });
}

// Exportamos la app para que Vercel la pueda consumir como Serverless Function
export default app;

