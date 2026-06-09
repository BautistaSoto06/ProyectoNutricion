import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

class Encuesta {
    constructor({
        id = null, name = null, age = null, gender, faculty,
        would_recommend, why_recommend, desc_odor, desc_aroma,
        desc_sweetness, desc_texture, intensity_banana, intensity_chocolate,
        intensity_garbanzo, intensity_carrot, comments = null, created_at = null
    }) {
        this.id = id;
        this.name = name;
        this.age = age ? Number(age) : null;
        this.gender = gender;
        this.faculty = faculty;
        this.wouldRecommend = would_recommend === 'si' || would_recommend === true;
        this.whyRecommend = why_recommend;
        this.descOdor = Number(desc_odor);
        this.descAroma = Number(desc_aroma);
        this.descSweetness = Number(desc_sweetness);
        this.descTexture = Number(desc_texture);
        this.intensityBanana = Number(intensity_banana);
        this.intensityChocolate = Number(intensity_chocolate);
        this.intensityGarbanzo = Number(intensity_garbanzo);
        this.intensityCarrot = Number(intensity_carrot);
        this.comments = comments;
        this.createdAt = created_at;
    }

    isValid() {
        const numerics = [
            this.descOdor, this.descAroma, this.descSweetness, this.descTexture,
            this.intensityBanana, this.intensityChocolate, this.intensityGarbanzo, this.intensityCarrot
        ];
        return numerics.every(v => !isNaN(v) && v >= 1 && v <= 10);
    }

    toDatabaseJson() {
        return {
            name: this.name, age: this.age, gender: this.gender, faculty: this.faculty,
            would_recommend: this.wouldRecommend, why_recommend: this.whyRecommend,
            comments: this.comments, desc_odor: this.descOdor, desc_aroma: this.descAroma,
            desc_sweetness: this.descSweetness, desc_texture: this.descTexture,
            intensity_banana: this.intensityBanana, intensity_chocolate: this.intensityChocolate,
            intensity_garbanzo: this.intensityGarbanzo, intensity_carrot: this.intensityCarrot
        };
    }
}

app.get('/api/v2/encuestas/data', async (req, res) => {
    try {
        const { data, error } = await supabase.from('survey_responses').select('*');
        if (error) throw error;
        const encuestas = data.map(row => new Encuesta(row));
        res.status(200).json({ success: true, count: encuestas.length, data: encuestas });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener encuestas', error: error.message });
    }
});

app.post('/api/v2/encuestas/submit', async (req, res) => {
    try {
        const datos = req.body;
        if (!datos || Object.keys(datos).length === 0) {
            return res.status(400).json({ success: false, message: 'No se recibieron datos' });
        }
        const encuesta = new Encuesta(datos);
        if (!encuesta.isValid()) {
            return res.status(400).json({ success: false, message: 'Los datos no son válidos (rangos 1-10)' });
        }
        const { data, error } = await supabase.from('survey_responses').insert([encuesta.toDatabaseJson()]).select();
        if (error) throw new Error(`Error de Supabase: ${error.message}`);
        const guardada = new Encuesta(data[0]);
        res.status(201).json({ success: true, message: 'Encuesta v2 guardada con éxito', data: guardada });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error interno', error: error.message });
    }
});

export default app;
