document.addEventListener("DOMContentLoaded", function () { 
    const form = document.querySelector("#form-esqueceu");
    const mensagemElemento = document.getElementById("mensagem");
    const loader = document.querySelector(".loader");
    const overlay = document.querySelector(".overlay");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita o recarregamento da página

        const email = document.getElementById("email").value;

        if (!email) {
            alert("Por favor, insira seu e-mail!");
            return;
        }

        // Mostra o loader e o overlay enquanto a requisição é feita
        loader.style.display = "block";
        overlay.style.display = "block";

        try {
            const resposta = await fetch("https://projeto-x-cronos.vercel.app/usuario/recuperar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }), // Envia o e-mail no corpo da requisição
            });

            const resultado = await resposta.json();

            // Oculta o loader e o overlay após a resposta
            loader.style.display = "none";
            overlay.style.display = "none";

            if (resposta.ok) {
                localStorage.setItem("email", email); // Armazenar o e-mail no localStorage
                window.location.href = "recuperacao.html"; // Redireciona para a página de recuperação
            } else {
                mensagemElemento.textContent = resultado.message;
                mensagemElemento.style.color = "red"; // Mensagem de erro vermelha
            }
        } catch (error) {
            // Oculta o loader e o overlay em caso de erro
            loader.style.display = "none";
            overlay.style.display = "none";
            console.error("Erro na requisição:", error);
            mensagemElemento.textContent = "Erro ao recuperar a senha. Tente novamente mais tarde.";
            mensagemElemento.style.color = "red"; // Mensagem de erro
        }
    });
});
