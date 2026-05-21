// 1. Corregimos el import de la clase (la clase va con Mayúsculas 'EncuestaRepository')
import { EncuestaRepository } from '../repository/EncuestaRepository.js';
// 2. AGREGAMOS EL IMPORT DE LA ENTIDAD (Crucial para el new Encuesta())
import { Encuesta } from '../models/Encuesta.js';

// 3. Renombramos la variable a 'encuestaRepo' (en minúscula) para no pisar el nombre de la clase
const encuestaRepo = new EncuestaRepository();

export class EncuestaController {
    
    async getEstadisticas(req, res) {
        try {
            // Usamos 'encuestaRepo' que es nuestra variable asignada arriba
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
            const datosFormulario = req.body;

            if (!datosFormulario || Object.keys(datosFormulario).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de la encuesta no proporcionados'
                });
            }

            // Ahora que pusimos el import arriba, esto va a funcionar de diez
            const nuevaEncuesta = new Encuesta(datosFormulario);

            if (!nuevaEncuesta.isValid()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de la encuesta no válidos o fuera de rango',
                });
            }

            // Corregimos acá: usamos 'encuestaRepo' (tenías puesto encuestRepository)
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