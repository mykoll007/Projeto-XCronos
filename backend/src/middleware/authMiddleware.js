const jwt = require('jsonwebtoken')
 
function verificarToken(request, response, next) {
    const token = request.header('Authorization')
 
    if(!token) return response.status(401).json({message: "Acesso não autorizado!"})
 
        try {
            const decodificar = jwt.verify(token, process.env.SALT)
            request.id = decodificar.id
            next()
       
        }catch (error) {
 
            response.status(401).json({message: "Token inválido!"})
        }
 
}
 
module.exports = verificarToken