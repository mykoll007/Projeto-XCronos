const championRoles = {
    top: [
        "Aatrox","Camille", "Cho'gath","Darius",
        "Dr. Mundo","Fiora","Gangplank","Garen",
        "Gnar","Gragas","Gwen","Heimerdinger" ,
        "Illaoi", "Irelia", "Jax", "Jayce",
        "K'Sante","Kayle","Kennen", 
        "Kled", "Malphite","Mordekaiser", "Nasus", 
        "Olaf", "Ornn", "Pantheon","Quinn",
        "Renekton","Riven","Rumble", "Sett", 
        "Shen","Shyvana","Singed", "Sion",
        "Skarner", "Tahm Kench","Teemo", "Trundle", 
        "Tryndamere" ,"Urgot","Vladimir", "Volibear",
        "Warwick", "Wukong","Yone","Yorick", 
         "Zac" 
        
    ],
    jg: [
        "Amumu", "Elise", "Evelynn", "Fiddlesticks", "Gragas", 
        "Hecarim", "Ivern", "Jarvan IV", "Karthus", "Kayn", 
        "Kennen", "Lee Sin", "Lillia", "Maokai", "Master Yi", 
        "Morgana", "Nidalee", "Olaf", "Rengar", "Shaco", 
        "Sejuani", "Skarner", "Taliyah", "Trundle", "Udyr", 
        "Viego", "Warwick", "Wukong", "Zac", "Zed"
    ],
    mid: [
        "Ahri", "Akali", "Anivia", "Aurelion Sol", "Brand", 
        "Corki", "Diana", "Ekko", "Fizz", "Galio", 
      "Irelia", "Katarina", "Kassadin", 
        "Leblanc", "Lissandra", "Lux", "Malzahar", "Orianna", 
        "Qiyana", "Ryze", "Syndra", "Talon", "Twisted Fate", 
        "Viktor", "Vladimir", 
        "Veigar", "Yasuo", "Yone", "Zed", "Zilean", "Zoe"
    ],
    adc: [
        "Aphelios", "Ashe", "Caitlyn", "Draven", "Ezreal", 
        "Jhin", "Kai'sa", "Kog'Maw", "Miss Fortune", "Samira", 
        "Senna", "Sivir", "Tristana", "Twitch", "Varus", 
        "Vayne", "Zeri"
    ],
    sup: [
        "Alistar", "Bard", "Blitzcrank", "Brand", "Leona", 
        "Lulu", "Lux", "Morgana", "Nautilus", "Nami", 
        "Pyke", "Rakan", "Seraphine", "Senna", "Sona", 
        "Soraka", "Swain", "Thresh", "Yuumi", "Zilean", "Zyra"
    ]
};

async function getChampions() {
    try {
        const response = await fetch("https://ddragon.leagueoflegends.com/cdn/14.4.1/data/pt_BR/champion.json");
        const data = await response.json();
        const champions = data.data;

        const container = document.getElementById("align-champs");
        container.innerHTML = ""; // Limpa o conteúdo anterior

        // Adicionar todos os campeões ao container inicialmente
        for (const champ in champions) {
            const { id, name, title, tags } = champions[champ];

            // Criar o card para o campeão
            const card = document.createElement("div");
            card.classList.add("cards-champ");

            const img = document.createElement("img");
            img.classList.add("champions-img");
            img.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${id}_0.jpg`;
            img.alt = `Imagem de ${name}`;

            const nameElement = document.createElement("p");
            nameElement.classList.add("desc-nome");
            nameElement.textContent = name;

            const titleElement = document.createElement("p");
            titleElement.classList.add("desc-titul");
            titleElement.textContent = title;

            card.appendChild(img);
            card.appendChild(nameElement);
            card.appendChild(titleElement);

            container.appendChild(card);
        }

        container.classList.add("grid-view");

    } catch (error) {
        console.error("Erro ao buscar campeões:", error);
    }
}

let currentRole = null;  // Variável para armazenar a role atualmente selecionada

// Função para aplicar borda na imagem da role(posição) clicada
function toggleOrangeBorderToRole(role) {
    const roleImages = document.querySelectorAll("#roles img");
    roleImages.forEach(img => {
        if (img.dataset.role === role) {
            if (img.style.border === "5px solid darkorange") {
                img.style.border = ""; // Remove a borda se já estiver aplicada
            } else {
                img.style.border = "5px solid darkorange"; // Adiciona a borda laranja se não estiver
               img.style.borderRadius = "19px";
            }
        } else {
            img.style.border = ""; // Remove a borda das outras imagens
        }
    });
}

// Função para o usuário escolher as role(posição) que quer ver
async function getChampionsByRole(role) {
    
    if (currentRole === role) {
        // Se a mesma role for clicada novamente, chama a função que retorna todos os campeões
        getChampions();
        toggleOrangeBorderToRole(role);
        currentRole = null; // Reseta a role atual
    } else {
        toggleOrangeBorderToRole(role); // Aplica a borda laranja na imagem da role clicada
        currentRole = role; // Atualiza a role atual
    }

    const champions = championRoles[role];
    const container = document.getElementById("align-champs");
    container.innerHTML = ""; // Limpa o conteúdo anterior

    if (champions) {
        // Obtém os dados dos campeões
        try {
            const response = await fetch("https://ddragon.leagueoflegends.com/cdn/14.4.1/data/pt_BR/champion.json");
            const data = await response.json();
            const allChampions = data.data;

            champions.forEach(championName => {
                const championData = allChampions[normalizeChampionName(championName)];

                if (championData) {
                    const { id, name, title } = championData;

                    // Criar o card para o campeão
                    const card = document.createElement("div");
                    card.classList.add("cards-champ");

                    const img = document.createElement("img");
                    img.classList.add("champions-img");
                    img.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${id}_0.jpg`;
                    img.alt = `Imagem de ${name}`;

                    const nameElement = document.createElement("p");
                    nameElement.classList.add("desc-nome");
                    nameElement.textContent = name;

                    const titleElement = document.createElement("p");
                    titleElement.classList.add("desc-titul");
                    titleElement.textContent = title;

                    card.appendChild(img);
                    card.appendChild(nameElement);
                    card.appendChild(titleElement);

                    container.appendChild(card);
                }
            });

            container.classList.add("grid-view");

        } catch (error) {
            console.error("Erro ao buscar campeões:", error);
        }
    }
}


// Função para normalizar o nome dos campeões para a URL
function normalizeChampionName(champion) {
    return champion
        .replace(/ /g, "")  // Remove espaços
        .replace("é", "e")  // Substitui acentos
        .replace("ã", "a")
        .replace("í", "i")
        .replace("ó", "o")
        .replace("ç", "c")
        .replace("&", "and")  // Substitui o "&" por "and"
        .replace(".", "")
        .replace("Wukong", "MonkeyKing")
        .replace("'", "");   // Remove apóstrofos (se existirem)
}



// Adiciona ouvintes de clique para as imagens das roles
function addRoleClickListeners() {
    const roleImages = document.querySelectorAll("#roles img");

    roleImages.forEach(image => {
        image.addEventListener("click", function () {
            const role = image.getAttribute("data-role");
            getChampionsByRole(role); // Filtra os campeões pela role clicada
        });
    });
}

// Chama a função para adicionar os ouvintes de clique
addRoleClickListeners();

// Carrega todos os campeões inicialmente
getChampions();













// Função para subir a página
const backToTop = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
});

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});



