document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("codigoForm");
    
    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita recarregar a página

        // Coleta o e-mail e os valores do código digitado
        const email = localStorage.getItem("email"); // O e-mail foi armazenado anteriormente no localStorage
        const codigo = Array.from(document.querySelectorAll(".codigo-input")).map(input => input.value).join("");

        // Verifica se o código foi preenchido corretamente
        if (codigo.length !== 6) {
            alert("Por favor, preencha todos os campos com os 6 dígitos do código.");
            return;
        }

        try {
            // Faz a requisição para o backend para confirmar o código
            const resposta = await fetch("http://localhost:4000/usuario/confirmarconta", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, codigo }),
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                alert(resultado.message);
                
                window.location.href = "redefinir.html";
            } else {
                alert(resultado.message);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro ao tentar confirmar o código. Tente novamente mais tarde.");
        }
    });
});
