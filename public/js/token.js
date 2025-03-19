// Função para fazer login
function login(email, senha) {
    fetch('https://projeto-x-cronos.vercel.app/usuario/autenticar', {
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


(function() {
    function verificarToken() {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Token ausente, redirecionando para a página de login...');
            window.location.href = 'index.html';
            return;
        }

        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const decoded = JSON.parse(atob(base64));

        const expDate = decoded.exp * 1000;
        const currentTime = Date.now();

        console.log('Token decodificado:', decoded);
        console.log('Data de expiração:', expDate);
        console.log('Tempo atual:', currentTime);

        if (currentTime > expDate) {
            console.log('Token expirado, redirecionando para a página de login...');
            window.location.href = 'index.html';
            return;
        }

        // Caso o token seja válido, continua no site
        console.log('Token válido!');
    }

    // Executa a verificação ao carregar o script
    verificarToken();
})();


