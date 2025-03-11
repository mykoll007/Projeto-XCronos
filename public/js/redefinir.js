document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("redefinirForm");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita recarregar a página

        // Coleta o ID do usuário e a nova senha dos campos de input
        const id = localStorage.getItem("id_usuario"); // O ID do usuário deve ser armazenado no localStorage ou obtido de outra forma
        const senha = document.getElementById("novaSenha").value;
        const confirmarSenha = document.getElementById("confirmarSenha").value;

        // Valida se as senhas são iguais
        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem. Tente novamente.");
            return;
        }

        // Valida se a senha tem o comprimento mínimo (você pode ajustar a validação conforme necessário)
        if (senha.length < 6) {
            alert("A senha precisa ter no mínimo 6 caracteres.");
            return;
        }

        try {
            // Faz a requisição para o backend para atualizar a senha
            const resposta = await fetch(`http://localhost:4000/usuario/atualizarsenha/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ senha }),
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                alert(resultado.message);
                // Redireciona para a página de login ou onde preferir
                window.location.href = "login.html";
            } else {
                alert(resultado.message);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro ao tentar redefinir a senha. Tente novamente mais tarde.");
        }
    });
});
