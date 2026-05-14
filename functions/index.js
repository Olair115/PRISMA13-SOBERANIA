const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const { createHealthHandlers } = require("./src/healthData");

admin.initializeApp();
const healthHandlers = createHealthHandlers({ admin });

// Função Soberana: Monitorar Ciclo de Vigor e Escore (v2)
exports.monitorarciclovigor = onDocumentCreated("usuarios/{userId}/atividades/{activityId}", async (event) => {
    try {
        const userId = event.params.userId;
        const db = admin.firestore();
        const userRef = db.collection("usuarios").doc(userId);

        return db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) return;

            const currentScore = userDoc.data().escore || 0;
            const hour = new Date().getHours();
            
            // Bônus de 20% na Janela de Ouro (05h às 07h)
            const multiplier = (hour >= 5 && hour < 7) ? 1.2 : 1.0;
            const newScore = currentScore + (10 * multiplier);

            transaction.update(userRef, {
                escore: newScore,
                ultimaAtividade: admin.firestore.FieldValue.serverTimestamp()
            });
        });
    } catch (error) {
        console.error("Erro no Vigor:", error);
    }
});

// Endpoint de Vitalidade: Resposta R3
exports.processarpagamentor3 = onRequest((req, res) => {
    res.json({ status: "sucesso", mensagem: "Vigor renovado e Escore ativo na Casa Grande." });
});

exports.healthData = onRequest(healthHandlers.healthData);
exports.googleFitConnect = onRequest(healthHandlers.googleFitConnect);
exports.googleFitCallback = onRequest(healthHandlers.googleFitCallback);
exports.googleFitSync = onRequest(healthHandlers.googleFitSync);
exports.appleHealthImport = onRequest(healthHandlers.appleHealthImport);
