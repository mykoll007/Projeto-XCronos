document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const btnEnviar = document.getElementById("btn-enviar");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita o recarregamento da página

        const email = document.getElementById("email").value;

        if (!email) {
            alert("Por favor, insira seu e-mail!");
            return;
        }

        try {
            const resposta = await fetch("http://localhost:4000/usuario/recuperar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }), // Envia o e-mail no corpo da requisição
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                alert(resultado.message); // Exibe a mensagem de sucesso
                
                window.location.href = "recuperacao.html"; // Exemplo de redirecionamento
            } else {
                alert(resultado.message); // Exibe a mensagem de erro
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro ao tentar recuperar a senha. Tente novamente mais tarde.");
        }
    });
});
