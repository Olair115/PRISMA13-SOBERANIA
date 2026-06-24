// PRISMAS - Processamento de Métricas e Personalidade da PUP
document.addEventListener("DOMContentLoaded", () => {
    console.log("Motor de Métricas Vital Inicializado.");
    
    const formMetricas = document.getElementById("formMetricas");
    const sessionRaw = localStorage.getItem("prismas.sessao");
    
    // Resgatar identificação do usuário obtida na tela anterior
    let usuarioAtivo = "Explorador Sobrevivente";
    if (sessionRaw) {
        try {
            const sessionData = JSON.parse(sessionRaw);
            if (sessionData.usuario) usuarioAtivo = sessionData.usuario;
        } catch (e) {
            console.error("Falha na leitura da sessão anterior:", e);
        }
    }

    // Mascarar campos de CEP dinamicamente para manter a precisão de entrada
    const ceps = ["cepMoradia", "cepTrabalho", "cepLazer"];
    ceps.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener("input", (e) => {
                let value = e.target.value.replace(/\D/g, "");
                if (value.length > 5) {
                    value = value.substring(0, 5) + "-" + value.substring(5, 8);
                }
                e.target.value = value;
            });
        }
    });

    // Lógica do Motor Ponderado ao submeter o formulário
    formMetricas.addEventListener("submit", (e) => {
        e.preventDefault();

        const fatorAtividade = parseFloat(document.getElementById("atividadeFisica").value);
        const idade = parseInt(document.getElementById("idade").value, 10);
        const alturaCm = parseInt(document.getElementById("altura").value, 10);
        const pesoKg = parseFloat(document.getElementById("peso").value);
        
        const cepMoradia = document.getElementById("cepMoradia").value;
        const cepTrabalho = document.getElementById("cepTrabalho").value;
        const cepLazer = document.getElementById("cepLazer").value;

        // Cálculo Base do IMC e Conversão de Altura para Metros
        const alturaM = alturaCm / 100;
        const imcAtual = pesoKg / (alturaM * alturaM);

        // Ajuste Soberano de Peso Ideal: Alvo Estrito fixado em IMC 22 (Esbelteza)
        const pesoIdealImc22 = 22 * (alturaM * alturaM);
        const diferencaPeso = pesoKg - pesoIdealImc22;

        let diagnosticoMensagem = "";
        if (Math.abs(diferencaPeso) < 0.5) {
            diagnosticoMensagem = "Você atingiu a simetria perfeita do seu PESO IDEAL (IMC 22). Mantenha a soberania.";
        } else if (diferencaPeso > 0) {
            diagnosticoMensagem = `Você precisa eliminar ${diferencaPeso.toFixed(1)} kg para atingir o seu PESO IDEAL (IMC 22).`;
        } else {
            diagnosticoMensagem = `Você precisa ganhar ${Math.abs(diferencaPeso).toFixed(1)} kg para atingir o seu PESO IDEAL (IMC 22).`;
        }

        // Consolidação do Payload para a Personalidade da PUP
        const dadosBiometricos = {
            sistema: "PRISMAS",
            usuario: usuarioAtivo,
            antropometria: {
                idade: idade,
                alturaCm: alturaCm,
                pesoAtualKg: pesoKg,
                imcAtual: parseFloat(imcAtual.toFixed(2)),
                pesoIdealKg: parseFloat(pesoIdealImc22.toFixed(1)),
                fatorAtividade: fatorAtividade
            },
            climatologia: {
                moradia: cepMoradia,
                trabalho: cepTrabalho,
                lazer: cepLazer,
                fotoperiodoGravado: new Date().toISOString()
            },
            cicloEstrategico: {
                frequenciaHoras: 12,       // Monitoramento de 12 em 12 horas
                totalSemanas: 13,         // Ciclo sazonal completo
                frequênciaAnual: 4         // 4 estações ao ano
            },
            statusProcessamento: "PUP_Estruturada",
            dataCalculo: new Date().toISOString()
        };

        // Gravação firme na sessão local para persistência de dados
        localStorage.setItem("prismas.sessao", JSON.stringify(dadosBiometricos));

        // Alerta empático e direcionamento automático para a próxima etapa (Módulos de Avaliação)
        alert(`Métricas processadas com sucesso para ${usuarioAtivo}!\n\nDiretriz: ${diagnosticoMensagem}`);
        
        // Rota de avanço do ecossistema para a tela seguinte de balanceamento radial
        window.location.href = "../tela03/index.html"; 
    });
});
