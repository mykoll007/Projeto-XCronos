document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.nav-link'); // Todos os links
    const activePage = localStorage.getItem('activePage'); // Recupera a página ativa do localStorage

    // Se uma página ativa estiver armazenada no localStorage, aplicamos a classe active
    if (activePage) {
        links.forEach(link => {
            // Verifica se o link corresponde à página ativa e aplica a classe active
            if (link.getAttribute('href') === activePage) {
                link.querySelector('.linha-teto').classList.add('active');
            }
        });
    }

    // Adiciona o evento de clique para todos os links
    links.forEach(link => {
        link.addEventListener('click', function() {
            // Salva a URL da página clicada no localStorage
            localStorage.setItem('activePage', link.getAttribute('href'));
        });
    });
});
