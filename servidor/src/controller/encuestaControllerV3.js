import { EncuestaRepository } from '../repository/EncuestaRepository.js';
import { Encuesta } from '../models/Encuesta.js';

const repo = new EncuestaRepository();

export class EncuestaControllerV3 {

    async getEncuestas(req, res) {
        try {
            const encuestas = await repo.getAll();
            return res.status(200).json({
                success: true,
                count: encuestas.length,
                data: encuestas,
            });
        } catch (error) {
            console.error('[V3] getEncuestas:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener las encuestas.',
                error: error.message,
            });
        }
    }

    async postEncuesta(req, res) {
        try {
            const body = req.body;

            if (!body || Object.keys(body).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No se recibieron datos en el cuerpo de la solicitud.',
                });
            }

            const encuesta = new Encuesta(body);

            if (!encuesta.isValid()) {
                return res.status(422).json({
                    success: false,
                    message: 'Los valores numéricos deben estar entre 1 y 10.',
                });
            }

            const guardada = await repo.create(encuesta);
            return res.status(201).json({
                success: true,
                message: 'Encuesta registrada correctamente.',
                data: guardada,
            });
        } catch (error) {
            console.error('[V3] postEncuesta:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno al guardar la encuesta.',
                error: error.message,
            });
        }
    }
}
