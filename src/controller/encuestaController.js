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

    async crearEncuesta(req, res) {
        try {
            const datosFormulario = req.body;

            if (!datosFormulario || Object.keys(datosFormulario).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de la encuesta no proporcionados'
                });
            }

            const nuevaEncuesta = new Encuesta(datosFormulario);

            if (!nuevaEncuesta.isValid()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de la encuesta no válidos o fuera de rango',
                });
            }

            const encuestaGuardada = await encuestRepository.create(nuevaEncuesta);
            return res.status(201).json({
                success: true,
                message: 'Encuesta creada exitosamente',
                data: encuestaGuardada
            });
        } catch (error) {
            console.error('Error in crearEncuesta:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor al crear la encuesta',
                error: error.message
            });
        }
    }
}