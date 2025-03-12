document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("redefinirForm");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = localStorage.getItem("email"); // Recupera o email do localStorage
        

        if (!email) {
            alert("Erro: Email não encontrado. Tente novamente.");
            return;
        }

        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmar-senha").value;

        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem. Tente novamente.");
            return;
        }

        if (senha.length < 5) {
            alert("A senha precisa ter no mínimo 5 caracteres.");
            return;
        }

        try {
            const resposta = await fetch("http://localhost:4000/usuario/atualizarsenha", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, senha }), // Envia o e-mail e a nova senha
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                alert(resultado.message);
                localStorage.removeItem("email"); // Limpa o e-mail do localStorage após redefinir a senha
                window.location.href = "login.html"; // Redireciona para o login
            } else {
                alert(resultado.message);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro ao tentar redefinir a senha. Tente novamente mais tarde.");
        }
    });
});
