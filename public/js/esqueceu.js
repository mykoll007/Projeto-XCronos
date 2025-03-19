document.addEventListener("DOMContentLoaded", function () { 
    const form = document.querySelector("form");
    const mensagemElemento = document.getElementById("mensagem");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita o recarregamento da página

        const email = document.getElementById("email").value;

        if (!email) {
            alert("Por favor, insira seu e-mail!");
            return;
        }

        try {
            const resposta = await fetch("https://projeto-x-cronos.vercel.app/usuario/recuperar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }), // Envia o e-mail no corpo da requisição
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
           
                
                localStorage.setItem("email", email); // Armazenar o e-mail no localStorage
                window.location.href = "recuperacao.html"; 
            } else {
                mensagemElemento.textContent = resultado.message; 
                mensagemElemento.style.color = "red";
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            
        }
    });
});
