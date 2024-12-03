const adicionarFaixa = document.getElementById("adicionarFaixa"); // modal inicial
const modal = document.getElementById("modal"); // modal inicial
const fecharModal = document.getElementById("fecharModal"); // modal inicial
const modalForm = document.getElementById("modalForm"); // modal inicial

const nMusica = document.getElementById("nMusica");
const nArtista = document.getElementById("nArtista");
const nCompositor = document.getElementById("nCompositor");
const gravadora = document.getElementById("gravadora");
const descricao = document.getElementById("descricao");
const url = document.getElementById("url");

const main = document.getElementById("lista");

function AVISO(){
    alert("Recurso em desenvolvimento!")
}

let contador = 0; // contador para criar IDs únicos para as músicas

adicionarFaixa.onclick = function () {
    modal.showModal();
};
fecharModal.onclick = function () {
    modal.close();
};

// Função para adicionar a música via POST
async function addMusica(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    const musica = nMusica.value;
    const artista = nArtista.value;
    const compositor = nCompositor.value;
    const gravadoraValue = gravadora.value;
    const descricaoValue = descricao.value;
    const urlValue = url.value;

    const novaMusica = {
        nome: musica,
        artista: artista,
        compositor: compositor,
        gravadora: gravadoraValue,
        descricao: descricaoValue,
        url: urlValue
    };

    try {
        // Enviar os dados para o back-end via POST
        const response = await fetch('http://localhost:8080/central', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novaMusica)
        });

        if (!response.ok) {
            throw new Error('Erro ao adicionar a música!');
        }

        const data = await response.json(); // Recebe a resposta do back-end (por exemplo, a música criada)

        // Atualiza a interface com a nova música
        contador++; // incrementa o contador para cada nova música
        const nova = `
        <div id="${contador}" class="musica" style="background-color: white; width: 400px; height: 150px; margin-top: 25px">
            <img class="capas" src="${urlValue}" alt="">
            <div class="informações">
                <div class="titulo">
                    <h3 id="titulo" onclick="infoMusica()">${musica}</h3>
                    <img src="./editar 41.png" id="lapis" onclick="editarMusica()" alt="">
                </div>
                <div class="artista">
                    <p>${artista}</p>
                    <img id="lixeira-${contador}" class="lixeira" onclick="abrirExcluir(${contador})" src="./excluir-removebg-preview 42.png" alt="">
                </div>
            </div>
        </div>`;

        main.innerHTML += nova;

        // Limpar os campos do formulário
        nMusica.value = "";
        nArtista.value = "";
        nCompositor.value = "";
        gravadora.value = "";
        descricao.value = "";
        url.value = "";

        modal.close(); // Fecha o modal após o envio da música
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha ao adicionar a música');
    }
}

modalForm.onsubmit = addMusica; // Adiciona o evento de submit ao formulário

async function getAllMusicas() {
    try {
        const response = await fetch('http://localhost:8080/central');

        if (!response.ok) {
            throw new Error('Erro ao buscar as músicas');
        }

        const musicas = await response.json();

        main.innerHTML = '';

        musicas.forEach((musica) => {
            const nova = `
            <div id="musica-${musica.id}" class="musica" style="background-color: white; width: 400px; height: 150px; margin-top: 25px">
                <img class="capas" src="${musica.url}" alt="">
                <div class="informações">
                    <div class="titulo">
                        <h3 onclick="infoMusica(${musica.id})">${musica.nome}</h3> <!-- Passa o ID da música -->
                        <img src="./editar 41.png" id="lapis" onclick="abrirEditar(${musica.id})" alt="">
                    </div>
                    <div class="artista">
                        <p>${musica.artista}</p>
                        <img id="lixeira-${musica.id}" class="lixeira" onclick="abrirExcluir(${musica.id})" src="./excluir-removebg-preview 42.png" alt="">
                    </div>
                </div>
            </div>`;
            main.innerHTML += nova;
        });
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha ao buscar as músicas');
    }
}
// Chame a função getAllMusicas ao carregar a página
window.onload = getAllMusicas;

const ModalExcluir = document.getElementById("modal-Excluir");
const cancelar = document.getElementById("cancelar");
let musicaParaExcluir = null;

function abrirExcluir(idMusica) {
    musicaParaExcluir = idMusica; // armazena o ID da música que será excluída
    ModalExcluir.showModal();
}

cancelar.onclick = function () {
    ModalExcluir.close();
};

//MÉTODO DELETE
async function deletarMusica() {
    try {
        // Enviar a requisição DELETE para o backend
        const response = await fetch(`http://localhost:8080/central/${musicaParaExcluir}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir a música!');
        }

        // Remove a música da interface (do HTML)
        const musicaElement = document.getElementById(`musica-${musicaParaExcluir}`);
        musicaElement.remove(); // Remove a música da lista

        // Fechar o modal de confirmação
        ModalExcluir.close();
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha ao excluir a música');
    }
}

const confirmarExcluir = document.getElementById("excl");
confirmarExcluir.onclick = deletarMusica;
//FIM DO MÉTODO DELETE

//MÉTODO GETID
async function infoMusica(id) {
    try {
        const response = await fetch(`http://localhost:8080/central/${id}`); // URL para obter a música pelo ID

        if (!response.ok) {
            throw new Error('Erro ao buscar as informações da música');
        }

        const musica = await response.json(); // Recebe a resposta do backend

        // Preenche o modal com as informações da música
        document.getElementById("capaMusica").src = musica.url;
        document.getElementById("tituloMusica").textContent = musica.nome;
        document.getElementById("artistaMusica").textContent = musica.artista;
        document.getElementById("compositorMusica").textContent = musica.compositor;
        document.getElementById("gravadoraMusica").textContent = musica.gravadora;
        document.getElementById("descricaoMusica").textContent = musica.descricao;

        // Exibe o modal com as informações
        const modalInformacoes = document.getElementById("modalInformacoes");
        modalInformacoes.showModal();
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha ao buscar as informações da música');
    }
}
const btnFecharInfo = document.getElementById("fecharInformacoes");
btnFecharInfo.onclick = function(){
    modalInformacoes.close();
}
//FIM DO MÉTODO GETID

// Adicione as variáveis do modal de edição
const modalEditar = document.getElementById("modalEditar"); // modal de edição
const fecharEditar = document.getElementById("fecharEditar"); // botão para fechar o modal de edição
const cancelarEdicao = document.getElementById("cancelarEditar");

// Variáveis para armazenar os campos do modal de edição
const editarMusica = document.getElementById("editarMusica");
const editarArtista = document.getElementById("editarArtista");
const editarCompositor = document.getElementById("editarCompositor");
const editarGravadora = document.getElementById("editarGravadora");
const editarDescricao = document.getElementById("editarDescricao");
const editarUrl = document.getElementById("editarUrl");

let musicaParaEditar = null; // ID da música que será editada

fecharEditar.onclick = function(){
    modalEditar.close();
}
cancelarEdicao.onclick = function(){
    modalEditar.close();
}
// Função para abrir o modal de edição e preencher os campos com as informações atuais
async function abrirEditar(idMusica) {
    musicaParaEditar = idMusica; // Armazena o ID da música que será editada

    try {
        const response = await fetch(`http://localhost:8080/central/${musicaParaEditar}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar as informações da música para edição');
        }

        const musica = await response.json(); // Recebe a resposta do backend

        // Preenche os campos do modal de edição
        editarMusica.value = musica.nome;
        editarArtista.value = musica.artista;
        editarCompositor.value = musica.compositor;
        editarGravadora.value = musica.gravadora;
        editarDescricao.value = musica.descricao;
        editarUrl.value = musica.url;

        modalEditar.showModal(); // Abre o modal de edição
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha ao buscar as informações da música para edição');
    }
}

// Função para salvar as alterações da música
async function salvarEdicao() {
    const updatedMusica = {
        nome: editarMusica.value,
        artista: editarArtista.value,
        compositor: editarCompositor.value,
        gravadora: editarGravadora.value,
        descricao: editarDescricao.value,
        url: editarUrl.value
    };

    try {
        const response = await fetch(`http://localhost:8080/central/${musicaParaEditar}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedMusica)
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar a música!');
        }

        const data = await response.json(); // Recebe a resposta do back-end

        // Atualiza a interface com as novas informações da música
        const musicaElement = document.getElementById(`musica-${musicaParaEditar}`);
        musicaElement.querySelector('h3').textContent = updatedMusica.nome;
        musicaElement.querySelector('.capas').src = updatedMusica.url;

        // Fecha o modal de edição
        modalEditar.close();
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha ao atualizar a música');
    }
}

// Adiciona o evento de clique para o botão de salvar no modal de edição
document.getElementById("salvarEdicao").onclick = salvarEdicao;
fecharEditar.onclick = function () {
    modalEditar.close();
};