const connection = require('../database/connection')
const UserController = require('../controllers/UserController');
const express = require('express');
const router = express.Router();

//Rotas para processos de cadastro, confirmar e logar
router.post('/usuario/cadastrar', UserController.cadastrarUsuario)
router.put('/usuario/confirmarconta', UserController.confirmarCodigo)
router.post('/usuario/reenviarcodigo', UserController.reenviarCodigoVerificacao)
router.post('/usuario/autenticar', UserController.autenticarUsuario)

//Rotas para recuperar e redefinir senha
router.post('/usuario/recuperar', UserController.recuperarSenha)
router.put('/usuario/atualizarsenha/:id', UserController.redefinirSenha)

//Rotas para o usuario atualizar seus dados
router.get('/usuario/:id', UserController.listarUmUsuario)
router.put('/usuario/atualizar/:id', UserController.atualizarUsuario)


module.exports = router