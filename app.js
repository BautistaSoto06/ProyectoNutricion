    import express from 'express';
    import cors from 'cors';
    import dotenv from 'dotenv';
    dotenv.config();
    import {supabase} from './src/config/Supabase.js';

    const app = express();

    app.use(cors());
    app.use(express.json());

    const PORT = process.env.PORT || 3000;

    //endpoints

    app.get('/', async (req, res) => {
        res.json({message: 'API is working'});
    });


    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el local http://localhost:${PORT}`);
    });

