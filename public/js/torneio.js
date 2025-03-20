

// Função para obter o id_cadastro a partir do token
function getIdFromToken() {
    const token = localStorage.getItem('token'); // Pega o token do localStorage
    if (!token) return null;

    try {
        // Decodificando a parte do payload do JWT manualmente
        const base64Url = token.split('.')[1]; // Pegando apenas o payload
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64)); // Decodifica o payload

        return payload.id_cadastro;  // Retorna o id_cadastro
    } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return null;
    }
}





// Função chamada ao clicar no botão "INSCREVER-SE"
async function handleInscricao(torneioId) {
    const idUsuario = getIdFromToken(); // Obtém o id_cadastro do token

    if (!idUsuario) {
        alert('Você precisa estar logado para se inscrever.');
        return;
    }

    // Redireciona para a página de inscrição com os parâmetros de id_cadastro e id_torneio
    window.location.href = `inscricao.html?id_cadastro=${idUsuario}&id_torneio=${torneioId}`;
}


// Associando o evento de click para os botões de inscrição
const buttons = document.querySelectorAll('.inscrever-button');
buttons.forEach(button => {
    button.addEventListener('click', function() {
        const torneioId = button.getAttribute('data-torneio-id');
        handleInscricao(torneioId); // Chama a função para redirecionar com os parâmetros
    });
});

async function getInscricoesDoUsuario(idUsuario) {
    try {
        const response = await fetch(`https://projeto-x-cronos.vercel.app/inscricoes/${idUsuario}`);
        if (!response.ok) throw new Error("Erro ao buscar inscrições");
        return await response.json(); // Retorna a lista de torneios que o usuário está inscrito
    } catch (error) {
        console.error("Erro ao carregar inscrições:", error);
        return [];
    }
}


async function getTorneios() {
    const loader = document.getElementById("loader");
    const conteudo = document.getElementById("conteudo");

    try {
        const idUsuario = getIdFromToken();
        const inscricoes = idUsuario ? await getInscricoesDoUsuario(idUsuario) : [];

        // Exibe o loader antes de carregar os torneios
        loader.style.display = "block";
        conteudo.style.display = "none";

        const response = await fetch('https://projeto-x-cronos.vercel.app/torneios');
        const torneios = await response.json();

        const torneiosContainer = document.querySelector('.torneios');
        torneiosContainer.innerHTML = '';

        torneios.forEach(torneio => {
            const torneioDiv = document.createElement('div');
            torneioDiv.classList.add('torneio');

            const mapaImagem = torneio.nome_torneio.includes("DESAFIO EM SUMMONER’S RIFT: 1X1") 
                ? "../assets/summoners-rift.png" 
                : "../assets/howling-abyss.png";

            torneioDiv.innerHTML = `
                <img src="${mapaImagem}" class="mapa" alt="Imagem do Mapa Torneio">
                <h3>${torneio.nome_torneio}</h3>

                <div id="align-dataehora">
                    <div class="icon-data">
                        <img src="../assets/data.png" alt="Icone de data">
                        <p>${formatDate(torneio.data_inicio)}</p>
                    </div>
                    <div class="icon-hora">
                        <img src="../assets/hora.png" alt="Icone de relógio">
                        <p>${formatTime(torneio.hora_inicio)}</p>
                    </div>
                </div>

                <div class="icon-premio">
                    <img src="../assets/trofeu.png" alt="Icone de torneio">
                    <p>R$ ${parseFloat(torneio.valor_premio).toFixed(2)}</p>
                </div>

                <button class="inscrever-button" data-torneio-id="${torneio.id_torneio}">INSCREVER-SE</button>
            `;

            torneiosContainer.appendChild(torneioDiv);
        });

        document.querySelectorAll('.inscrever-button').forEach(button => {
            button.addEventListener('click', function() {
                const torneioId = button.getAttribute('data-torneio-id');
                handleInscricao(torneioId);
            });
        });

    } catch (error) {
        console.error('Erro ao carregar torneios:', error);
    } finally {
            loader.style.display = "none";
            conteudo.style.display = "block";
    }
}
 
// Função para formatar a data para o formato dd/mm/yyyy
function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

// Função para formatar o horário para o formato hh:mm
function formatTime(time) {
    const t = time.split(':');
    const hour = String(t[0]).padStart(2, '0');
    const minute = String(t[1]).padStart(2, '0');
    return `${hour}:${minute}`;
}

// Chama a função para carregar os torneios quando a página carregar
document.addEventListener('DOMContentLoaded', getTorneios);


