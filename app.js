import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import encuestaRouter from './src/routes/v1/encuestaRouter.js';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/encuestas', encuestaRouter);
const PORT = process.env.PORT || 3000;
//endpoints
app.get('/', async (req, res) => {
     res.json({message: 'API is working'});
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el local http://localhost:${PORT}`);
});

