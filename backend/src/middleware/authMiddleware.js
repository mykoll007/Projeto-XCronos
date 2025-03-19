const jwt = require('jsonwebtoken');

function verificarToken(request, response, next) {
    // Pega o token do cabeçalho "Authorization"
    const token = request.header('Authorization')?.split(' ')[1];
    console.log('Cabeçalho Authorization:', request.headers['authorization']);

    // Se não houver token, retorna erro
    if (!token) {
        return response.status(401).json({ message: "Acesso não autorizado!" });
    }

    try {
        // Decodifica o token usando o SALT (chave secreta)
        const decodificado = jwt.verify(token, process.env.SALT);

        // Adiciona o id_cadastro do usuário na requisição para que possa ser utilizado nas rotas
        // Aqui, ajustamos para acessar 'id_cadastro' no payload
        request.id = decodificado.id_cadastro;  // Alterado para 'id_cadastro'

        // Chama a próxima função ou rota
        next();
    } catch (error) {
        // Se o token for inválido ou expirado, retorna erro
        response.status(401).json({ message: "Token inválido!" });
    }
}

module.exports = verificarToken;
