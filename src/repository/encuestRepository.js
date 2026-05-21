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

    /** 
     * @param {Encuesta} encuestaInstancia
     * @return {Promise<Encuesta>}
     */
    async create(encuestaInstancia) {
        try {
            const jsonParaInsertar = encuestaInstancia.toDatabaseJson();

            const { data, error } = await supabase.from('survey_responses').insert([jsonParaInsertar]).select();

            if (error) {
                throw new Error(`Error de Supabase al crear encuesta: ${error.message}`);
            }

            return new Encuesta(data[0]);
        } catch (error) {
            console.error('Error en encuestRepository.create:', error);
            throw error;
        }
    }
}