import { EncuestRepository } from "../repository/encuestRepository";

const encuestRepository = new EncuestRepository();

export class EncuestaController {
    async getEstadisticas(req, res) {
        try {
            const encuestas = await encuestRepository.getAll();
            
            return res.status(200).json({
                success: true,
                count: encuestas.length,
                data: encuestas
            });
        } catch (error) {
            console.error('Error in getEstadisticas:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor al obtener estadísticas',
                error: error.message
            });
        }
    }
}