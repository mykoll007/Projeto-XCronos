document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const mensagemElemento = document.getElementById("mensagem"); // Elemento para exibir mensagens

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

        try {
            const resposta = await fetch("http://localhost:4000/usuario/cadastrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dados),
            });

            const resultado = await resposta.json();
             // Define a mensagem no HTML

            if (resposta.ok) {
                
                localStorage.setItem("email", email);
                window.location.href = "verificacao.html"; 
               
            } else {
                mensagemElemento.textContent = resultado.message;
                mensagemElemento.style.color = "red"; // Mensagem de erro vermelha
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            mensagemElemento.textContent = "Erro ao se cadastrar. Tente novamente mais tarde.";
            mensagemElemento.style.color = "red";
        }
    });
});
