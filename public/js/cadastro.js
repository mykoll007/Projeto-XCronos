document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const mensagemElemento = document.getElementById("mensagem"); // Elemento para exibir mensagens
    const loader = document.querySelector(".loader"); // O loader que já está no HTML
    const overlay = document.querySelector(".overlay"); // O overlay para escurecer o fundo

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita o recarregamento da página

        const usuario = document.getElementById("usuario").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmar-senha").value;

        const dados = {
            usuario,
            email,
            senha,
            confirmarSenha
        };

        // Mostra o loader e o overlay enquanto a requisição é feita
        loader.style.display = "block";
        overlay.style.display = "block";

        try {
            const resposta = await fetch("https://projeto-x-cronos.vercel.app/usuario/cadastrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dados),
            });

            const resultado = await resposta.json();

            // Oculta o loader e o overlay após a resposta
            loader.style.display = "none";
            overlay.style.display = "none";

            if (resposta.ok) {
                localStorage.setItem("email", email);

                // Adiciona um atraso de 1 segundo antes de redirecionar
                setTimeout(function () {
                    window.location.href = "verificacao.html";
                }, 1000); // Atraso de 1 segundo
            } else {
                mensagemElemento.textContent = resultado.message;
                mensagemElemento.style.color = "red"; // Mensagem de erro vermelha
            }
        } catch (error) {
            // Oculta o loader e o overlay em caso de erro
            loader.style.display = "none";
            overlay.style.display = "none";
            console.error("Erro na requisição:", error);
            mensagemElemento.textContent = "Erro ao se cadastrar. Tente novamente mais tarde.";
            mensagemElemento.style.color = "red";
        }
    });
});
