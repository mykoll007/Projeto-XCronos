document.addEventListener("DOMContentLoaded", async () => {
    const championId = localStorage.getItem("selectedChampion");

    if (!championId) {
        console.error("Nenhum campeão selecionado.");
        return;
    }

    try {
        const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/14.4.1/data/pt_BR/champion/${championId}.json`);
        const data = await response.json();
        const champion = data.data[championId];

        const iconesFuncao = {
            "Assassin": "../assets/funcao-assassino.png",
            "Fighter": "../assets/funcao-lutador.png",
            "Mage": "../assets/funcao-mago.png",
            "Marksman": "../assets/funcao-atirador.png",
            "Support": "../assets/funcao-suporte.png",
            "Tank": "../assets/funcao-tanque.png"
        };

        const funcao = champion.tags[0];
        const iconeFuncao = iconesFuncao[funcao];
        document.getElementById("img-funcao").src = iconeFuncao;

  

        // Atualiza os elementos da página com as informações do campeão
        document.querySelector(".container-app img").src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championId}_0.jpg`;
        document.getElementById("campeao-selecionado").textContent = champion.name;
        document.getElementById("campeao-titulo").textContent = champion.title;
        document.getElementById("campeao-resumo").textContent = champion.lore;

        
        document.getElementById("funcao").textContent = funcao;
        // Atualiza a função (classe do campeão)
        document.getElementById("funcao").textContent = traduzirFuncao(champion.tags);

// Atualiza a dificuldade do campeão
const dificuldade = ["FÁCIL", "MÉDIO", "DIFÍCIL"];
const nivelDificuldade = champion.info.difficulty;

// Atualiza o texto da dificuldade
document.getElementById("dificuldade-p2").textContent = dificuldade[nivelDificuldade <= 3 ? 0 : nivelDificuldade <= 6 ? 1 : 2];

// Atualiza as imagens de dificuldade
["nivel-1", "nivel-2", "nivel-3"].forEach((id, i) => {
    document.getElementById(id).src = (nivelDificuldade === 0 && i === 0) || (nivelDificuldade > i * 3)
        ? "../assets/nivel-claro.png" 
        : "../assets/nivel-escuro.png";
});

        // Atualiza as habilidades
        const habilidades = Object.values(champion.spells);
        const habilidadeP = champion.passive;

        document.getElementById("habilidade-p").src = `https://ddragon.leagueoflegends.com/cdn/14.4.1/img/passive/${habilidadeP.image.full}`;
        document.getElementById("habilidade-q").src = `https://ddragon.leagueoflegends.com/cdn/14.4.1/img/spell/${habilidades[0].image.full}`;
        document.getElementById("habilidade-w").src = `https://ddragon.leagueoflegends.com/cdn/14.4.1/img/spell/${habilidades[1].image.full}`;
        document.getElementById("habilidade-e").src = `https://ddragon.leagueoflegends.com/cdn/14.4.1/img/spell/${habilidades[2].image.full}`;
        document.getElementById("habilidade-r").src = `https://ddragon.leagueoflegends.com/cdn/14.4.1/img/spell/${habilidades[3].image.full}`;

        // Atualiza a descrição da habilidade passiva inicialmente
        atualizarDescricaoHabilidade(habilidadeP.name, "P", habilidadeP.description);

        // Adiciona eventos de clique para atualizar a descrição ao clicar em uma habilidade
        document.getElementById("habilidade-p").addEventListener("click", () => {
            atualizarDescricaoHabilidade(habilidadeP.name, "P", habilidadeP.description);
        });
        document.getElementById("habilidade-q").addEventListener("click", () => {
            atualizarDescricaoHabilidade(habilidades[0].name, "Q", habilidades[0].description);
        });
        document.getElementById("habilidade-w").addEventListener("click", () => {
            atualizarDescricaoHabilidade(habilidades[1].name, "W", habilidades[1].description);
        });
        document.getElementById("habilidade-e").addEventListener("click", () => {
            atualizarDescricaoHabilidade(habilidades[2].name, "E", habilidades[2].description);
        });
        document.getElementById("habilidade-r").addEventListener("click", () => {
            atualizarDescricaoHabilidade(habilidades[3].name, "R", habilidades[3].description);
        });

        // Adiciona a funcionalidade de opacidade ao clicar nas habilidades
        const habilidadesImgs = document.querySelectorAll("#skills img");

        habilidadesImgs.forEach(habilidade => {
            habilidade.addEventListener("click", () => {
                // Redefine a opacidade de todas as habilidades para 40%
                habilidadesImgs.forEach(img => img.style.opacity = "40%");

                // Define a opacidade da habilidade clicada como 100%
                habilidade.style.opacity = "100%";
                
            });
        });
        
    } catch (error) {
        console.error("Erro ao buscar informações do campeão:", error);
    }



    function traduzirFuncao(tags) {
        const traducoes = {
            "Assassin": "Assassino",
            "Fighter": "Lutador",
            "Mage": "Mago",
            "Marksman": "Atirador",
            "Support": "Suporte",
            "Tank": "Tanque"
        };
        return tags.map(tag => traducoes[tag] || tag).join(", ");
    }

    function atualizarDescricaoHabilidade(titulo, tecla, descricao) {
        document.getElementById("title-habilidade").textContent = titulo;
        document.getElementById("atalho-tecla").textContent = tecla;
        document.getElementById("desc-habilidade").innerHTML = descricao; // Agora renderiza HTML corretamente
    }
    
});
