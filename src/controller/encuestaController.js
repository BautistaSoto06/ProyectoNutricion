import { EncuestRepository } from "../repository/encuestRepository";

const encuestRepository = new EncuestRepository();

export class EncuestaController {
    async getEstadisticas(req, res) {
        try {
            const encuestas = await encuestRepository.getAll();
            
