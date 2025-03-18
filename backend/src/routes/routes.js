const connection = require('../database/connection')
const UserController = require('../controllers/UserController');
const InscricaoController = require('../controllers/InscricaoController')
const express = require('express');
const verificarToken = require('../middleware/authMiddleware');
const router = express.Router();


//Rotas Usuário

//Rotas para processos de cadastro, confirmar e logar
router.post('/usuario/cadastrar', UserController.cadastrarUsuario)
router.put('/usuario/confirmarconta', UserController.confirmarCodigo)
router.post('/usuario/reenviarcodigo', UserController.reenviarCodigoVerificacao)
router.post('/usuario/autenticar', UserController.autenticarUsuario)

router.get('/usuario/validar', verificarToken)

//Rotas para recuperar e redefinir senha
router.post('/usuario/recuperar', UserController.recuperarSenha)
router.put('/usuario/redefinir', UserController.confirmarCodigoRecuperacao)
router.put('/usuario/atualizarsenha', UserController.atualizarSenha)


//Rotas para o usuario atualizar seus dados
router.get('/usuario/:id', verificarToken, UserController.listarUmUsuario)
router.put('/usuario/atualizar/:id',verificarToken, UserController.atualizarUsuario)


//Rotas Inscrição Torneio
router.post('/inscrever/:id_usuario', verificarToken, InscricaoController.inscrever);


module.exports = router