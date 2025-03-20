const database = require('../database/connection')

const bcrypt = require ('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');

class UserController{

    async cadastrarUsuario(request, response) {
        const { usuario, email, senha, confirmarSenha } = request.body;

        if (senha !== confirmarSenha) {
            return response.status(400).json({ message: "As senhas não coincidem." });
        }

        const senhaSegura = await bcrypt.hash(senha, 10);
        const codigoVerificacao = Math.floor(100000 + Math.random() * 900000);
    
        database.select('*').from('usuarios').where('usuario', usuario).orWhere('email', email).then(existeUsuario => {
                if (existeUsuario.length > 0) {
                    return response.status(400).json({ message: "Usuário ou e-mail já cadastrado." });
                }
                if (senha.length < 5) {
                    return response.status(400).json({ message: "A senha precisa ter no mínimo 5 caracteres."})
                     }    
    
                database.insert({ usuario, email, senha: senhaSegura, codigo_verificacao: codigoVerificacao }).table("usuarios").then(() => {

                    // Configura o transporter do Nodemailer
                    const transporter = nodemailer.createTransport({
                        host: process.env.DB_HOST_EMAIL,
                        port: process.env.DB_PORT_EMAIL,
                        secure: false,
                        auth: {
                            user: process.env.DB_EMAILXCRONOS,
                            pass: process.env.DB_SENHAXCRONOS,
                        }
                    })
                    // Configura o conteúdo do e-mail
                    const mailOptions = {
                        from: 'elojobxcronos@gmail.com',
                        to: email,
                        subject: 'Confirmação de Cadastro - XCrONOS',
                        html: `<p>Olá, ${usuario}!</p>
                               <p>Seu código de verificação é: <strong>${codigoVerificacao}</strong></p>
                               <p>Insira este código para confirmar seu cadastro na plataforma.</p>`
                    };
    
                    // Envia o e-mail para o usuário
                    transporter.sendMail(mailOptions)
                        .then(() => {
                            response.status(201).json({ message: "Usuário cadastrado com sucesso! Verifique seu e-mail para confirmar o cadastro." });
                        })
                        .catch((error) => {
                            response.status(500).json({ message: "Erro ao enviar e-mail de verificação." });
                        });
                })
                .catch((error) => {
                    response.status(500).json({ message: "Erro na execução da criação do usuário." });
                });
    
            }) // <-- Aqui fecha o then da verificação de usuário
            .catch((error) => {
                response.status(500).json({ message: "Erro ao verificar usuário existente." });
            });
        }

        async confirmarCodigo(request, response) {
            const { email, codigo } = request.body;
        
            database('usuarios')
                .where({ email, codigo_verificacao: codigo })
                .first()
                .then(usuario => {
                    if (!usuario) {
                        return response.status(400).json({ message: "Código de verificação inválido." });
                    }
        
                    database('usuarios')
                        .where({ email })
                        .update({ verificado: 1, codigo_verificacao: null }) // Limpa o código
                        .then(() => {
                            response.status(200).json({ message: "Conta verificada com sucesso!" });
                        })
                        .catch(error => {
                            console.error('Erro ao atualizar verificação:', error);
                            response.status(500).json({ message: "Erro ao confirmar o código de verificação." });
                        });
                })
                .catch(error => {
                    console.error('Erro ao buscar código de verificação:', error);
                    response.status(500).json({ message: "Erro na execução da busca do código." });
                });
        }
    

        async autenticarUsuario(request, response) {
            const { email, senha } = request.body;
        
            database.select('*').where({ email: email }).table("usuarios").then(async usuario => {
                if (!usuario[0])
                    return response.status(401).json({ message: "Login ou senha incorreta !" });
        
                const validarSenha = await bcrypt.compare(senha, usuario[0].senha);
        
                if (!validarSenha)
                    return response.status(401).json({ message: "Login ou senha incorreta !" });
        
                if (usuario[0].verificado === 0) {
                    return response.status(403).json({
                        message: "Conta não verificada. Insira o código enviado por e-mail.",
                        precisaVerificar: true
                    });
                }
        
                // Gerar o token com o id_cadastro no payload
                const token = jwt.sign({ id_cadastro: usuario[0].id_cadastro }, process.env.SALT, {
                    expiresIn: '1h'
                });
        
                response.status(200).json({ cod: 0, token });
            }).catch(error => {
                response.status(500).json({ message: "Erro ao tentar autenticar o usuário" });
            });
        }
        
    async reenviarCodigoVerificacao(request, response) {
        const { email } = request.body;
    
        try {
            const usuario = await database.select('*').from('usuarios').where('email', email).first();
    
            if (!usuario) {
                return response.status(404).json({ message: "Usuário não encontrado." });
            }
    
            if (usuario.verificado === 1) {
                return response.status(400).json({ message: "Esta conta já foi verificada." });
            }
    
            // Gerar um novo código de verificação
            const novoCodigoVerificacao = Math.floor(100000 + Math.random() * 900000);
    
            // Atualizar código no banco de dados
            await database('usuarios').where('email', email).update({ codigo_verificacao: novoCodigoVerificacao });
    
            // Configurar envio de e-mail
            const transporter = nodemailer.createTransport({
                host: process.env.DB_HOST_EMAIL,
                port: process.env.DB_PORT_EMAIL,
                secure: false,
                auth: {
                    user: process.env.DB_EMAILXCRONOS,
                    pass: process.env.DB_SENHAXCRONOS,
                }
            });
    
            const mailOptions = {
                from: 'elojobxcronos@gmail.com',
                to: email,
                subject: 'Reenvio do Código de Verificação - XCrONOS',
                html: `<p>Olá, ${usuario.usuario}!</p>
                       <p>Seu novo código de verificação é: <strong>${novoCodigoVerificacao}</strong></p>
                       <p>Insira este código para confirmar seu cadastro na plataforma.</p>`
            };
    
            await transporter.sendMail(mailOptions);
    
            return response.status(200).json({ message: "Novo código de verificação enviado com sucesso!" });
    
        } catch (error) {
            console.error("Erro ao reenviar código de verificação:", error);
            return response.status(500).json({ message: "Erro ao processar a solicitação." });
        }
    }
    
    async recuperarSenha(request, response) {
        const { email } = request.body;
    
        try {
            const usuario = await database('usuarios').where({ email }).first();
    
            if (!usuario) {
            return response.status(404).json({ message: "Email não encontrado!" });
            }
    
            // Gera um código de recuperação
            const codigoVerificacao = Math.floor(100000 + Math.random() * 900000); 
    
            // Armazena o código de recuperação no banco de dados 
            await database('usuarios').where({ email }).update({ codigo_verificacao: codigoVerificacao });
     
            const transporter = nodemailer.createTransport({
                host: process.env.DB_HOST_EMAIL,  
                port: process.env.DB_PORT_EMAIL,  
                secure: false,  
                auth: {
                    user: process.env.DB_EMAILXCRONOS, 
                    pass: process.env.DB_SENHAXCRONOS,  
                },
                tls: {
                },
            }); 
            const mailOptions = {
                from: process.env.DB_HOST_EMAIL, 
                to: email,  
                subject: 'Recuperação de Senha',  
                html: `<p>Seu código de recuperação de senha é: <strong>${codigoVerificacao}</strong></p>`,  
            };
    
            // Envia o e-mail para o usuário com o código
            await transporter.sendMail(mailOptions);
    
          return  response.status(200).json({ message: "Código de recuperação enviado para o seu e-mail!" });
    
        } catch (error) {
           return response.status(500).json({ message: "Erro ao tentar recuperar a senha!" });
        }
    }

    async confirmarCodigoRecuperacao(request, response) {
        const { email, codigo } = request.body;
    
        try {
            // Verifica se o código de verificação é válido para o e-mail fornecido
            const usuario = await database('usuarios')
                .where({ email, codigo_verificacao: codigo })
                .first();
    
            if (!usuario) {
                return response.status(400).json({ message: "Código de verificação inválido." });
            }
    
            // Limpa o código de verificação após confirmação
            await database('usuarios')
                .where({ email })
                .update({ codigo_verificacao: null });
    
            
            return response.status(200).json({ 
                message: "Conta verificada com sucesso!",
                email: usuario.email 
            });
    
        } catch (error) {
            console.error('Erro ao confirmar código de recuperação:', error);
            return response.status(500).json({ message: "Erro ao confirmar o código de recuperação." });
        }
    }
    
    async atualizarSenha(request, response) {
        const { email, senha } = request.body; 
    
        try {
            // Criptografa a nova senha
            const senhaSegura = await bcrypt.hash(senha, 10);
    
            // Atualiza a senha no banco de dados
            const atualizado = await database('usuarios')
                .where({ email })  // Usamos o email para identificar o usuário
                .update({ senha: senhaSegura });
    
            if (senha.length < 5) {
               return response.status(400).json({ message: "A senha precisa ter no mínimo 5 caracteres."})
                }    
            // Verifica se alguma linha foi realmente atualizada
            if (atualizado === 0) {
                return response.status(400).json({ message: "Usuário não encontrado ou senha não alterada." });
            }
    
            return response.status(200).json({ message: "Senha atualizada com sucesso!" });
        } catch (error) {
            console.error("Erro ao redefinir a senha:", error);
            return response.status(500).json({ message: "Erro ao redefinir a senha." });
        }
    }

    async deletarConta(request, response) {
        const { id } = request.body; // Agora você pega o ID do corpo da requisição
        
        try {
            // Verifica se o id foi passado
            if (!id) {
                return response.status(400).json({ message: 'id é necessário no corpo da requisição' });
            }
        
            // Excluir registros na tabela 'inscricoes' que estão vinculados ao id_cadastro
            const resultadoInscricoes = await database('inscricoes')
                .where('id_cadastro', id)  // Onde o id_cadastro for igual ao id do usuário
                .del();  // Deleta os registros
        
            if (resultadoInscricoes === 0) {
                console.log('Nenhum registro encontrado na tabela inscricoes para este usuário.');
            }
        
            // Deletar o usuário da tabela 'usuarios'
            const resultadoUsuario = await database('usuarios')
                .where('id_cadastro', id)  // Usa o id recebido no corpo da requisição
                .del();  // Deleta o usuário
        
            // Verifique o resultado
            if (resultadoUsuario === 0) {
                return response.status(404).json({ message: 'Usuário não encontrado' });
            } else {
                return response.status(200).json({ message: 'Conta deletada com sucesso!' });
            }
        } catch (error) {
            console.error('Erro ao deletar a conta:', error.message);
            return response.status(500).json({ message: 'Erro ao deletar a conta.' });
        }
    }
    
    
    

    



    listarUmUsuario(request, response) {
        const { id } = request.params;
        console.log(`Buscando usuário com ID: ${id}`); // Verifique o ID recebido
    
        database.where({ id_cadastro: id }).select('*').table('usuarios')
            .then(usuario => {
                if (usuario.length > 0) {
                    console.log('Usuário encontrado:', usuario[0]); // Verifique o que está retornando
                    response.status(200).json({ usuario: usuario[0] });
                } else {
                    console.log('Usuário não encontrado'); // Log se o usuário não for encontrado
                    response.status(404).json({ message: 'Usuário não encontrado' });
                }
            })
            .catch(error => {
                console.error('Erro ao buscar usuário:', error); // Log de erro
                response.status(500).json({ message: "Erro ao obter os dados do usuário" });
            });
    }
    




atualizarUsuario(request, response) {
    const { id } = request.params;
    const { email, usuario, telefone } = request.body;

    database('usuarios').where('email', email).andWhereNot('id_cadastro', id).first()
        .then(emailExistente => {
            if (emailExistente) {
                return response.status(400).json({ message: "Este email já está cadastrado!" });
            }

            return database('usuarios').where('usuario', usuario).andWhereNot('id_cadastro', id).first()
                .then(usuarioExistente => {
                    if (usuarioExistente) {
                        return response.status(400).json({ message: "Este nome de usuário já está em uso!" });
                    }

                    const dadosAtualizados = { usuario, email };

                    if (telefone) { dadosAtualizados.telefone = telefone }

                    database.where({ id_cadastro: id }).update(dadosAtualizados).table('usuarios')
                        .then(() => {
                            response.status(200).json({ message: "Atualizado com sucesso!" });
                        })
                        .catch(error => {
                            console.error(error);
                            response.status(500).json({ message: "Erro ao atualizar os dados do usuário" });
                        });
                });
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({ message: "Erro ao verificar os dados no banco de dados" });
        });
}




    
}

module.exports = new UserController();
