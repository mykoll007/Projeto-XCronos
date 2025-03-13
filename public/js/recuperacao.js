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

        // Coleta o e-mail e os valores do código digitado
        const email = localStorage.getItem("email"); // O e-mail foi armazenado anteriormente no localStorage
        const codigo = Array.from(document.querySelectorAll(".codigo-input")).map(input => input.value).join("");

        console.log("Enviando e-mail:", email);
        console.log("Enviando código:", codigo);

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
                body: JSON.stringify({ email, codigo }), // Envia o e-mail e o código
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
              

                localStorage.setItem("email", email);  // Aqui garantimos que o e-mail seja salvo corretamente
                window.location.href = "redefinir.html";
            } else {
                mensagemElemento.textContent = resultado.message;
                mensagemElemento.style.color = "red";
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro ao tentar confirmar o código. Tente novamente mais tarde.");
        }
    });
});
