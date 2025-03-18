// Função para fazer login
function login(email, senha) {
    fetch('http://localhost:4000/usuario/autenticar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.cod === 0 && data.token) {
            localStorage.setItem('token', data.token); // Armazenando o token no localStorage
            window.location.href = 'inicio.html'; // Redireciona para a página protegida
        } else {
            console.error('Erro no login:', data.message);
        }
    })
    .catch(error => {
        console.error('Erro ao tentar fazer login:', error);
    });
}



// Função para verificar se o token é válido
function verificarToken() {
    const token = localStorage.getItem('token'); // Pega o token do localStorage

    if (!token) {
        // Se não houver token, redireciona para a página index.html
        window.location.href = 'index.html';
        return;
    }

    // Fazendo uma requisição para o backend para validar o token
    fetch('http://localhost:4000/usuario/validar', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,  // Enviando o token corretamente no cabeçalho
        },
    })
    .then(response => {
        if (!response.ok) {
            // Se a resposta for inválida, redireciona para o index.html
            window.location.href = 'index.html';
        } else {
            // Caso o token seja válido, continue na página
            console.log('Token válido!');
        }
    })
    .catch(error => {
        // Se ocorrer um erro na requisição, redireciona
        console.error('Erro ao verificar o token:', error);
        window.location.href = 'index.html';
    });
}








// Chama a função de verificação ao carregar a página
verificarToken();