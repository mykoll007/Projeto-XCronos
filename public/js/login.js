document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const mensagemElemento = document.getElementById("mensagem");
    

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita recarregar a página

        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        if (!email || !senha) {
            alert("Preencha todos os campos!");
            return;
        }

        try {
            const resposta = await fetch("http://localhost:4000/usuario/autenticar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, senha }),
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                

                // ✅ Armazena o token no localStorage
                localStorage.setItem("token", resultado.token);

                // Redireciona para a página principal ou dashboard
                window.location.href = "inicio.html";
            }   else if (resultado.precisaVerificar) {
                // Caso precise verificar, salva o e-mail e reenvia código antes de redirecionar
                localStorage.setItem("email", email);

                const reenviarResposta = await fetch("http://localhost:4000/usuario/reenviarcodigo", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                });

                const reenviarResultado = await reenviarResposta.json();

                if (reenviarResposta.ok) {
        
                    window.location.href = "verificacao.html"; // Redireciona para verificação
                } else {
                    alert(reenviarResultado.message || "Erro ao reenviar código.");
                }
            } 
         else {
            mensagemElemento.textContent = resultado.message; 
            mensagemElemento.style.color = "red";
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro ao tentar fazer login. Tente novamente mais tarde.");
        }
    });

     // Aqui a mensagem quando redefinir senha "Senha alterada com sucesso"
     const mensagemSucesso = localStorage.getItem("mensagemSucesso");

    if (mensagemSucesso) {
        mensagemElemento.textContent = mensagemSucesso;
        mensagemElemento.style.color = "lawngreen"; // Define a cor verde para destacar o sucesso
        localStorage.removeItem("mensagemSucesso"); // Remove a mensagem do localStorage após exibir
    }
});
