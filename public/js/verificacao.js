document.addEventListener("DOMContentLoaded", function () {
    const inputs = document.querySelectorAll(".codigo-input");
    const form = document.getElementById("codigoForm");
    const mensagemElemento = document.getElementById("mensagem");
    const btnCadastro = document.getElementById("btn-cadast"); // Botão Confirmar
    const overlay = document.querySelector(".overlay"); // Tela de sobrecarga
    const loader = document.querySelector(".loader"); // Loader de carregamento
    let isCodeComplete = false;

    // Desabilitar o botão até que o código esteja completo
    btnCadastro.disabled = true;

    // Desabilitar o botão até que o código esteja completo
    inputs.forEach((input, index) => {
        input.addEventListener("input", (e) => {
            const value = e.target.value;

            // Avançar para o próximo campo quando o valor for preenchido
            if (value.length === 1) {
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus(); // Avança para o próximo campo
                }
                isCodeComplete = Array.from(inputs).every(input => input.value.length === 1); // Verifica se todos os campos estão preenchidos
                btnCadastro.disabled = !isCodeComplete; // Habilita o botão apenas se o código estiver completo
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
            // Exibe o overlay e o loader enquanto a requisição está em andamento
            overlay.style.display = "block";
            loader.style.display = "block";

            const resposta = await fetch("https://projeto-x-cronos.vercel.app/usuario/confirmarconta", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, codigo }),
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                localStorage.setItem("mensagemSucesso", "Conta verificada com sucesso!");
                window.location.href = "login.html"; // Redireciona após sucesso
            } 
            else if (resultado.precisaVerificar) {
                // Se precisar reenviar o código de verificação
                alert("O código expirou ou é inválido. Enviamos um novo código para seu e-mail.");
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
                mensagemElemento.style.color = "red"; // Exibe a mensagem de erro
            }
        } catch (error) {
            console.error("Erro na verificação:", error);
            alert("Erro ao tentar verificar o código.");
        } finally {
            // Esconde o overlay e o loader após a requisição (independente do sucesso ou erro)
            overlay.style.display = "none";
            loader.style.display = "none";
        }
    });
});
