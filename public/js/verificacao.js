document.addEventListener("DOMContentLoaded", function () {
    const inputs = document.querySelectorAll(".codigo-input");
    const form = document.getElementById("codigoForm");
    const mensagemElemento = document.getElementById("mensagem");

    inputs.forEach((input, index) => {
        input.addEventListener("input", (e) => {
            const value = e.target.value;

            if (value.length === 1) {
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus(); // Avança para o próximo campo
                }
            }
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && !input.value && index > 0) {
                inputs[index - 1].focus(); // Volta para o campo anterior
            }
        });

        input.addEventListener("paste", (e) => {
            e.preventDefault();
            const pasteData = e.clipboardData.getData("text").replace(/\D/g, ""); // Filtra só números
            if (pasteData.length === inputs.length) {
                inputs.forEach((inp, i) => (inp.value = pasteData[i] || ""));
            }
            inputs[inputs.length - 1].focus(); // Foca no último campo
        });
    });

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita recarregar a página

        const codigo = Array.from(inputs).map((input) => input.value).join(""); // Junta os 6 números
        const email = localStorage.getItem("email"); // Recupera e-mail salvo no login

        if (codigo.length < 6) {
            alert("Por favor, insira os 6 dígitos do código de verificação.");
            return;
        }

        try {
            const resposta = await fetch("https://projeto-x-cronos.vercel.app/usuario/confirmarconta", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, codigo }),
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                localStorage.setItem("mensagemSucesso", "Conta verificada com sucesso !"); 
                window.location.href = "login.html"; // Redireciona após sucesso

            } 
            else if (resultado.precisaVerificar) {
                // Se precisar reenviar o código de verificação
                await fetch("https://projeto-x-cronos.vercel.app/usuario/reenviarcodigo", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                });

                
            } 
            else {
                mensagemElemento.textContent = resultado.message;
            }
        } catch (error) {
            console.error("Erro na verificação:", error);
            alert("Erro ao tentar verificar o código.");
        }
    });
});
