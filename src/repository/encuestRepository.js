import { supabase } from '../config/Supabase.js';

export class EncuestRepository {
    async getAll() {
        try {
            const { data, error } = await supabase.from('survey_responses').select('*'); 
            if (error) {
                console.error('Error fetching encuestas:', error);
                throw error;
            }
        return data.map(serveyJson => new Encuesta(serveyJson));    

        }catch (error) {
            console.error('Error encuesta repository getAll:', error);
            throw error;
        }
    }
}