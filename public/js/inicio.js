async function getChampions() {
    try {
        const response = await fetch("https://ddragon.leagueoflegends.com/cdn/14.4.1/data/pt_BR/champion.json");
        const data = await response.json();

        const champions = data.data;
        const container = document.getElementById("champion-container");

        // Encontre o template de slide
        const templateSlide = container.querySelector(".template-slide");

        // Itera sobre os campeões e preenche as informações
        for (const champ in champions) {
            const { id, name, title } = champions[champ];

            // Clone o slide template
            const slide = templateSlide.cloneNode(true);
            slide.style.display = "block"; // Exibe o slide clonado

            // Preenche os dados do campeão
            const card = slide.querySelector(".card");

            const img = card.querySelector(".champion-img");
            img.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${id}_0.jpg`;
            img.alt = `Imagem de ${name}`;

            const nameElement = card.querySelector(".desc-nome");
            nameElement.textContent = name;

            const titleElement = card.querySelector(".desc-titul");
            titleElement.textContent = title;

            // Adiciona o evento de clique para salvar o id do campeão no localStorage e redirecionar
            card.addEventListener("click", () => {
                localStorage.setItem("selectedChampion", id);
                window.location.href = "champ.html"; 
            });

            // Adiciona o slide preenchido ao container
            container.appendChild(slide);
        }

        // Inicializar o Swiper.js
        new Swiper(".swiper-container", {
            loop: true,  // Faz o carrossel continuar em loop
            speed: 2500, // Velocidade do movimento (quanto maior, mais lento)
            autoplay: {
                delay: 0, // Remove o delay entre os movimentos
                disableOnInteraction: false, // Não desativa o autoplay ao interagir
            },
            slidesPerView: "auto",
            spaceBetween: 20,
            centeredSlides: true,
            allowTouchMove: true, // Permite que o usuário deslize
            freeMode: true, // Faz o carrossel deslizar sem parar
            freeModeMomentum: true, // Mantém a velocidade constante após a interação
            freeModeMomentumRatio: 0.5, // Ajuste da desaceleração após interação
            freeModeSticky: true, // Faz com que os slides "grudem" em posições mais próximas
        });

    } catch (error) {
        console.error("Erro ao buscar campeões:", error);
    }
}

// Chamar a função quando a página carregar
document.addEventListener("DOMContentLoaded", getChampions);
