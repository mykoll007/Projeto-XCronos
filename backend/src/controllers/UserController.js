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
    

   async autenticarUsuario(request, response){
        const {email, senha} = request.body

        database.select('*').where({email: email}).table("usuarios").then(async usuario => {
            if(!usuario[0])
              return  response.status(401).json({message: "Login ou senha incorreta !"})

            const validarSenha = await bcrypt.compare(senha, usuario[0].senha)

            if(!validarSenha)
              return  response.status(401).json({message: "Login ou senha incorreta !"})

            if (usuario[0].verificado === 0) {
              return   response.status(403).json({ message: "Conta não verificada. Insira o código enviado por e-mail.",
                    precisaVerificar: true
                  });
            }

            const token = jwt.sign({id: usuario[0].id}, process.env.SALT, {
                expiresIn: '1h'
            })
            response.status(200).json({cod: 0, token})
            
        }).catch(error => {
            response.status(500).json({message: "Erro ao tentar autenticar o usuário"})
        })
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
                from: 'elojobxcronos@gmail.com', 
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

    async redefinirSenha(request, response){
        const {id} = request.params
        const {senha} = request.body
 
        const senhaSegura = await bcrypt.hash(senha, 10)
 
        database.where({id_cadastro: id}).update({senha: senhaSegura}).table('usuarios').then(usuario =>{
            response.json({message: "Senha atualizada com sucesso!"})
        }).catch(error => {
            response.status(500).json({message: "Erro ao redefinir a senha"})
        })
     }

    // Trazer info do Usuario
    listarUmUsuario(request, response) {
        const { id } = request.params
 
        database.where({ id_cadastro: id }).select('*').table('usuarios').then(usuario => {
            response.status(200).json({ usuario })
        }).catch(error => {
            response.status(500).json({message: "Erro ao obter os dados do usuário"})
        })
    }

    atualizarUsuario(request, response) {
        const { id } = request.params;  
        const { email, usuario, telefone } = request.body; 
    
        const dadosAtualizados = { usuario, email };
    
        // Se o telefone foi fornecido, adiciona ao objeto de dados
        if (telefone) { dadosAtualizados.telefone = telefone }
    
        database.where({ id_cadastro: id }).update(dadosAtualizados) .table('usuarios').then(() => {
                response.status(200).json({ message: "Usuário atualizado com sucesso!" });
            })
            .catch(error => { 
                response.status(500).json({ message: "Erro ao atualizar os dados do usuário" });
            });
    }

    
}

module.exports = new UserController();