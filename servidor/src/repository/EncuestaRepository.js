import { supabase } from '../config/Supabase.js';
import { Encuesta } from '../models/Encuesta.js';

export class EncuestaRepository {
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
            // Convertimos la instancia de Encuesta a un formato JSON compatible con la base de datos
            const jsonParaInsertar = encuestaInstancia.toDatabaseJson();

            // Insertamos el nuevo registro en la tabla 'survey_responses' y seleccionamos el registro insertado para devolverlo
            const { data, error } = await supabase.from('survey_responses').insert([jsonParaInsertar]).select();

            if (error) {
                throw new Error(`Error de Supabase al crear encuesta: ${error.message}`);
            }

            // Devolvemos la nueva encuesta creada como una instancia de la clase Encuesta
            return new Encuesta(data[0]);
        } catch (error) {
            console.error('Error en encuestRepository.create:', error);
            throw error;
        }
    }
}