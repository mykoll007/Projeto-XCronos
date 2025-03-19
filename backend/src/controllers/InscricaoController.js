const database = require('../database/connection')
const nodemailer = require('nodemailer');

 
class InscricaoController {
    inscrever(request, response) {
        const { id_usuario } = request.params;
        const { id_torneio, discord, nick_jogo } = request.body;
    

    
        let emailUsuario;
    
        database('usuarios')
            .where({ id_cadastro: id_usuario })
            .first()
            .then(usuario => {
                if (!usuario) {
                    return Promise.reject({ status: 404, message: 'Usuário não está logado.' });
                }
    
                emailUsuario = usuario.email;
    
                return database('torneios')
                    .where({ id_torneio: id_torneio })
                    .first()
                    .then(torneio => {

                        if (!torneio) {
                            return Promise.reject({ status: 404, message: 'Torneio não encontrado.' });
                        }

                        // Verifica se o usuário já está inscrito no torneio
                        return database('inscricoes')
                            .where({ id_usuario, id_torneio })
                            .first()
                            .then(inscricao => {
                                if (inscricao) {
                                    return Promise.reject({ status: 400, message: 'Você já está inscrito neste torneio.' });
                                }
    
                                // Realiza a inscrição
                                return database('inscricoes').insert({
                                    id_usuario,
                                    id_torneio,
                                    discord,
                                    nick_jogo
                                }).then(() => torneio);
                            });
                    });
            })
            .then(torneio => {

                const dataInicio = new Date(torneio.data_inicio).toLocaleDateString('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });

                const horaInicio = torneio.hora_inicio.split(':'); // Separando hora e minuto
                const horaFormatada = new Date(0, 0, 0, horaInicio[0], horaInicio[1]).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'America/Sao_Paulo',
                });

                const transporter = nodemailer.createTransport({
                    host: process.env.DB_HOST_EMAIL,
                    port: process.env.DB_PORT_EMAIL,
                    secure: false,
                    auth: {
                        user: process.env.DB_EMAILXCRONOS,
                        pass: process.env.DB_SENHAXCRONOS,
                    },
                    tls: {}
                });

                const mailOptions = {
                    from: process.env.DB_HOST_EMAIL,
                    to: emailUsuario,
                    subject: 'Confirmação de Inscrição no Torneio',
                    html: `
                        <h1>Confirmação de Inscrição</h1>
                        <p>Olá!</p>
                        <p>Você se inscreveu com sucesso no torneio: <strong>${torneio.nome_torneio}</strong>.</p>
                        <p>O torneio acontecerá no dia <strong>${dataInicio}</strong> às <strong>${horaFormatada}</strong>.</p>
                        <p>Para acompanhar a chave do torneio, todas as informações estarão disponíveis em nosso servidor. Acesse regularmente para ficar por dentro de atualizações e detalhes importantes sobre os confrontos.</p>
                        <p>Acompanhe pelo nosso servidor do discord: https://discord.gg/De8xvUaX7Q</p>
                    `,
                };

                return transporter.sendMail(mailOptions);
            })
            .then(() => {
                return response.status(201).json({ message: 'Inscrição realizada com sucesso! Um e-mail de confirmação foi enviado.' });
            })
            .catch(error => {
                if (error.status) {
                    return response.status(error.status).json({ message: error.message });
                }
                return response.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
            });
    }

    
}
module.exports = new InscricaoController();