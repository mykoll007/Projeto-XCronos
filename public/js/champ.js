document.addEventListener("DOMContentLoaded", async () => {


    const championId = localStorage.getItem("selectedChampion");

    if (!championId) {
        console.error("Nenhum campeão selecionado.");
        return;
    }

    try {
        // Busca os dados do campeão na API do League of Legends
        const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/14.4.1/data/pt_BR/champion/${championId}.json`);
        const data = await response.json();
        const champion = data.data[championId];

        // Elementos da página que serão atualizados
        const imgContainer = document.querySelector("#img-campeao");
        const nomeCampeao = document.getElementById("campeao-selecionado");
        const tituloCampeao = document.getElementById("campeao-titulo");
        const resumoCampeao = document.getElementById("campeao-resumo");

        // Mapeia os ícones das funções do campeão
        const iconesFuncao = {
            "Assassin": "../assets/funcao-assassino.png",
            "Fighter": "../assets/funcao-lutador.png",
            "Mage": "../assets/funcao-mago.png",
            "Marksman": "../assets/funcao-atirador.png",
            "Support": "../assets/funcao-suporte.png",
            "Tank": "../assets/funcao-tanque.png"
        };

        // Atualiza a função do campeão
        const funcao = champion.tags[0];
        document.getElementById("img-funcao").src = iconesFuncao[funcao];
        document.getElementById("funcao").textContent = traduzirFuncao(champion.tags);

        // Atualiza imagem, nome, título e resumo do campeão
        imgContainer.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championId}_0.jpg`;
        nomeCampeao.textContent = champion.name;
        tituloCampeao.textContent = champion.title;
        resumoCampeao.textContent = champion.lore;

        // Define a dificuldade do campeão
        const dificuldade = ["FÁCIL", "MÉDIO", "DIFÍCIL"];
        const nivelDificuldade = champion.info.difficulty;
        document.getElementById("dificuldade-p2").textContent = dificuldade[nivelDificuldade <= 3 ? 0 : nivelDificuldade <= 6 ? 1 : 2];

        // Atualiza os ícones de dificuldade
        ["nivel-1", "nivel-2", "nivel-3"].forEach((id, i) => {
            document.getElementById(id).src = (nivelDificuldade === 0 && i === 0) || (nivelDificuldade > i * 3)
                ? "../assets/nivel-claro.png"
                : "../assets/nivel-escuro.png";
        });

        // Atualiza as habilidades do campeão
        const habilidades = Object.values(champion.spells);
        const habilidadeP = champion.passive;
        ["habilidade-p", "habilidade-q", "habilidade-w", "habilidade-e", "habilidade-r"].forEach((id, index) => {
            document.getElementById(id).src = index === 0 
                ? `https://ddragon.leagueoflegends.com/cdn/14.4.1/img/passive/${habilidadeP.image.full}`
                : `https://ddragon.leagueoflegends.com/cdn/14.4.1/img/spell/${habilidades[index - 1].image.full}`;
        });

        // Define a descrição inicial da habilidade passiva
        atualizarDescricaoHabilidade(habilidadeP.name, "P", habilidadeP.description);

        // Adiciona eventos de clique para atualizar descrições de habilidades
        ["P", "Q", "W", "E", "R"].forEach((tecla, index) => {
            document.getElementById(`habilidade-${tecla.toLowerCase()}`).addEventListener("click", () => {
                atualizarDescricaoHabilidade(
                    index === 0 ? habilidadeP.name : habilidades[index - 1].name,
                    tecla,
                    index === 0 ? habilidadeP.description : habilidades[index - 1].description
                );
            });
        });

        // Adiciona efeito de opacidade ao selecionar habilidades
        document.querySelectorAll("#skills img").forEach(habilidade => {
            habilidade.addEventListener("click", () => {
                document.querySelectorAll("#skills img").forEach(img => img.style.opacity = "40%");
                habilidade.style.opacity = "100%";
            });
        });

        // Atualiza o vídeo da habilidade selecionada
        const championKey = champion.key.padStart(4, "0");

        function atualizarVideoHabilidade(tecla) {
            const habilidadesCodigos = { "P": "P1", "Q": "Q1", "W": "W1", "E": "E1", "R": "R1" };
            const videoElement = document.querySelector("#video-habilidade video");
            const novoSrc = `https://d28xe8vt774jo5.cloudfront.net/champion-abilities/${championKey}/ability_${championKey}_${habilidadesCodigos[tecla]}.mp4`;

            // Verifica se o vídeo atual já é o mesmo que o desejado
            if (videoElement.src === novoSrc) {
                return; // Se o vídeo já estiver sendo exibido, não faz nada
            }

            // Esconde o vídeo enquanto carrega
            videoElement.style.visibility = "hidden";

            // Atualiza o src do vídeo
            videoElement.src = novoSrc;

            // Quando o vídeo carregar, exibe novamente
            videoElement.addEventListener("loadeddata", () => {
                videoElement.style.visibility = "visible";
                videoElement.play();
            }, { once: true });
        }

        // Adiciona eventos de clique para trocar o vídeo ao selecionar uma habilidade
        ["P", "Q", "W", "E", "R"].forEach(tecla => {
            document.getElementById(`habilidade-${tecla.toLowerCase()}`).addEventListener("click", () => atualizarVideoHabilidade(tecla));
        });

        // Define o vídeo inicial como a habilidade passiva
        atualizarVideoHabilidade("P");

    } catch (error) {
        console.error("Erro ao buscar informações do campeão:", error);
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

    // Função para atualizar a descrição da habilidade selecionada
    function atualizarDescricaoHabilidade(titulo, tecla, descricao) {
        document.getElementById("title-habilidade").textContent = titulo;
        document.getElementById("atalho-tecla").textContent = tecla;
        document.getElementById("desc-habilidade").innerHTML = descricao;
    }

    // Alterar o link de retorno baseado na origem
    const urlParams = new URLSearchParams(window.location.search);
    const origin = urlParams.get('origin');
    const backLink = document.querySelector('.align-arrow a');

    if (origin === 'inicio') {
        backLink.setAttribute('href', 'inicio.html');
    } else if (origin === 'champs') {
        backLink.setAttribute('href', 'champs.html');
    }
});
