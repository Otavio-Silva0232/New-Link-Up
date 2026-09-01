const STORAGE_KEY = 'usuarios';
const userLogado = JSON.parse(sessionStorage.getItem('usuarioLogado') || 'null');

if (!userLogado) {
    window.location.href = '../Login/login.html';
}

const searchInput = document.getElementById('searchInput');
const resultsList = document.getElementById('resultsList');
const perfilBox = document.getElementById('perfilDetalhe');
const perfilNome = document.getElementById('perfilNome');
const perfilEmail = document.getElementById('perfilEmail');
const avaliacoesList = document.getElementById('avaliacoesList');
const avaliacaoForm = document.getElementById('avaliacaoForm');
const notaSelect = document.getElementById('nota');
const comentarioInput = document.getElementById('comentario');
const logoutBtn = document.getElementById('logoutBtn');
const userName = document.getElementById('userName');

let perfilSelecionado = null;

userName.textContent = `Olá, ${userLogado?.nome || 'usuário'}!`;

function obterUsuarios() {
    const usuarios = localStorage.getItem(STORAGE_KEY);
    return usuarios ? JSON.parse(usuarios) : [];
}

function salvarUsuarios(usuarios) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
}

function normalizarTexto(texto) {
    return (texto || '').toLowerCase().trim();
}

function getPerfisDisponiveis() {
    return obterUsuarios().filter((usuario) => usuario.role !== 'admin');
}

function renderizarResultados(lista) {
    if (!lista.length) {
        resultsList.innerHTML = '<p class="perfil-blank">Nenhum perfil encontrado.</p>';
        return;
    }

    resultsList.innerHTML = lista
        .map(() => {
            const selecionado = perfilSelecionado && perfilSelecionado.email === usuario.email ? 'selecionado' : '';
            return `
                <div class="perfil-card ${selecionado}" data-email="${usuario.email}">
                    <strong>${usuario.nome}</strong>
                    <span>${usuario.email}</span>
                </div>
            `;
        })
        .join('');

    const cards = document.querySelectorAll('.perfil-card');
    cards.forEach((card) => {
        card.addEventListener('click', () => {
            const email = card.dataset.email;
            const usuarios = getPerfisDisponiveis();
            const usuario = usuarios.find((item) => item.email === email);
            if (usuario) {
                perfilSelecionado = usuario;
                renderizarPerfil(usuario);
                renderizarResultados(usuarios.filter((item) => {
                    const termo = normalizarTexto(searchInput.value);
                    if (!termo) return true;
                    return normalizarTexto(item.nome).includes(termo) || normalizarTexto(item.email).includes(termo);
                }));
            }
        });
    });
}

function renderizarAvaliacoes(usuario) {
    const avaliacoes = usuario.avaliacoes || [];

    if (!avaliacoes.length) {
        avaliacoesList.innerHTML = '<p class="perfil-blank">Ainda não há avaliações para este perfil.</p>';
        return;
    }

    avaliacoesList.innerHTML = avaliacoes
        .map((avaliacao) => {
            const estrelas = '★'.repeat(Number(avaliacao.nota)) + '☆'.repeat(5 - Number(avaliacao.nota));
            const badgeAdmin = avaliacao.editadoPorAdm ? '<span class="badge-admin">Editado por admin</span>' : '';
            const autor = avaliacao.autor ? `<div class="comentario-autor">Autor: ${avaliacao.autor}</div>` : '';

            return `
                <div class="avaliacao-item">
                    <div class="avaliacao-topo">
                        <strong>${estrelas}</strong>
                        <span>${avaliacao.data}</span>
                    </div>
                    <p>${avaliacao.comentario}</p>
                    ${badgeAdmin}
                    ${autor}
                </div>
            `;
        })
        .join('');
}

function renderizarPerfil(usuario) {
    perfilBox.classList.remove('hidden');
    perfilNome.textContent = usuario.nome;
    perfilEmail.textContent = usuario.email;
    renderizarAvaliacoes(usuario);
}

function buscarPerfis() {
    const termo = normalizarTexto(searchInput.value);
    const usuarios = getPerfisDisponiveis();

    const filtrados = usuarios.filter((usuario) => {
        if (!termo) return true;
        return normalizarTexto(usuario.nome).includes(termo) || normalizarTexto(usuario.email).includes(termo);
    });

    renderizarResultados(filtrados);

    if (perfilSelecionado) {
        const encontrado = filtrados.find((usuario) => usuario.email === perfilSelecionado.email);
        if (!encontrado) {
            perfilBox.classList.add('hidden');
            perfilSelecionado = null;
        }
    }
}

searchInput.addEventListener('input', buscarPerfis);

avaliacaoForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!perfilSelecionado) {
        alert('Selecione um perfil antes de avaliar.');
        return;
    }

    const comentario = comentarioInput.value.trim();
    const nota = notaSelect.value;

    if (!comentario) {
        alert('Escreva um comentário antes de salvar.');
        return;
    }

    const usuarios = obterUsuarios();
    const usuarioIndex = usuarios.findIndex((usuario) => usuario.email === perfilSelecionado.email);

    if (usuarioIndex === -1) {
        alert('Perfil não encontrado.');
        return;
    }

    if (!usuarios[usuarioIndex].avaliacoes) {
        usuarios[usuarioIndex].avaliacoes = [];
    }

    usuarios[usuarioIndex].avaliacoes.push({
        nota,
        comentario,
        autor: userLogado.nome,
        data: new Date().toLocaleString('pt-BR')
    });

    salvarUsuarios(usuarios);
    perfilSelecionado = usuarios[usuarioIndex];
    renderizarPerfil(perfilSelecionado);
    renderizarResultados(getPerfisDisponiveis().filter((usuario) => {
        const termo = normalizarTexto(searchInput.value);
        if (!termo) return true;
        return normalizarTexto(usuario.nome).includes(termo) || normalizarTexto(usuario.email).includes(termo);
    }));
    avaliacaoForm.reset();
});

logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('usuarioLogado');
    window.location.href = '../Login/login.html';
});

const usuariosIniciais = getPerfisDisponiveis();
if (!usuariosIniciais.length) {
    resultsList.innerHTML = '<p class="perfil-blank">Ainda não há perfis cadastrados.</p>';
    perfilBox.classList.add('hidden');
} else {
    perfilSelecionado = usuariosIniciais[0];
    renderizarResultados(usuariosIniciais);
    renderizarPerfil(perfilSelecionado);
}
