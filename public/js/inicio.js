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


//Section 3

const regioes = {
    noxus: {
        img: "../assets/noxus.png",
        fundo: "../assets/fundo-noxus.png",
        titulo: "Noxus",
        descricao: "Império expansionista e brutal",
        texto: "Noxus é um império expansionista brutal; entretanto, aqueles que conseguem enxergar além de seu exterior bélico encontram uma sociedade excepcionalmente inclusiva. Qualquer um pode conquistar uma posição de poder e respeito se demonstrar a aptidão necessária, independentemente de classe social, antecedentes ou riquezas.",
        personagens: [
            { nome: "Darius", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Darius.png" },
            { nome: "Swain", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Swain.png" },
            { nome: "Katarina", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Katarina.png" },
            { nome: "Draven", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Draven.png" },
            { nome: "Riven", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Riven.png" },
            { nome: "Briar", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Briar.png" },
            { nome: "Cassiopeia", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Cassiopeia.png" },
            { nome: "Kled", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Kled.png" },
            { nome: "LeBlanc", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Leblanc.png" },
            { nome: "Mordekaiser", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Mordekaiser.png" },
            { nome: "Rell", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Rell.png" },
            { nome: "Samira", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Samira.png" },
            { nome: "Sion", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Sion.png" },
            { nome: "Talon", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Talon.png" },
            { nome: "Vladimir", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Vladimir.png" }
        ]
    },
    demacia: {
        img: "../assets/demacia.png",
        fundo: "../assets/fundo-demacia.png",
        titulo: "Demacia",
        descricao: "Um orgulhoso reino militar",
        texto: "Demacia é um reino altivo e legítimo com uma prestigiosa história militar. Fundada após as Guerras Rúnicas para ser um local livre de qualquer magia, alguns sugerem que a era dourada de Demacia já passou, a menos que a cidade se mostre capaz de se adaptar ao novo mundo. Autossuficiente e agrária, sua sociedade é inerentemente defensiva e insular, valorizando a justiça, a honra e o dever acima de tudo.",
        personagens: [
            { nome: "Garen", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Garen.png" },
            { nome: "Lux", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Lux.png" },
            { nome: "Jarvan IV", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/JarvanIV.png" },
            { nome: "Vayne", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Vayne.png" },
            { nome: "Fiora", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Fiora.png" },
            { nome: "Galio", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Galio.png" },
            { nome: "Kayle", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Kayle.png" },
            { nome: "Lucian", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Lucian.png" },
            { nome: "Morgana", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Morgana.png" },
            { nome: "Poppy", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Poppy.png" },
            { nome: "Quinn", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Quinn.png" },
            { nome: "Shyvana", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Shyvana.png" },
            { nome: "Sona", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Sona.png" },
            { nome: "Sylas", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Sylas.png" },
            { nome: "Xin Zhao", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/XinZhao.png" }
        ]
    },
    shurima: {
        img: "../assets/shurima.png",  // Caminho para a imagem de Shurima
        fundo: "../assets/fundo-shurima.png",  // Caminho para o fundo de Shurima
        titulo: "Shurima",
        descricao: "Império antigo e deserto místico",
        texto: "Shurima já foi uma civilização próspera que ocupava grande parte do continente do sul, mas foi deixada em ruínas após a queda de seu deus-imperador. Por milênios, contos de sua antiga glória se tornaram mitos e rituais. Agora, seus habitantes nômades ganham a vida a muito custo nos desertos ou recorrem ao trabalho mercenário. Ainda assim, alguns ousam sonhar com o retorno de seu antigo estilo de vida.",
        personagens: [
            { nome: "Azir", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Azir.png" },
            { nome: "Nasus", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Nasus.png" },
            { nome: "Renekton", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Renekton.png" },
            { nome: "Sivir", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Sivir.png" },
            { nome: "Taliyah", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Taliyah.png" },
            { nome: "Akshan", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Akshan.png" },
            { nome: "Amumu", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Amumu.png" },
            { nome: "K'Sante", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/KSante.png" },
            { nome: "Naafiri", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Naafiri.png" },
            { nome: "Rammus", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Rammus.png" },
            { nome: "Xerath", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Xerath.png" }
        ]
    },
    aguassentina: {
        img: "../assets/aguassentina.png",
        fundo: "../assets/fundo-aguassentina.png",
        titulo: "Águas de Sentina",
        descricao: "Cidade portuária sem lei",
        texto: "Águas de Sentina é uma cidade de porto como nenhuma outra, lar de caçadores de monstros, gangues portuárias, população indígena e comerciantes do mundo todo. Quase tudo pode ser comprado aqui, desde tecnologia Hextec contrabandeada até favores de senhores do crime local. Não existe lugar melhor para alcançar fama e fortuna, embora a morte esteja à espreita em cada beco e a lei seja praticamente inexistente.",
        personagens: [
            { nome: "Miss Fortune", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/MissFortune.png" },
            { nome: "Gangplank", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Gangplank.png" },
            { nome: "Twisted Fate", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/TwistedFate.png" },
            { nome: "Pyke", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Pyke.png" },
            { nome: "Graves", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Graves.png" },
            { nome: "Fizz", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Fizz.png" },
            { nome: "Illaoi", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Illaoi.png" },
            { nome: "Nautilus", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Nautilus.png" },
            { nome: "Tahm Kench", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/TahmKench.png" }
        ]
    },
    ilhadassombras: {
        img: "../assets/ilhadassombras.png",
        fundo: "../assets/fundo-ilhadassombras.png",
        titulo: "Ilhas das Sombras",
        descricao: "Regiões envoltas pela Névoa Negra",
        texto: "A Ilhas das Sombras já foi um belo reino, bem antes de ser devastado por um cataclisma mágico. Agora, a Névoa Negra cobre permanentemente o solo, manchando e corrompendo tudo com sua feitiçaria maligna. Aqueles que perecem sob seu efeito ficam condenados a fazer parte da Névoa Negra por toda a eternidade… e pior ainda, a cada ano ela estende seu alcance para ceifar ainda mais almas em Runeterra.",
        personagens: [
            { nome: "Hecarim", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Hecarim.png" },
            { nome: "Thresh", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Thresh.png" },
            { nome: "Karthus", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Karthus.png" },
            { nome: "Elise", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Elise.png" },
            { nome: "Gwen", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Gwen.png" },
            { nome: "Kalista", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Kalista.png" },
            { nome: "Maokai", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Maokai.png" },
            { nome: "Vex", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Vex.png" },
            { nome: "Viego", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Viego.png" },
            { nome: "Yorick", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Yorick.png" }
        ]
    },
    targon: {
        img: "../assets/targon.png",
        fundo: "../assets/fundo-targon.png",
        titulo: "Targon",
        descricao: "Cadeia de montanhas ocidentais",
        texto: "Região montanhosa e escassamente habitada a oeste de Shurima, o Targon é o pico mais alto de toda Runeterra. Afastado da civilização, o Monte Targon é praticamente inalcançável, e só aqueles peregrinos com profundo desejo e intensa determinação conseguem chegar ao topo. Os poucos que conseguem sobreviver à escalada voltam atormentados, vazios por dentro ou transformados a ponto de não serem mais reconhecidos.",
        personagens: [
            { nome: "Aphelios", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Aphelios.png" },
            { nome: "Aurelion Sol", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/AurelionSol.png" },
            { nome: "Diana", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Diana.png" },
            { nome: "Leona", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Leona.png" },
            { nome: "Pantheon", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Pantheon.png" },
            { nome: "Soraka", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Soraka.png" },
            { nome: "Taric", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Taric.png" },
            { nome: "Zoe", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Zoe.png" }
        ]
    },
    ionia: {
        img: "../assets/ionia.png",
        fundo: "../assets/fundo-ionia.png",
        titulo: "Ionia",
        descricao: "As Primeiras Terras",
        texto: "Conhecida como as Primeiras Terras, Ionia é um ilha-continente dotada de beleza natural e magia. Seus habitantes, que vivem em províncias livremente agrupadas, são um povo espiritual sempre em busca de harmonia com o mundo. Eles se mantinham predominantemente neutros até que suas terras foram invadidas por Noxus. Essa brutal ocupação forçou Ionia a reavaliar seu lugar no mundo, e seu futuro permanece indeterminado.",
        personagens:[
            { nome: "Ahri", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Ahri.png" },
            { nome: "Akali", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Akali.png" },
            { nome: "Irelia", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Irelia.png" },
            { nome: "Karma", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Karma.png" },
            { nome: "Kennen", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Kennen.png" },
            { nome: "Lee Sin", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/LeeSin.png" },
            { nome: "Master Yi", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/MasterYi.png" },
            { nome: "Rakan", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Rakan.png" },
            { nome: "Sett", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Sett.png" },
            { nome: "Shen", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Shen.png" },
            { nome: "Syndra", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Syndra.png" },
            { nome: "Varus", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Varus.png" },
            { nome: "Xayah", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Xayah.png" },
            { nome: "Yasuo", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Yasuo.png" },
            { nome: "Yone", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Yone.png" },
            { nome: "Zed", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Zed.png" },
            { nome: "Lilia", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Lillia.png" },
            { nome: "Wukong", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/MonkeyKing.png" },
            { nome: "Jhin", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Jhin.png" },
            { nome: "Kayn", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Kayn.png" },
            { nome: "Ivern", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Ivern.png" }
        ]
        
        
    },
    freljord: {
        img: "../assets/freljord.png",
        fundo: "../assets/fundo-freljord.png",
        titulo: "Freljord",
        descricao: "Terras gélidas severas",
        texto: "Freljord é uma terra hostil e impiedosa, onde os semideuses caminham entre as pessoas, e os indivíduos já nascem guerreiros. Apesar da abundância de tribos independentes, as três maiores são a Avarosianos, a Garra do Inverno e a Praeglacius, cada uma moldada única e exclusivamente pela vontade de sobreviver. Lá é também o único lugar em toda a Runeterra onde o Gelo Verdadeiro pode ser encontrado.",
        personagens: [
            { nome: "Ashe", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Ashe.png" },
            { nome: "Sejuani", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Sejuani.png" },
            { nome: "Lissandra", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Lissandra.png" },
            { nome: "Braum", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Braum.png" },
            { nome: "Trundle", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Trundle.png" },
            { nome: "Anivia", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Anivia.png" },
            { nome: "Gnar", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Gnar.png" },
            { nome: "Gragas", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Gragas.png" },
            { nome: "Nunu", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Nunu.png" },
            { nome: "Olaf", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Olaf.png" },
            { nome: "Ornn", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Ornn.png" },
            { nome: "Tryndamere", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Tryndamere.png" },
            { nome: "Udyr", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Udyr.png" },
            { nome: "Volibear", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Volibear.png" }
        ]
    },
    piltoverzaun: {
        img: "../assets/piltoverzaun.png",
        fundo: "../assets/fundo-piltover-zaun.png",
        titulo: "Piltover & Zaun",
        descricao: "Cidades-estados duplas",
        texto: "Dupla de Cidades-Estado que controlam a maior parte das rotas de comércio entre Valoran e Shurima. Lar de inventores visionários e de seus ricos patrocinadores, onde a desigualdade social vem se tornando cada vez mais perigosa.",
        personagens: [
            { nome: "Jinx", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Jinx.png" },
            { nome: "Vi", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Vi.png" },
            { nome: "Ekko", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Ekko.png" },
            { nome: "Caitlyn", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Caitlyn.png" },
            { nome: "Heimerdinger", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Heimerdinger.png" },
            { nome: "Camille", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Camille.png" },
            { nome: "Ezreal", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Ezreal.png" },
            { nome: "Jayce", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Jayce.png" },
            { nome: "Orianna", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Orianna.png" },
            { nome: "Seraphine", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Seraphine.png" },
            { nome: "Blitzcrank", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Blitzcrank.png" },
            { nome: "Dr. Mundo", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/DrMundo.png" },
            { nome: "Janna", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Janna.png" },
            { nome: "Renata Glasc", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Renata.png" },
            { nome: "Singed", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Singed.png" },
            { nome: "Twitch", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Twitch.png" },
            { nome: "Urgot", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Urgot.png" },
            { nome: "Viktor", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Viktor.png" },
            { nome: "Warwick", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Warwick.png" },
            { nome: "Zac", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Zac.png" },
            { nome: "Ziggs", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Ziggs.png" },
            { nome: "Zeri", img: "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/Zeri.png" }
        ]
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("open-modalrune");
    const loader = document.getElementById("loader");
    const conteudo = document.getElementById("conteudo");
    const blockArrow = document.getElementById("block-arrow");
    const cards = document.querySelectorAll(".card-rune");

    const toggleScroll = (state) => {
        document.body.style.overflow = state ? "hidden" : "";
    };

    const openModal = (regiao) => {
        if (regioes[regiao]) {
            const info = regioes[regiao];
            document.querySelector("#modal-runeterra h3").textContent = info.titulo;
            document.getElementById("desc-rune").textContent = info.descricao;
            document.getElementById("text-rune").textContent = info.texto;
            document.getElementById("modal-runeterra").style.backgroundImage = `url(${info.fundo})`;
            document.getElementById("logo-runeterra").src = info.img;

            const alignImgsRune = document.getElementById("align-imgsRune");
            alignImgsRune.innerHTML = "";

            let imagensCarregadas = 0;
            const totalImagens = info.personagens.length;

            info.personagens.forEach(p => {
                const img = document.createElement("img");
                img.src = p.img;
                img.alt = p.nome;

                img.onload = () => {
                    imagensCarregadas++;
                    if (imagensCarregadas === totalImagens) {
                        loader.style.display = "none"; 
                        conteudo.style.display = "flex"; 
                        conteudo.style.justifyContent = "center";
                    }
                };

                alignImgsRune.appendChild(img);
            });

            modal.style.display = "flex";
            loader.style.display = "block"; 
            conteudo.style.display = "none"; 
            toggleScroll(true);

            // Adiciona um estado de histórico para evitar o botão de voltar
            history.pushState({ modalAberto: true }, null, "");            

        }
    };

    const closeModal = () => {
        modal.style.display = "none";
        toggleScroll(false);

        // Remove o estado do histórico ao fechar o modal
        history.replaceState(null, "", location.href);        
    };

    // Adiciona evento nos cards para abrir o modal
    cards.forEach(card => card.addEventListener("click", () => openModal(card.getAttribute("data-region"))));

    // Fecha o modal ao clicar na seta de fechar
    blockArrow.addEventListener("click", closeModal);

    // Fecha o modal ao clicar fora dele
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    // Impede o botão de voltar
    window.addEventListener("popstate", (event) => {
        if (event.state && event.state.modalAberto) {
            // Bloqueia a navegação (não deixa voltar)
            history.pushState({ modalAberto: true }, null, "");
        }
    });

});




// Section 5
// Função para trocar a imagem
function changeImage() {
    const imgElement = document.getElementById('champ-marketing');
    
    // Verifica o tamanho da janela e troca a imagem
    if (window.innerWidth <= 637) {
        imgElement.src = '../assets/teemo-marketing.png'; // Troque pela URL da nova imagem
    } else {
        imgElement.src = '../assets/ashe-marketing.png'; // Se a tela for maior, volta para a imagem original
    }
}
// Espera o carregamento completo da página
    window.onload = function() {
    changeImage(); // Troca a imagem assim que a página é carregada
};

// Ajusta a imagem quando a janela for redimensionada
    window.onresize = function() {
    changeImage();
};




//Carrossel Slick
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
                    slidesToScroll: 2,
                    variableWidth: true

                }
            },
            {
                breakpoint: 768, // Para telas menores que 768px
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    variableWidth: true
                }
            },
            {
                breakpoint: 480, // Para telas menores que 480px
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    variableWidth: true
                }
            }
        ]
    });
});



