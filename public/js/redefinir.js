document.addEventListener("DOMContentLoaded", function () {
    const mensagemElemento = document.getElementById("mensagem");
    const loader = document.querySelector(".loader");
    const overlay = document.querySelector(".overlay");

    // Busca o formulário pelo ID dentro da função
    const form = document.getElementById("redefinirForm");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = localStorage.getItem("email"); // Recupera o e-mail do localStorage

        if (!email) {
            alert("Erro: E-mail não encontrado. Tente novamente.");
            return;
        }

        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmar-senha").value;

        // Verifica se as senhas coincidem
        if (senha !== confirmarSenha) {
            mensagemElemento.textContent = "As senhas não coincidem";
            mensagemElemento.style.color = "red";
            return;
        }

        // Exibe o loader e o overlay enquanto a requisição está sendo processada
        loader.style.display = "block";
        overlay.style.display = "block";

        try {
            const resposta = await fetch("https://projeto-x-cronos.vercel.app/usuario/atualizarsenha", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, senha }), // Envia o e-mail e a nova senha
            });

            const resultado = await resposta.json();

            // Oculta o loader e o overlay após a resposta
            loader.style.display = "none";
            overlay.style.display = "none";

            if (resposta.ok) {
                localStorage.setItem("mensagemSucesso", "Senha alterada com sucesso!");
                localStorage.removeItem("email"); // Limpa o e-mail do localStorage após redefinir a senha
                window.location.href = "login.html"; // Redireciona para a página de login
            } else {
                mensagemElemento.textContent = resultado.message;
                mensagemElemento.style.color = "red"; // Exibe a mensagem de erro
            }
        } catch (error) {
            // Oculta o loader e o overlay em caso de erro
            loader.style.display = "none";
            overlay.style.display = "none";
            console.error("Erro na requisição:", error);
            alert("Erro ao tentar redefinir a senha. Tente novamente mais tarde.");
        }
    });
});
