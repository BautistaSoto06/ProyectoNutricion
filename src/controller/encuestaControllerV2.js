import { EncuestaRepository } from '../repository/EncuestaRepository.js';
import { Encuesta } from '../models/Encuesta.js';

const encuestaRepo = new EncuestaRepository();

export class EncuestaControllerV2 {
    
    /**
     * Obtiene todas las encuestas (Estadísticas)
     */
    async getEncuestas(req, res) {
        try {
            const encuestas = await encuestaRepo.getAll();
            return res.status(200).json({
                success: true,
                count: encuestas.length,
                data: encuestas
            });
        } catch (error) {
            console.error('Error en v2 getEncuestas:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener encuestas v2',
                error: error.message
            });
        }
    }

    /**
     * Crea una nueva encuesta desde React
     */
    async postEncuesta(req, res) {
        try {
            const datos = req.body;

            if (!datos || Object.keys(datos).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No se recibieron datos'
                });
            }

            // Mapeo manual si los campos de React difieren ligeramente de lo que espera el Modelo
            // En este caso, brownie.tsx ya envía los campos correctos.
            const nuevaEncuesta = new Encuesta(datos);

            if (!nuevaEncuesta.isValid()) {
                return res.status(400).json({
                    success: false,
                    message: 'Los datos de la encuesta no son válidos (revisar rangos 1-10)',
                });
            }

            const guardada = await encuestaRepo.create(nuevaEncuesta);
            
            return res.status(201).json({
                success: true,
                message: 'Encuesta v2 guardada con éxito',
                data: guardada
            });
        } catch (error) {
            console.error('Error en v2 postEncuesta:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno en el servidor v2',
                error: error.message
            });
        }
    }
}
