//Transição suave ao descer
document.getElementById("editar").addEventListener("click", function() {
    var sectionForm = document.getElementById("section-form");

    // Se a div não estiver visível, mostramos e animamos a altura
    if (sectionForm.style.height === "0px" || sectionForm.style.height === "") {
        sectionForm.style.display = "block"; // Faz a div ser exibida
        setTimeout(function() {
            sectionForm.style.height = "365px"; // Ajuste a altura conforme o conteúdo
        }, 10); // Espera um pequeno intervalo para o display ser aplicado
    } else {
        // Se a div já estiver visível, animamos o fechamento
        sectionForm.style.height = "0px"; // A altura vai ser reduzida
        setTimeout(function() {
            sectionForm.style.display = "none"; // Esconde a div após a animação
        }, 500); // Tempo de duração da animação
    }
});

// perfil.js



document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html'; // Caso não tenha token, redireciona para a página de login
        return;
    }

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const decoded = JSON.parse(atob(base64));

    const usuarioId = decoded.id_cadastro;

    if (!usuarioId) {
        console.error('ID do usuário não encontrado no token');
        return;
    }

    fetch(`http://localhost:4000/usuario/${usuarioId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.usuario) {
            // Exibe os dados do usuário na página
            document.getElementById('usuario-desc').innerText = data.usuario.usuario;
            document.getElementById('email-desc').innerText = data.usuario.email;
            document.querySelector('input[name="usuario"]').value = data.usuario.usuario;
            document.querySelector('input[name="email"]').value = data.usuario.email;
            document.querySelector('input[name="telefone"]').value = data.usuario.telefone || '';
        } else {
            console.error('Erro ao carregar os dados do usuário');
        }
    })
    .catch(error => {
        console.error('Erro ao tentar obter os dados do usuário:', error);
    });

    // Evento de submissão do formulário
    document.querySelector('form').addEventListener('submit', function(event) {
        event.preventDefault(); // Evita o envio padrão do formulário
    
        // Obtém os dados do formulário
        const usuario = document.querySelector('input[name="usuario"]').value;
        const email = document.querySelector('input[name="email"]').value;
        const telefone = document.querySelector('input[name="telefone"]').value;
    
        fetch(`http://localhost:4000/usuario/atualizar/${usuarioId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ usuario, email, telefone })
        })
        .then(response => response.json())
        .then(data => {
            const mensagemElemento = document.getElementById('mensagem-atualizada');
            
            if (data.message === "Usuário atualizado com sucesso!") {
                mensagemElemento.innerText = data.message;
                mensagemElemento.style.color = 'lawngreen';
                
                // Atualiza os valores exibidos na página apenas em caso de sucesso
                document.getElementById('usuario-desc').innerText = usuario;
                document.getElementById('email-desc').innerText = email;
            } else if (data.message === "Este email já está cadastrado!" || data.message === "Este nome de usuário já está em uso!") {
                mensagemElemento.style.color = 'red';
                mensagemElemento.innerText = data.message;
            
                // Limpar apenas o campo que gerou o erro
                if (data.message === "Este email já está cadastrado!") {
                    document.querySelector('input[name="email"]').value = ''; // Limpa campo de email
                    document.querySelector('.align-input input[name="email"]').style.border = '2px solid red'; // Borda vermelha no email
                    document.querySelector('.align-input input[name="usuario"]').style.border = ''; // Remove a borda do usuário
                } else if (data.message === "Este nome de usuário já está em uso!") {
                    document.querySelector('input[name="usuario"]').value = ''; // Limpa campo de usuário
                    document.querySelector('.align-input input[name="usuario"]').style.border = '2px solid red'; // Borda vermelha no usuário
                    document.querySelector('.align-input input[name="email"]').style.border = ''; // Remove a borda do email
                }
            }
            else {
                alert('Erro ao atualizar os dados');
            }
        })
        .catch(error => {
            console.error('Erro ao tentar atualizar os dados:', error);
            alert('Erro ao atualizar os dados');
            
            // Limpar os valores dos campos do formulário em caso de erro
            document.querySelector('input[name="usuario"]').value = ''; // Limpa campo de usuário
            document.querySelector('input[name="email"]').value = ''; // Limpa campo de email
            document.querySelector('input[name="telefone"]').value = ''; // Limpa campo de telefone
        });
    });
    
    
});

//Logout
document.getElementById('logout').addEventListener('click', function() {
    // Remover o token do localStorage
    localStorage.removeItem('token');

    // Redirecionar o usuário para a página de login
    window.location.href = 'index.html';
});







