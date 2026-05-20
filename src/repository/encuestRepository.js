import { supabase } from '../config/Supabase.js';

export class EncuestRepository {
    async getAll() {
        try {
            const { data, error } = await supabase.from('survey_responses').select('*'); 
            if (error) {
                console.error('Error fetching encuestas:', error);
                throw error;
            }
        return data;    

        }catch (error) {
            console.error('Error in getAll:', error);
            throw error;
        }
    }
}