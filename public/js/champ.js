document.addEventListener("DOMContentLoaded", async () => {
    const loader = document.getElementById("loader");
    const conteudo = document.getElementById("conteudo");
    const championId = localStorage.getItem("selectedChampion");

    if (!championId) {
        console.error("Nenhum campeão selecionado.");
        return;
    }

    try {
        loader.style.display = "block";
        conteudo.style.display = "none";

        // Fetch da API do League of Legends
        const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/14.4.1/data/pt_BR/champion/${championId}.json`);
        const data = await response.json();
        const champion = data.data[championId];

        atualizarInformacoesCampeao(champion);
        atualizarFuncaoCampeao(champion);
        atualizarDificuldadeCampeao(champion);
        atualizarHabilidadesCampeao(champion);
        atualizarVideoHabilidade("P", champion.key.padStart(4, "0"));

    } catch (error) {
        console.error("Erro ao buscar informações do campeão:", error);
    } finally {
        loader.style.display = "none";
        conteudo.style.display = "block";
    }

    atualizarLinkDeRetorno();
});

// Função para atualizar informações básicas do campeão
function atualizarInformacoesCampeao(champion) {
    document.getElementById("campeao-selecionado").textContent = champion.name;
    document.getElementById("campeao-titulo").textContent = champion.title;
    document.getElementById("campeao-resumo").textContent = champion.lore;
    document.querySelector("#img-campeao").src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`;
}

// Função para atualizar função do campeão
function atualizarFuncaoCampeao(champion) {
    const iconesFuncao = {
        "Assassin": "../assets/funcao-assassino.png",
        "Fighter": "../assets/funcao-lutador.png",
        "Mage": "../assets/funcao-mago.png",
        "Marksman": "../assets/funcao-atirador.png",
        "Support": "../assets/funcao-suporte.png",
        "Tank": "../assets/funcao-tanque.png"
    };

    const funcao = champion.tags[0];
    document.getElementById("img-funcao").src = iconesFuncao[funcao] || "";
    document.getElementById("funcao").textContent = traduzirFuncao(champion.tags);
}

// Função para definir a dificuldade
function atualizarDificuldadeCampeao(champion) {
    const dificuldade = ["FÁCIL", "MÉDIO", "DIFÍCIL"];
    const nivelDificuldade = champion.info.difficulty;

    document.getElementById("dificuldade-p2").textContent = dificuldade[nivelDificuldade <= 3 ? 0 : nivelDificuldade <= 6 ? 1 : 2];

    ["nivel-1", "nivel-2", "nivel-3"].forEach((id, i) => {
        document.getElementById(id).src = (nivelDificuldade > i * 3) 
            ? "../assets/nivel-claro.png"
            : "../assets/nivel-escuro.png";
    });
}

// Função para atualizar as habilidades do campeão
function atualizarHabilidadesCampeao(champion) {
    const habilidades = Object.values(champion.spells);
    const habilidadeP = champion.passive;

    ["habilidade-p", "habilidade-q", "habilidade-w", "habilidade-e", "habilidade-r"].forEach((id, index) => {
        document.getElementById(id).src = index === 0 
            ? `https://ddragon.leagueoflegends.com/cdn/14.4.1/img/passive/${habilidadeP.image.full}`
            : `https://ddragon.leagueoflegends.com/cdn/14.4.1/img/spell/${habilidades[index - 1].image.full}`;
    });

    atualizarDescricaoHabilidade(habilidadeP.name, "P", habilidadeP.description);

    // Eventos de clique para alterar descrição e vídeo
    ["P", "Q", "W", "E", "R"].forEach((tecla, index) => {
        document.getElementById(`habilidade-${tecla.toLowerCase()}`).addEventListener("click", () => {
            atualizarDescricaoHabilidade(
                index === 0 ? habilidadeP.name : habilidades[index - 1].name,
                tecla,
                index === 0 ? habilidadeP.description : habilidades[index - 1].description
            );
            atualizarVideoHabilidade(tecla, champion.key.padStart(4, "0"));
        });
    });

    document.querySelectorAll("#skills img").forEach(habilidade => {
        habilidade.addEventListener("click", () => {
            document.querySelectorAll("#skills img").forEach(img => img.style.opacity = "40%");
            habilidade.style.opacity = "100%";
        });
    });
}

// Função para atualizar o vídeo da habilidade
function atualizarVideoHabilidade(tecla, championKey) {
    const habilidadesCodigos = { "P": "P1", "Q": "Q1", "W": "W1", "E": "E1", "R": "R1" };
    const videoElement = document.querySelector("#video-habilidade video");
    const novoSrc = `https://d28xe8vt774jo5.cloudfront.net/champion-abilities/${championKey}/ability_${championKey}_${habilidadesCodigos[tecla]}.mp4`;

    if (videoElement.src !== novoSrc) {
        videoElement.style.visibility = "hidden";
        videoElement.src = novoSrc;
        videoElement.addEventListener("loadeddata", () => {
            videoElement.style.visibility = "visible";
            videoElement.play();
        }, { once: true });
    }
}

// Função para traduzir a função do campeão
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

// Função para atualizar a descrição da habilidade
function atualizarDescricaoHabilidade(titulo, tecla, descricao) {
    document.getElementById("title-habilidade").textContent = titulo;
    document.getElementById("atalho-tecla").textContent = tecla;
    document.getElementById("desc-habilidade").innerHTML = descricao;
}

// Função para alterar o link de retorno baseado na origem
function atualizarLinkDeRetorno() {
    const urlParams = new URLSearchParams(window.location.search);
    const origin = urlParams.get('origin');
    const backLink = document.querySelector('.align-arrow a');

    if (origin === 'inicio') {
        backLink.setAttribute('href', 'inicio.html');
    } else if (origin === 'champs') {
        backLink.setAttribute('href', 'champs.html');
    }
}
