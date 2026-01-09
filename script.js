document.addEventListener("touchstart", function() {}, true);

const WHATSAPP_CONTATO = "5531991115883";
const TAXA_ENTREGA = 5.00;

const cardapioDados = {
    "Vienna do Dia": {
        icone: "fa-star",
        produtos: [{ id: 40, nome: "Vienna Burger + Refri 200ml", preco: 32.00, desc: "A nossa oferta especial de hoje!", foto: "promo.jpg" }]
    },
    "Combos": {
        icone: "fa-layer-group",
        produtos: [
            { id: 50, nome: "Combo Casal", preco: 65.00, desc: "2 X-Tudo + Batata M + Coca 1.5L", foto: "casal.jpg" },
            { id: 51, nome: "Combo Galera", preco: 115.00, desc: "4 X-Burguer + Batata G + Coca 2L", foto: "galera.jpg" }
        ]
    },
    "Artesanais": {
        icone: "fa-burger",
        produtos: [
            { id: 1, nome: "Vienna Burger", preco: 28.90, desc: "160g carne, queijo gouda e maionese artesanal.", foto: "art1.jpg" },
            { id: 2, nome: "Vienna Grill", preco: 34.90, desc: "Carne na brasa, queijo e cebola caramelizada.", foto: "art2.jpg" }
        ]
    },
    "Tradicionais": {
        icone: "fa-hamburger",
        produtos: [
            { id: 10, nome: "Vienna Burguer (Completo)", preco: 35.00, desc: "Pão, 4 bifes, Alface, tomate, 2 ovos, Cheddar, Catupiri, 2 Mussarela, 2 Presunto, batata, milho, 2 bacon", foto: "completo.jpg" },
            { id: 11, nome: "X-tudo burguer", preco: 28.00, desc: "Pão, 2 bifes, Alface, tomate, ovo, Cheddar, Catupiri, Mussarela, Presunto, batata, milho, bacon", foto: "xtudo.jpg" },
            { id: 12, nome: "X-bacon burguer", preco: 24.00, desc: "2 bifes, Alface, tomate, ovo, Cheddar, Catupiri, Mussarela, batata, milho, bacon", foto: "xbacon.jpg" },
            { id: 13, nome: "X-egg bacon burguer", preco: 25.00, desc: "2 bifes, Alface, tomate, ovo, queijo, batata, milho, bacon", foto: "xeggbacon.jpg" },
            { id: 14, nome: "X-egg buguer", preco: 22.00, desc: "2 bifes, Alface, tomate, ovo, queijo, batata, milho", foto: "xegg.jpg" },
            { id: 15, nome: "Bacon Burguer", preco: 19.00, desc: "Pão, carne, queijo e muito bacon.", foto: "bacon.jpg" },
            { id: 16, nome: "Egg-bacon burguer", preco: 20.00, desc: "Pão, carne, ovo e bacon.", foto: "eggbacon.jpg" },
            { id: 17, nome: "Egg burguer", preco: 17.00, desc: "Pão, carne e ovo.", foto: "egg.jpg" },
            { id: 18, nome: "Hamburguer", preco: 15.00, desc: "Pão, carne e salada.", foto: "hamburguer.jpg" },
            { id: 19, nome: "X-burguer", preco: 16.00, desc: "Pão, carne e queijo.", foto: "xburguer.jpg" }
        ]
    },
    "Açaís": {
        icone: "fa-ice-cream",
        produtos: [
            { id: 20, nome: "Açaí 300ml", preco: 15.00, desc: "Monte do seu jeito!", foto: "acai300.jpg" },
            { id: 21, nome: "Açaí 500ml", preco: 22.00, desc: "O mais pedido da casa.", foto: "acai500.jpg" }
        ]
    },
    "Bebidas": {
        icone: "fa-wine-bottle",
        produtos: [
            { id: 30, nome: "Coca-Cola 2L", preco: 14.00, desc: "Gelada.", foto: "coca2l.jpg" },
            { id: 31, nome: "Refri Lata", preco: 6.00, desc: "350ml (Coca, Guaraná, Fanta).", foto: "refrilata.jpg" },
            { id: 32, nome: "Suco Natural", preco: 8.00, desc: "Laranja ou Morango (500ml).", foto: "suco.jpg" }
        ]
    }
};

const adicionaisList = [
    { id: 101, nome: "Bacon Extra", preco: 4.50, tipo: "lanche" },
    { id: 102, nome: "Bife Extra", preco: 7.00, tipo: "lanche" },
    { id: 103, nome: "Queijo Extra", preco: 3.50, tipo: "lanche" },
    { id: 104, nome: "Leite Condensado", preco: 2.50, tipo: "acai" },
    { id: 105, nome: "Leite em Pó", preco: 3.00, tipo: "acai" }
];

let carrinho = [];
let produtoAtual = null;
let categoriaAtual = "";
let qtdPrincipal = 1;
let adicionaisSelecionados = {};

function renderizarCategorias() {
    document.getElementById('btn-voltar').style.display = "none";
    const container = document.getElementById('conteudo-principal');
    let html = `<div class="grid-categorias">`;
    
    for (let cat in cardapioDados) {
        const extraClass = (cat === "Vienna do Dia") ? "destaque-promo" : "";
        html += `<div class="card-categoria ${extraClass}" onclick="renderizarProdutos('${cat}')">
                    <i class="fa ${cardapioDados[cat].icone}"></i>
                    <span>${cat}</span>
                 </div>`;
    }

    html += `
        <div class="card-categoria destaque-fidelidade" onclick="renderizarPainelFidelidade()">
            <i class="fa fa-award"></i>
            <span>Fidelidade</span>
        </div>`;

    html += `
        <div class="card-categoria" style="opacity: 0.5; filter: grayscale(1); cursor: default;">
            <i class="fa fa-pizza-slice"></i>
            <span>Pizzas<br><small style="font-size:0.5rem">(Em breve)</small></span>
        </div>
        <div class="card-categoria" style="opacity: 0.5; filter: grayscale(1); cursor: default;">
            <i class="fa fa-utensils"></i>
            <span>Porções<br><small style="font-size:0.5rem">(Em breve)</small></span>
        </div>`;
    
    container.innerHTML = html + `</div>`;
}

// --- LOGICA DE FIDELIDADE COM PRAZO DE 30 DIAS ---
function renderizarPainelFidelidade() {
    window.scrollTo(0,0);
    document.getElementById('btn-voltar').style.display = "flex";
    const container = document.getElementById('conteudo-principal');
    
    // Recupera dados do LocalStorage (Substituir por Firebase depois)
    let selosAtuais = parseInt(localStorage.getItem('vienna_qtd_selos')) || 0;
    let dataInicioStr = localStorage.getItem('vienna_data_primeiro_selo');
    const meuID = localStorage.getItem('vienna_id') || "---";

    let avisoPrazoHtml = "";

    if (dataInicioStr && selosAtuais > 0) {
        const dataInicio = new Date(dataInicioStr);
        const hoje = new Date();
        const diffTempo = Math.abs(hoje - dataInicio);
        const diffDias = Math.floor(diffTempo / (1000 * 60 * 60 * 24));
        const diasRestantes = 30 - diffDias;

        if (diasRestantes <= 0) {
            // EXPIROU
            selosAtuais = 0;
            localStorage.setItem('vienna_qtd_selos', 0);
            localStorage.removeItem('vienna_data_primeiro_selo');
            avisoPrazoHtml = `<span class="aviso-validade">SEUS SELOS EXPIRARAM!</span>
                              <span class="subtexto-validade">O prazo de 30 dias acabou. Comece um novo cartão!</span>`;
        } else {
            avisoPrazoHtml = `<span class="aviso-validade">⚠️ RESTAM ${diasRestantes} DIAS</span>
                              <span class="subtexto-validade">Complete seu cartão até o dia ${new Date(dataInicio.getTime() + (30 * 24 * 60 * 60 * 1000)).toLocaleDateString()}.</span>`;
        }
    } else {
        avisoPrazoHtml = `<span class="subtexto-validade">O prazo de 30 dias começa a contar a partir do seu 1º selo.</span>`;
    }

    let selosHtml = '';
    for (let i = 1; i <= 10; i++) {
        const ativo = i <= selosAtuais ? 'selo-ativo' : 'selo-vazio';
        selosHtml += `
            <div class="caixa-selo ${ativo}">
                <i class="fa fa-certificate"></i>
                <span class="num-selo">${i}</span>
            </div>`;
    }

    container.innerHTML = `
        <div class="painel-fidelidade-vienna">
            <div class="fidelidade-header">
                <h2>Meu Cartão Fidelidade</h2>
                <p>Junte 10 selos e ganhe um Burger!</p>
            </div>
            <div class="grid-selos">
                ${selosHtml}
            </div>
            <div class="fidelidade-footer">
                ${avisoPrazoHtml}
                <hr style="margin: 15px 0; border: 0; border-top: 1px solid #ddd;">
                <small>Seu ID: <strong>${meuID}</strong></small>
            </div>
        </div>
    `;
}

function renderizarProdutos(cat) {
    setTimeout(() => {
        window.scrollTo(0,0);
        categoriaAtual = cat;
        document.getElementById('btn-voltar').style.display = "flex";
        const container = document.getElementById('conteudo-principal');
        let html = `<h2>${cat}</h2>`;
        cardapioDados[cat].produtos.forEach((p, index) => {
            html += `
                <div class="card-item" style="animation-delay: ${index * 0.1}s" onclick="abrirModalManual('${cat}', ${p.id})">
                    <div style="flex:1; padding-right:15px;">
                        <h3>${p.nome}</h3>
                        <p style="font-size:0.75rem; color:#666; margin: 4px 0;">${p.desc}</p>
                        <span class="preco">R$ ${p.preco.toFixed(2).replace('.',',')}</span>
                    </div>
                    <div class="item-foto"><img src="${p.foto}" onerror="this.src='https://via.placeholder.com/100?text=Vienna'"></div>
                </div>`;
        });
        container.innerHTML = html;
    }, 250);
}

function abrirModalManual(cat, id) {
    produtoAtual = cardapioDados[cat].produtos.find(x => x.id === id);
    categoriaAtual = cat; 
    qtdPrincipal = 1; 
    adicionaisSelecionados = {};
    
    document.getElementById('detalhe-nome').innerText = produtoAtual.nome;
    document.getElementById('detalhe-desc').innerText = produtoAtual.desc;
    document.getElementById('qtd-produto').innerText = qtdPrincipal;
    document.getElementById('observacao-produto').value = "";
    
    const secaoAds = document.getElementById('secao-adicionais-container');
    if (cat === "Bebidas" || cat === "Combos") secaoAds.style.display = "none";
    else { secaoAds.style.display = "block"; renderAdicionais(); }
    
    atualizarTotalModal();
    document.getElementById('modal-produto').style.display = "flex";
}

function renderAdicionais() {
    const lista = document.getElementById('lista-adicionais');
    const tipo = (categoriaAtual === "Açaís") ? "acai" : "lanche";
    lista.innerHTML = adicionaisList.filter(a => a.tipo === tipo).map(ad => `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <span style="font-size:0.85rem;">${ad.nome} (+R$ ${ad.preco.toFixed(2)})</span>
            <div class="seletor-mini">
                <button onclick="alterarAdicional(${ad.id}, -1)">-</button>
                <span id="qtd-ad-${ad.id}">0</span>
                <button onclick="alterarAdicional(${ad.id}, 1)">+</button>
            </div>
        </div>`).join('');
}

function alterarAdicional(id, v) { 
    adicionaisSelecionados[id] = Math.max(0, (adicionaisSelecionados[id] || 0) + v); 
    document.getElementById(`qtd-ad-${id}`).innerText = adicionaisSelecionados[id]; 
    atualizarTotalModal(); 
}

function alterarQtd(v) { 
    qtdPrincipal = Math.max(1, qtdPrincipal + v); 
    document.getElementById('qtd-produto').innerText = qtdPrincipal; 
    atualizarTotalModal(); 
}

function atualizarTotalModal() {
    let t = produtoAtual.preco;
    for(let id in adicionaisSelecionados) {
        t += adicionaisList.find(x => x.id == id).preco * adicionaisSelecionados[id];
    }
    document.getElementById('btn-total-modal').innerText = `R$ ${(t * qtdPrincipal).toFixed(2).replace('.',',')}`;
}

function confirmarAdicao() {
    let ads = []; let extra = 0;
    for(let id in adicionaisSelecionados) {
        if(adicionaisSelecionados[id] > 0) {
            const ad = adicionaisList.find(x => x.id == id);
            ads.push(`${adicionaisSelecionados[id]}x ${ad.nome}`);
            extra += ad.preco * adicionaisSelecionados[id];
        }
    }
    carrinho.push({ 
        nome: produtoAtual.nome, 
        qtd: qtdPrincipal, 
        total: (produtoAtual.preco + extra) * qtdPrincipal, 
        ads: ads.join(', '), 
        obs: document.getElementById('observacao-produto').value 
    });
    document.getElementById('cart-count').innerText = carrinho.length;
    document.getElementById('cart-fab').style.display = "flex";
    fecharModalProduto();
}

function fecharModalProduto() { document.getElementById('modal-produto').style.display = "none"; }
function fecharCarrinho() { document.getElementById('modal-carrinho').style.display = "none"; }

function abrirCarrinho() {
    const lista = document.getElementById('itens-carrinho');
    let sub = 0;
    lista.innerHTML = carrinho.map((i, idx) => {
        sub += i.total;
        return `<div style="border-bottom:1px solid #eee; padding:12px 0;">
            <div style="display:flex; justify-content:space-between;"><strong>${i.qtd}x ${i.nome}</strong><span>R$ ${i.total.toFixed(2).replace('.',',')}</span></div>
            <small style="color:var(--vienna-red); display:block;">${i.ads}</small>
            <small onclick="remover(${idx})" style="color:red; font-weight:bold; cursor:pointer;">REMOVER</small>
        </div>`;
    }).join('');
    document.getElementById('subtotal').innerText = `R$ ${sub.toFixed(2).replace('.',',')}`;
    document.getElementById('valor-total').innerText = `R$ ${(sub + TAXA_ENTREGA).toFixed(2).replace('.',',')}`;
    document.getElementById('modal-carrinho').style.display = "flex";
}

function remover(idx) { 
    carrinho.splice(idx,1); 
    document.getElementById('cart-count').innerText = carrinho.length; 
    if(carrinho.length === 0) { document.getElementById('cart-fab').style.display = "none"; fecharCarrinho(); } else { abrirCarrinho(); }
}

function enviarWhatsApp() {
    const end = document.getElementById('endereco').value;
    const pag = document.getElementById('pagamento').value;
    const meuID = localStorage.getItem('vienna_id') || "Sem ID";

    if(!end) return alert("Informe o endereço!");

    const h = new Date().getHours();
    const aberto = (h >= 18 || h < 6);
    
    let msg = aberto ? `*PEDIDO VIENNA*\n\n` : `*AGENDADO*\n\n`;

    carrinho.forEach(i => {
        msg += `*${i.qtd}x ${i.nome}*\n`;
        if(i.ads) msg += `Ads: ${i.ads}\n`;
        if(i.obs) msg += `Obs: ${i.obs}\n`;
        msg += `Sub: R$ ${i.total.toFixed(2).replace('.',',')}\n\n`;
    });

    msg += `----------------------------\n`;
    msg += `*TOTAL:* ${document.getElementById('valor-total').innerText}\n`;
    msg += `*ENDEREÇO:* ${end}\n`;
    msg += `*PAGAMENTO:* ${pag}\n`;
    msg += `----------------------------\n`;
    msg += `🆔 *ID FIDELIDADE:* ${meuID}\n`;
    msg += `----------------------------`;

    window.open(`https://wa.me/${WHATSAPP_CONTATO}?text=${encodeURIComponent(msg)}`);

    // Chame a função de fidelidade aqui se necessário
}

function checkHorario() {
    const h = new Date().getHours();
    const aberto = (h >= 18 || h < 6);
    const st = document.getElementById('status-loja');
    if(st) { 
        st.innerText = aberto ? "● ABERTO AGORA" : "○ FECHADO (AGENDANDO)"; 
        st.style.color = aberto ? "#25d366" : "red"; 
    }
    document.getElementById('aviso-agendamento').style.display = aberto ? "none" : "block";
}

renderizarCategorias();
checkHorario();