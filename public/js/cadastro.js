document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

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

            if (resposta.ok) {
                alert(resultado.message);
                localStorage.setItem("email", email);
                
                window.location.href = "verificacao.html"; 
            } else {
                alert(resultado.message);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro ao se cadastrar. Tente novamente mais tarde.");
        }
    });
});
