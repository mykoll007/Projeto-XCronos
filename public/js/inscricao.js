// Função Accordeon
document.addEventListener('DOMContentLoaded', function () {

    // Função para alternar a imagem da seta e o display da seção
    function toggleSection(iconId, sectionClass, arrowUpSrc, arrowDownSrc) {
        const arrowIcon = document.getElementById(iconId);
        const section = document.querySelector(sectionClass);

        // Verifica a imagem atual da seta e troca pela imagem oposta
        if (arrowIcon.src.includes(arrowUpSrc)) {
            arrowIcon.src = `../assets/${arrowDownSrc}`;
            // Exibe a seção
            section.style.display = 'block';
        } else {
            arrowIcon.src = `../assets/${arrowUpSrc}`;
            // Esconde a seção
            section.style.display = 'none';
        }
    }

    // Adiciona o evento de clique para o primeiro elemento
    document.getElementById('align-detalheEicon').addEventListener('click', function () {
        toggleSection('accordeon-section1', '.display-alternar1', 'arrow-left.png', 'arrow-bottom.png');
    });

    // Adiciona o evento de clique para o segundo elemento
    document.getElementById('align-h2Eicon').addEventListener('click', function () {
        toggleSection('accordeon-section2', '.display-alternar2', 'arrow-left.png', 'arrow-bottom.png');
    });
});




// Função para extrair parâmetros da URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id_cadastro: params.get("id_cadastro"),
        id_torneio: params.get("id_torneio"),
    };
}
async function carregarDetalhesTorneio() {
    const { id_torneio } = getQueryParams();

    try {
        const response = await fetch(`http://localhost:4000/torneios/${id_torneio}`);

        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const dadosTorneio = await response.json();


        // Pega os valores de data e hora do torneio
        const dataInicio = dadosTorneio.data_inicio; // data no formato '2025-03-23T03:00:00.000Z'
        const horaInicio = dadosTorneio.hora_inicio; // hora no formato '20:00:00'

        // Converte a data de acordo com o fuso horário (removendo o 'Z' do final)
        const torneioData = new Date(dataInicio);


        // Formata a data e a hora no formato desejado (pt-BR)
        const dataFormatada = torneioData.toLocaleDateString('pt-BR'); // Formato: DD/MM/AAAA

        // Para a hora, usamos a hora que vem no campo 'hora_inicio' diretamente
        const horaFormatada = horaInicio.substring(0, 5); // Formato: HH:MM

        // Atualiza o HTML com os valores recebidos
        const dataTorneio = document.querySelector('#data-torneio');
        const horaTorneio = document.querySelector('#hora-torneio');

        dataTorneio.textContent = `Dia: ${dataFormatada}`;
        horaTorneio.textContent = `Hora: ${horaFormatada}`;

    } catch (error) {
        console.error("Erro ao carregar os dados do torneio:", error);
    }
}



 // Função para capturar os dados e enviar para o backend
    async function enviarInscricao(event) {
    event.preventDefault(); // Impede o reload da página ao enviar o formulário

    // Pega os parâmetros da URL
    const { id_cadastro, id_torneio } = getQueryParams();
    
    // Pega os valores do formulário
    const discord = document.querySelector('input[name="discord"]').value.trim();
    const nick_jogo = document.querySelector('input[name="nick-jogo"]').value.trim();

    // Pega o elemento de mensagem para exibir erros ou sucesso
    const mensagemTexto = document.getElementById('mensagem-texto');

    // Pega o token do usuário para autenticação
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:4000/inscrever/${id_cadastro}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                id_torneio,
                discord,
                nick_jogo
            })
        });

        const data = await response.json();

        if (response.ok) {
            mensagemTexto.innerText = "Inscrição realizada com sucesso!";
            mensagemTexto.style.color = "green"; // Mensagem de sucesso em verde

            // Redireciona para a página inicial ou outra página desejada
            setTimeout(() => {
                window.location.href = "torneio.html";
            }, 2000);
        } else {
            mensagemTexto.innerText = `Erro ao se inscrever: ${data.message}`;
            mensagemTexto.style.color = "red"; // Mensagem de erro em vermelho
        }
    } catch (error) {
        console.error("Erro ao enviar inscrição:", error);
        mensagemTexto.innerText = "Erro no servidor. Tente novamente mais tarde.";
        mensagemTexto.style.color = "red"; // Mensagem de erro em vermelho
    }
}

// Chama a função quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', function () {
    carregarDetalhesTorneio();
});

// Adiciona evento ao botão de inscrição
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btn-inscricao").addEventListener("click", enviarInscricao);
});
