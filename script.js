const input = document.getElementById("tarefa");
const botaoAdicionar = document.getElementById("adicionar");
const lista = document.getElementById("lista");

/* Elemento usado para controlar a exibição da lista */
const listaBox = document.querySelector(".card-lista");

let itens = [];

let filtroAtual = "todas";

/* 
localStorage só armazena TEXTO (string)
Por isso:
- ao salvar usa-se JSON.stringify (objeto → texto)
- ao recuperar usa-se JSON.parse (texto → objeto)
*/
const dadosSalvos = localStorage.getItem("tarefas");

/* 
Se existir algo salvo:
JSON.parse transforma o texto JSON de volta em array/objeto utilizável
*/
if (dadosSalvos) {
  itens = JSON.parse(dadosSalvos);
}

/* Renderiza a lista ao carregar a página */
mostrarLista();

// adicionar item
function adicionarItem() {
  const valor = input.value.trim();

  /* Impede adicionar tarefas vazias */
  if (valor === "") return;

  /* 
  push adiciona um novo item no array
  Cada item agora é um OBJETO:
  - texto: nome da tarefa
  - concluido: status da tarefa
  Isso permite salvar mais informações além de apenas texto
  */
  itens.push({
    texto: valor,
    concluido: false
  });

  input.value = "";
  input.focus();

  mostrarLista();
}

/* Evento de clique */
botaoAdicionar.addEventListener("click", adicionarItem);

/* Permite adicionar com ENTER */
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    adicionarItem();
  }
});

// mostrar lista
function mostrarLista() {
  /* Limpa a lista antes de recriar */
  lista.innerHTML = "";

  /* 
  Se não houver itens:
  - esconde a lista
  - salva lista vazia no localStorage
  JSON.stringify: transforma o array em TEXTO (JSON) para poder salvar
  */
  if (itens.length === 0) {
    listaBox.classList.remove("ativa");
    localStorage.setItem("tarefas", JSON.stringify(itens));
    return;
  }

  listaBox.classList.add("ativa");
  
  let itensFiltrados = itens;
  
  // filtrar pendentes
  if (filtroAtual === "pendentes") {
    itensFiltrados = itens.filter(item => !item.concluido);
  }
  
  // filtrar concluidas
   else if (filtroAtual === "concluidas") {
    itensFiltrados = itens.filter(item => item.concluido);
  }

  itensFiltrados.forEach((item, index) => {
    const li = document.createElement("li");

    const texto = document.createElement("span");

    /* Como item é um objeto, acessa a propriedade texto*/
    texto.innerText = item.texto;
    
    /* 
    Se estiver concluído:
    aplica classe CSS automaticamente
    */
    if (item.concluido) {
      texto.classList.add("concluido");
    }

    /* 
    Inverte o valor booleano:
    false → true
    true → false
    Depois recria a lista (o que também salva no localStorage)
    */
    texto.addEventListener("click", () => {
      item.concluido = !item.concluido;
      mostrarLista();
    });

    // botão excluir
    const botaoExcluir = document.createElement("button");
    botaoExcluir.innerText = "Excluir";
    botaoExcluir.classList.add("excluir");

    botaoExcluir.addEventListener("click", () => {
      const indexReal = itens.indexOf(item);
      deletarItem(indexReal);
    });

    // botão editar
    const botaoEditar = document.createElement("button");
    botaoEditar.innerText = "Editar";
    botaoEditar.classList.add("editar");

    botaoEditar.addEventListener("click", () => {
      const indexReal = itens.indexOf(item);
      editarItem(indexReal)
    });

    // container dos botões
    const divBotoes = document.createElement("div");
    divBotoes.classList.add("botoes");
    divBotoes.appendChild(botaoExcluir);
    divBotoes.appendChild(botaoEditar);

    li.appendChild(texto);
    li.appendChild(divBotoes);

    lista.appendChild(li);
  });
  
  /* 
  Salva sempre no final da função
  JSON.stringify:
  converte o array de objetos em TEXTO (JSON)
  Exemplo do que é salvo:
  '[{"texto":"Estudar","concluido":false}]'
  */
  localStorage.setItem("tarefas", JSON.stringify(itens));
}

// editar item
function editarItem(index) {
  const novoValor = prompt("Digite a nova Tarefa", itens[index].texto);

  if (!novoValor || novoValor.trim() === "") {
    alert("Tarefa não pode ficar vazia!");
    return;
  }

  /* Atualiza apenas o texto do objeto */
  itens[index].texto = novoValor.trim();

  mostrarLista();
}

// deletar item
function deletarItem(index) {
  itens.splice(index, 1);

  mostrarLista();
}

function mudarFiltro(filtro, event) {
  filtroAtual = filtro;
  // remove "ativo" de todos os botões
  document.querySelectorAll(".filtros button")
    .forEach(btn => btn.classList.remove("ativo"));

  // adiciona "ativo" no botão clicado
  event.target.classList.add("ativo");

  mostrarLista();
}
