const database = require('../database/connection');

class TorneioController {
    async getTorneios(request, response) {
        try {
            // Ajustando a consulta SQL para pegar as colunas corretamente
            const results = await database('torneios')
                .select('id_torneio', 'nome_torneio', 'data_inicio', 'hora_inicio', 'valor_premio') // Ajuste para as colunas da sua tabela
                .orderBy('data_inicio', 'asc'); // Ordena os torneios pela data de início

            // Retorna os torneios encontrados
            response.json(results);
        } catch (error) {
            console.error("Erro ao buscar torneios:", error);
            response.status(500).json({ error: "Erro ao buscar torneios" });
        }
    }

    // Função para pegar um torneio específico pelo ID
    async getTorneioById(request, response) {
        const { id_torneio } = request.params;  // Pega o ID do torneio da URL

        try {
            const torneio = await database('torneios')
                .select('id_torneio', 'nome_torneio', 'data_inicio', 'hora_inicio', 'valor_premio')
                .where({ id_torneio })  // Filtra pelo ID
                .first();  // Pega o primeiro (único) resultado

            if (!torneio) {
                return response.status(404).json({ message: 'Torneio não encontrado' });
            }

            response.json(torneio);
        } catch (error) {
            console.error("Erro ao buscar o torneio:", error);
            response.status(500).json({ error: "Erro ao buscar torneio" });
        }
    }
}

module.exports = new TorneioController();