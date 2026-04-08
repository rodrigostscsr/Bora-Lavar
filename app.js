"use strict";

const centralBtn = document.getElementById('centralBtn');
const btnComoLavar = document.getElementById('lavarBtn');
const btnNovaRegra = document.getElementById('cadastrarBtn')
const btnLimparRegras = document.getElementById('limparLcl')
const selectsWrapper = document.getElementById('selectsWrapper');
const floatingBtns = document.getElementById('floatingBtns');
const inputWrapper = document.getElementById('inputWrapper');
const listaTecidos = document.getElementById('tecidoSelect');
const listaManchas = document.getElementById('manchaSelect');
const novaRegra = document.getElementById('novaRegraLcl');
const container = document.getElementById('resultado');
const ORIGEM = {LOCAL: "local", SERVER: "server"}; //evita strings soltas 
const ORIGEM_CLASS = {[ORIGEM.LOCAL]: "local", [ORIGEM.SERVER]: "server"}; //evita perder classe css
const appState = {
    tecidos: [
        {id: "alg", nome: "Algodão"},
        {id: "mal", nome: "Malha"},
        {id: "sin", nome: "Sintético"}
    ],
    manchas: [
        {id: "gord", nome: "Gordura"},
        {id: "graxa", nome: "Graxa"},
        {id: "tin", nome: "Tinta"}
    ],
    lclRegras:[],
    srvRegras: [
        {id: "srv-1", 
            origem: ORIGEM.SERVER, 
            tecidoId: "alg", 
            manchaId: "gord", 
            titulo: "Recomendamos", 
            inst: "detergente branco e lustra móveis branco"
        },
        {id: "srv-2", 
            origem: ORIGEM.SERVER, 
            tecidoId: "alg", 
            manchaId: "graxa", 
            titulo: "Recomendamos", 
            inst: "pasta rosa"
        },
        {id: "srv-3", 
            origem: ORIGEM.SERVER, 
            tecidoId: "alg", 
            manchaId: "tin", 
            titulo: "Recomendamos", 
            inst: "vanish com água quente"
        },
        {id: "srv-4", 
            origem: ORIGEM.SERVER, 
            tecidoId: "mal", 
            manchaId: "gord", 
            titulo: "Recomendamos", 
            inst: "detergente branco e lustra móveis branco"
        },
        {id: "srv-5", 
            origem: ORIGEM.SERVER, 
            tecidoId: "mal", 
            manchaId: "graxa", 
            titulo: "Recomendamos", 
            inst: "pasta rosa"
        },
        {id: "srv-6", 
            origem: ORIGEM.SERVER, 
            tecidoId: "mal", 
            manchaId: "tin", 
            titulo: "Recomendamos", 
            inst: "removedor"
        },
        {id: "srv-7", 
            origem: ORIGEM.SERVER, 
            tecidoId: "sin", 
            manchaId: "gord", 
            titulo: "Recomendamos", 
            inst: "detergente branco e lustra móveis branco"
        },
        {id: "srv-8", 
            origem: ORIGEM.SERVER, 
            tecidoId: "sin", 
            manchaId: "graxa", 
            titulo: "Recomendamos", 
            inst: "pasta rosa"
        },
        {id: "srv-9", 
            origem: ORIGEM.SERVER, 
            tecidoId: "sin", 
            manchaId: "tin", 
            titulo: "Recomendamos", 
            inst: "removedor"
        }
    ],
    config: {
        prioridadeGlobal: ORIGEM.LOCAL
    }
}
function placeholder(select, texto = "Escolha..."){
    const pHolder = document.createElement('option');
    pHolder.value = "";
    pHolder.textContent = texto;
    select.appendChild(pHolder);
}
function atualizarSel(){
    listaTecidos.replaceChildren();
    listaManchas.replaceChildren();

    placeholder(listaTecidos);
    placeholder(listaManchas);

    appState.tecidos.forEach(t=>{
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = t.nome;
        listaTecidos.appendChild(opt);
    })
    appState.manchas.forEach(m=>{
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = m.nome;
        listaManchas.appendChild(opt);
    })
}
atualizarSel();
function loadLcl(){
    try{
        const raw = localStorage.getItem("regrasLocais");
        const parsed = raw ? JSON.parse(raw) : [];
        appState.lclRegras = Array.isArray(parsed) ? parsed : []; //evita json valido sem ser array
    }
    catch (e){
        appState.lclRegras=[];
    }
}
loadLcl();
function novaRegraLcl(tecidoEsc, manchaEsc, regra){
    return {
        id: `lcl-${Date.now()}`,
        origem: ORIGEM.LOCAL,
        tecidoId: tecidoEsc,
        manchaId: manchaEsc,
        titulo: 'Você geralmente prefere',
        inst: regra
    }
}
function addState(regra){
    appState.lclRegras.push(regra);
    persist();
}
function persist(){
    localStorage.setItem(
        "regrasLocais", 
        JSON.stringify(appState.lclRegras));
}
function novaHandler(){
    const tecidoEsc = listaTecidos.value;
    const manchaEsc = listaManchas.value;
    const regra = novaRegra.value.trim();

    if (!tecidoEsc || !manchaEsc || !regra) {
        container.replaceChildren();
        const div = document.createElement('div');
        div.classList.add('regra');
        div.textContent="Faltou algo..."
        container.appendChild(div);
        return;
    }

    const regraLcl = novaRegraLcl(tecidoEsc, manchaEsc, regra)
    addState(regraLcl);
    novaRegra.value="";
    regras();
}
function regras (){
    const tecidoEsc = listaTecidos.value;
    const manchaEsc = listaManchas.value;

    if (!tecidoEsc || !manchaEsc){
        container.replaceChildren();
        const div = document.createElement('div');
        div.classList.add('regra');
        div.textContent='Está faltando algo...'
        container.appendChild(div);
        
        return;
    }

    render(tecidoEsc, manchaEsc);
}
function render(tecidoEsc, manchaEsc){
    if (!tecidoEsc || !manchaEsc) {
        container.replaceChildren(); // apenas limpa
        return;
    }

    const res = filtroRegras(tecidoEsc, manchaEsc);
    const ord = order(res);
    popular(ord, container);
}
function filtroRegras (tec, man){
    const todas = [
        ...appState.lclRegras,
        ...appState.srvRegras
    ]


    return todas.filter(l=>
        l.tecidoId === tec && 
        l.manchaId === man
    );
}
function order (list){
    const ordenada = [...list];
    const prioridade = appState.config.prioridadeGlobal;
    ordenada.sort((a,b) => {
        if (a.origem === b.origem) return 0;
            return a.origem === prioridade ? -1 : 1;
        }
    );
    return ordenada;
}
function popular (lista, space){
    space.replaceChildren(); //remove children do container

    if (lista.length === 0){
        const div = document.createElement('div');
        div.classList.add('regra');
        div.textContent = 'Nenhuma recomendação encontrada :(';
        space.appendChild(div);
        return;
    }

//CRIA UM DOM VIRTUAL PARA NAO RENDERIZAR TUDO DE NOVO AO FAZER O LOOP
    const frag = document.createDocumentFragment(); 

    lista.forEach(r=>{
    frag.appendChild(elementoRegra(r));
    })

    space.appendChild(frag);
}
function elementoRegra(r){
    const div = document.createElement('div');
    div.classList.add('regra', ORIGEM_CLASS[r.origem]);

    const strong = document.createElement('strong');
    strong.textContent = `${r.titulo} ${r.inst}`;

    const small = document.createElement('small');
    small.textContent = `Origem: ${r.origem}`;

    div.append(strong, small);

    return div;
}
function removerLcl(){
    localStorage.removeItem("regrasLocais"); 
    appState.lclRegras=[]; 
    const tecidoEsc = listaTecidos.value;
    const manchaEsc = listaManchas.value;
    if(tecidoEsc && manchaEsc){
        render (tecidoEsc, manchaEsc)
    }  
    else{
        container.replaceChildren();
    } 
}
let menuOpen = false;
const novaRegraInput = document.getElementById('novaRegraLcl');
function closeMenu() {
    if (!menuOpen) return;
    selectsWrapper.classList.remove('visible');
    floatingBtns.classList.remove('visible');
    inputWrapper.classList.remove('visible');
    btnLimparRegras.classList.remove('visible');
    menuOpen = false;
    container.replaceChildren(); //limpar as regras
}
function openMenu() {
    if (menuOpen) return;
    selectsWrapper.classList.add('visible');
    floatingBtns.classList.add('visible');
    inputWrapper.classList.remove('visible');
    btnLimparRegras.classList.remove('visible');
    menuOpen = true;
    // Ao abrir, verifica se já há regras locais sendo mostradas
    updateClearButtonVisibility();
}
novaRegraInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && menuOpen && inputWrapper.classList.contains('visible')) {
        novaHandler();
        updateClearButtonVisibility();
    }
});
centralBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (menuOpen) closeMenu();
    else openMenu();
});
btnComoLavar.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!menuOpen) return;
    regras();                       // atualiza o container com as regras
    updateClearButtonVisibility();  // mostra botão se houver regras locais visíveis
});
btnNovaRegra.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!menuOpen) return;

    if (!inputWrapper.classList.contains('visible')) {
        inputWrapper.classList.add('visible');
        document.getElementById('novaRegraLcl').focus();
    } else {
        novaHandler();              // cria regra e atualiza container
    }
    updateClearButtonVisibility();  // mostra botão se houver regras locais visíveis
});
btnLimparRegras.addEventListener('click', () => {
    removerLcl();                  // remove regras e atualiza container
    updateClearButtonVisibility(); // esconde botão
});
function updateClearButtonVisibility() {
    if (!menuOpen) {
        btnLimparRegras.classList.remove('visible');
        return;
    }

    // Verifica se há algum elemento .regra.local dentro do #resultado
    const hasLocalRegra = document.querySelector('#resultado .regra.local') !== null;
    
    if (hasLocalRegra) {
        btnLimparRegras.classList.add('visible');
    } else {
        btnLimparRegras.classList.remove('visible');
    }
}
closeMenu();
updateClearButtonVisibility();