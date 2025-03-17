//Section 1
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

$(document).ready(function(){
    $('.carousel-rune').slick({
        infinite: false, // Faz o loop infinito
        slidesToShow: 5, // Exibe 5 slides por vez
        slidesToScroll: 2, // Move 2 slides por vez  // Tempo de 2 segundos entre os slides
        speed: 500,
        centerMode: false, // Remove o espaço extra nas laterais
        variableWidth: false, // Mantém largura fixa dos slides
        responsive: [
            {
                breakpoint: 1561, // Para telas menores que 1024px
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 768, // Para telas menores que 768px
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480, // Para telas menores que 480px
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }
        ]
    });
});
// Chamar a função para atualizar os campeões da API quando a página carregar
document.addEventListener("DOMContentLoaded", getChampions);

//Section 2

// Função para trocar a imagem e a descrição ao clicar na classe (Classes de Campeões)
const classData = {
    "funcao-suporte.png": { img: "suporte-classe.png", name: "Lulu", desc: "Suporte: Campeões que auxiliam seus aliados com habilidades de cura, escudos, controle de grupo ou aumento de poder, focados em ajudar a equipe a vencer.", width: "215px" },
    "funcao-mago.png": { img: "mago-classe.png", name: "Veigar", desc: "Mago: Campeões com habilidades de longo alcance, especializados em causar dano mágico em área ou em alvos individuais, muitas vezes com controle de grupo.", width: "300px" },
    "funcao-lutador.png": { img: "lutador-classe.png", name: "Yasuo", desc: "Lutadores em League of Legends são campeões equilibrados, com boa resistência e capacidade de causar dano, sendo eficazes em combates prolongados e duelos um-a-um.", width: "300px" },
    "funcao-atirador.png": { img: "atirador-classe.png", name: "Jinx", desc: "Atirador: Campeões focados em dano a distância, geralmente fragilizados, mas com alto potencial de dano em lutas prolongadas.", width: "300px" },
    "funcao-assassino.png": { img: "assassino-classe.png", name: "Akali", desc: "Assassino: Campeões ágeis e letais, focados em eliminar rapidamente alvos frágeis, geralmente causando grande dano de burst.", width: "300px" },
    "funcao-tanque.png": { img: "tanque-classe.png", name: "Leona", desc: "Tanque: Campeões com alta resistência e capacidade de absorver muito dano, sendo essenciais para proteger aliados e iniciar lutas.", width: "300px" }
};

const imgs = document.querySelectorAll(".classes-champ img");
const circleClasseImg = document.querySelector("#circle-classe img");
const nomePerson = document.querySelector("#nome-person");
const descClasse = document.querySelector("#desc-classe");

// Função para atualizar a classe selecionada
function updateClass(img) {
    const imgSrc = img.getAttribute("src").split("/").pop();
    if (classData[imgSrc]) {
        circleClasseImg.src = `../assets/${classData[imgSrc].img}`;
        circleClasseImg.style.width = classData[imgSrc].width;
        
        nomePerson.textContent = classData[imgSrc].name;
        descClasse.textContent = classData[imgSrc].desc;

        imgs.forEach(el => el.style.opacity = "50%");
        img.style.opacity = "100%";
    }
}

// Define a classe Lutador como padrão ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
    const defaultImg = document.querySelector('.classes-champ img[src*="funcao-lutador.png"]');
    if (defaultImg) updateClass(defaultImg);
});

// Adiciona evento de clique
imgs.forEach(img => img.addEventListener("click", () => updateClass(img)));



