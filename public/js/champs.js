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
        "Amumu", "Bel'veth", "Briar", "Diana", "Ekko", 
        "Elise", "Evelynn", "Fiddlesticks", "Gragas", "Graves", 
        "Hecarim", "Ivern", "Jarvan IV", "Karthus", "Kayn", 
        "Kha'zix", "Kindred", "Lee Sin", "Lillia", "Master Yi", 
        "Nidalee", "Nocturne", "Nunu", "Pantheon", "Rammus", 
        "Rek'Sai", "Rengar", "Sejuani", "Shaco", "Shyvana",    
        "Skarner", "Talon", "Udyr" , "Vi", "Viego", "Volibear",
        "Warwick","Wukong", "Xin Zhao" , "Zac", "Zyra"
    ],
    mid: [
        "Ahri", "Akali", "Akshan", "Anivia", "Annie", 
        "Aurelion Sol","Azir", "Cassiopeia", "Diana", "Ekko", 
        "Fizz", "Galio", "Hwei","Irelia","Kassadin", "Katarina", 
        "Leblanc", "Lissandra", "Lux", "Malzahar", "Naafiri", 
        "Orianna", "Qiyana", "Ryze", "Sylas", "Syndra", 
        "Taliyah", "Talon","Twisted Fate", 
        "Veigar", "Vex", "Viktor", "Vladimir", "Xerath",
        "Yasuo", "Yone", "Zed", "Zoe"
    ],
    adc: [
        "Aphelios", "Ashe", "Caitlyn","Corki", "Draven", "Ezreal", 
        "Jhin", "Jinx", "Kai'sa", "Kalista",
        "Kog'Maw","Lucian", "Miss Fortune","Nilah",
        "Samira", "Sivir", "Smolder", "Tristana",
        "Twitch", "Varus", "Vayne","Xayah", "Zeri" , 
        "Ziggs"
    ],
    sup: [
        "Alistar", "Bard", "Blitzcrank", "Brand", "Braum", 
        "Janna", "Karma", "Leona", "Lulu", "Lux", 
        "Maokai", "Milio", "Morgana", "Nami", "Nautilus", 
        "Neeko", "Pantheon", "Poppy", "Pyke", "Rakan", "Rell",
        "Renata", "Senna", "Seraphine", "Sona", "Soraka", "Swain",
        "Tahm Kench", "Taric", "Thresh", "Vel'koz", "Xerath", "Yuumi",
        "Zilean", "Zyra"
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
            card.dataset.champion = id; // Armazena o ID do campeão

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

            // Adiciona evento de clique para armazenar o campeão selecionado e redirecionar
            card.addEventListener("click", () => {
                localStorage.setItem("selectedChampion", id);
                window.location.href = "champ.html?origin=champs"; // Redireciona para a página do campeão
            });            

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
        document.getElementById("role-selected").textContent = "";
    } else {
        toggleOrangeBorderToRole(role); // Aplica a borda laranja na imagem da role clicada
        currentRole = role; // Atualiza a role atual
        
        // Atualiza o texto da role selecionada
        const roleName = getRoleName(role);
        document.getElementById("role-selected").textContent = ` ${roleName}`;
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
                    card.dataset.champion = id;

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

                    // Adiciona evento de clique para armazenar o campeão selecionado e redirecionar
                    card.addEventListener("click", () => {
                        localStorage.setItem("selectedChampion", id);
                        window.location.href = "champ.html"; // Redireciona para a página do campeão
                    });
                    
                    container.appendChild(card);
                }
            });

            container.classList.add("grid-view");

        } catch (error) {
            console.error("Erro ao buscar campeões:", error);
        }
    }
}


function getRoleName(role) {
    switch(role) {
        case "top":
            return "Top-laners";
        case "jg":
            return "Caçadores";
        case "mid":
            return "Mid-laners";
        case "adc":
            return "Atiradores";
        case "sup":
            return "Suportes";           
        default:
            return "";
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



