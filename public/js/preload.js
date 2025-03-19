window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const content = document.getElementById('content');
    
    // Verificar se o usuário já visitou a página antes
    const isFirstVisit = localStorage.getItem('firstVisit');
    
    if (!isFirstVisit) {
        // Se for a primeira visita, exibe o preloader por 4 segundos
        setTimeout(() => {
            preloader.style.opacity = '0'; 
            setTimeout(() => {
                preloader.style.display = 'none'; 
                content.style.display = 'block'; 
            }, 500); 
        }, 4000); 
        
        // Marca a visita para que na próxima vez o preloader não apareça
        localStorage.setItem('firstVisit', 'false');
    } else {
        // Se não for a primeira visita, mostra o conteúdo sem o preloader
        preloader.style.display = 'none';
        content.style.display = 'block';
    }
});

