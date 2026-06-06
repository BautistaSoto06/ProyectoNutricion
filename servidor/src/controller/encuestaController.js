import { EncuestaRepository } from '../repository/EncuestaRepository.js';
import { Encuesta } from '../models/Encuesta.js';

const encuestaRepo = new EncuestaRepository();

export class EncuestaController {
    
    async getEstadisticas(req, res) {
        try {
            const encuestas = await encuestaRepo.getAll();
            
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
            //datos del formulario que se envían desde el frontend
            const datosFormulario = req.body;

            if (!datosFormulario || Object.keys(datosFormulario).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de la encuesta no proporcionados'
                });
            }

            //creamos una nueva encuesta con los datos del formulario
            const nuevaEncuesta = new Encuesta(datosFormulario);

            //si la encuesta es valida la guardamos en la base de datos
            if (!nuevaEncuesta.isValid()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de la encuesta no válidos o fuera de rango',
                });
            }  
            //guardamos la encuesta en la base de datos
            const encuestaGuardada = await encuestaRepo.create(nuevaEncuesta);
            
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