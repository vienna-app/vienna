const firebaseConfig = {
    apiKey: "AIzaSyBp3XjkW_QnPIYZ2zwkpqxPvXx8rC3hQPI",
    authDomain: "vienna-f81fb.firebaseapp.com",
    projectId: "vienna-f81fb",
    storageBucket: "vienna-f81fb.firebasestorage.app",
    messagingSenderId: "4141979620310",
    appId: "1:414979620310:web:3370a528aa578a0c613877"
};

const scriptsFb = [
    "https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js",
    "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore-compat.js"
];

let carregados = 0;
scriptsFb.forEach(url => {
    const s = document.createElement('script');
    s.src = url;
    s.onload = () => {
        carregados++;
        if (carregados === 2) iniciarSistemaFidelidade();
    };
    document.head.appendChild(s);
});

function iniciarSistemaFidelidade() {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    window.db = db; 

    if (!localStorage.getItem('vienna_id')) {
        localStorage.setItem('vienna_id', 'V' + Math.floor(1000 + Math.random() * 9000));
    }
    const myID = localStorage.getItem('vienna_id');

    // ESCUTA EM TEMPO REAL COM LÓGICA DE EXPIRAÇÃO (30 DIAS)
    db.collection("clientes").doc(myID).onSnapshot((doc) => {
        if (doc.exists) {
            const dados = doc.data();
            let selos = dados.selos || 0;
            let dataInicio = dados.dataPrimeiroSelo ? dados.dataPrimeiroSelo.toDate() : null;

            if (dataInicio && selos > 0) {
                const hoje = new Date();
                const diffTempo = Math.abs(hoje - dataInicio);
                const diffDias = Math.floor(diffTempo / (1000 * 60 * 60 * 24));

                // VERIFICA SE EXPIROU (PASSOU DE 30 DIAS)
                if (diffDias >= 30) {
                    db.collection("clientes").doc(myID).update({
                        selos: 0,
                        dataPrimeiroSelo: null
                    });
                    selos = 0;
                    dataInicio = null;
                    localStorage.removeItem('vienna_data_primeiro_selo');
                } else {
                    // Salva a data no localStorage para o script.js usar na interface
                    localStorage.setItem('vienna_data_primeiro_selo', dataInicio.toISOString());
                }
            }

            localStorage.setItem('vienna_qtd_selos', selos);
        } else {
            localStorage.setItem('vienna_qtd_selos', 0);
            localStorage.removeItem('vienna_data_primeiro_selo');
        }
        
        // Atualiza a tela se o cliente estiver olhando o cartão
        const painelFidelidadeAtivo = document.querySelector('.painel-fidelidade-vienna');
        if (painelFidelidadeAtivo && typeof window.renderizarPainelFidelidade === 'function') {
            window.renderizarPainelFidelidade();
        }
    });

    // FUNÇÃO QUE ENVIA O PEDIDO PARA O PAINEL DO GERENTE
    window.enviarPedidoFidelidade = function() {
        console.log("Enviando sinal de pedido para o Gerente...");
        db.collection("pedidos").doc(myID).set({
            id: myID,
            data: firebase.firestore.FieldValue.serverTimestamp(),
            status: "pendente"
        }).then(() => {
            console.log("✅ Gerente notificado!");
        }).catch(e => console.error("Erro Firebase:", e));
    };

    // Monitora o clique no botão Finalizar
    document.addEventListener('click', function(e) {
        const t = e.target.innerText ? e.target.innerText.toUpperCase() : "";
        if (t.includes("FINALIZAR") || t.includes("WHATSAPP") || e.target.closest('.btn-finalizar')) {
            window.enviarPedidoFidelidade();
        }
    }, true);
}