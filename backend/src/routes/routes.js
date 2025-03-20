const connection = require('../database/connection')
const UserController = require('../controllers/UserController');
const InscricaoController = require('../controllers/InscricaoController')
const TorneioController = require('../controllers/TorneioController')
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


//Rotas para o usuario atualizar seus dados e excluir
router.get('/usuario/:id',  UserController.listarUmUsuario);
router.put('/usuario/atualizar/:id',verificarToken, UserController.atualizarUsuario)
router.delete('/usuario/delete/:id', UserController.deletarConta);


//Rotas Inscrição Torneio
router.post('/inscrever/:id_usuario', verificarToken, InscricaoController.inscrever);


//Rotas Torneio
router.get('/torneios', TorneioController.getTorneios);
router.get('/torneios/:id_torneio', TorneioController.getTorneioById);

module.exports = router