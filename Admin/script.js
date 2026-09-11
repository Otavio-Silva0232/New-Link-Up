const listaUsuarios = document.getElementById('listaUsuarios');
const comentariosContainer = document.getElementById('comentariosContainer');
const sairBtn = document.getElementById('sairBtn');

let usuarioSelecionado = null;

function obterUsuarios() {
    return JSON.parse(localStorage.getItem('usuarios') || '[]');
}

function salvarUsuarios(usuarios) {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

function getUsuarioLogado() {
    const usuario = sessionStorage.getItem('usuarioLogado');
    return usuario ? JSON.parse(usuario) : null;
}

function protegerPagina() {
    const usuario = getUsuarioLogado();
    if (!usuario || usuario.role !== 'admin') {
        window.location.href = '../index.html';
    }
}

function listarUsuarios() {
    const usuarios = obterUsuarios().filter((usuario) => usuario.role !== 'admin');
    if (!usuarios.length) {
        listaUsuarios.innerHTML = '<p class="empty-state">Nenhum usuário cadastrado.</p>';
        return;
    }

    listaUsuarios.innerHTML = usuarios
        .map((usuario) => `
            <div class="usuario-item ${usuarioSelecionado && usuarioSelecionado.email === usuario.email ? 'selecionado' : ''}" data-email="${usuario.email}">
                <strong>${usuario.nome}</strong>
                <span>${usuario.email}</span>
            </div>
        `)
        .join('');

    document.querySelectorAll('.usuario-item').forEach((item) => {
        item.addEventListener('click', () => {
            const email = item.dataset.email;
            const usuariosAtualizados = obterUsuarios();
            const usuario = usuariosAtualizados.find((u) => u.email === email);
            usuarioSelecionado = usuario;
            listarUsuarios();
            renderizarComentarios(usuario);
        });
    });
}

function renderizarComentarios(usuario) {
    if (!usuario) {
        comentariosContainer.innerHTML = '<p class="empty-state">Selecione um usuário.</p>';
        return;
    }

    const avaliacoes = usuario.avaliacoes || [];

    if (!avaliacoes.length) {
        comentariosContainer.innerHTML = '<p class="empty-state">Este usuário ainda não possui comentários.</p>';
        return;
    }

    comentariosContainer.innerHTML = avaliacoes
        .map((avaliacao, index) => {
            const estrelas = '★'.repeat(Number(avaliacao.nota)) + '☆'.repeat(5 - Number(avaliacao.nota));
            const editadoPorAdm = avaliacao.editadoPorAdm ? '<div class="comentario-meta">Editado por administrador</div>' : '';

            return `
                <div class="comentario-card">
                    <div class="comentario-info">
                        <strong>${estrelas}</strong>
                        <span>${avaliacao.data}</span>
                    </div>
                    <div class="comentario-texto">${avaliacao.comentario}</div>
                    ${editadoPorAdm}
                    <div class="editar-area">
                        <textarea id="comentario-edit-${index}" placeholder="Edite o comentário...">${avaliacao.comentario}</textarea>
                        <button data-index="${index}">Salvar edição</button>
                    </div>
                </div>
            `;
        })
        .join('');

    document.querySelectorAll('.editar-area button').forEach((botao) => {
        botao.addEventListener('click', () => {
            const index = Number(botao.dataset.index);
            const textarea = document.getElementById(`comentario-edit-${index}`);
            const novoComentario = textarea.value.trim();

            if (!novoComentario) {
                alert('Informe um comentário antes de salvar.');
                return;
            }

            const usuarios = obterUsuarios();
            const usuarioIndex = usuarios.findIndex((u) => u.email === usuario.email);

            if (usuarioIndex === -1) return;

            if (!usuarios[usuarioIndex].avaliacoes) {
                usuarios[usuarioIndex].avaliacoes = [];
            }

            usuarios[usuarioIndex].avaliacoes[index] = {
                ...usuarios[usuarioIndex].avaliacoes[index],
                comentario: novoComentario,
                editadoPorAdm: true,
                data: new Date().toLocaleString('pt-BR') + ' (editado por admin)'
            };

            salvarUsuarios(usuarios);
            usuarioSelecionado = usuarios[usuarioIndex];
            listarUsuarios();
            renderizarComentarios(usuarioSelecionado);
        });
    });
}

sairBtn.addEventListener('click', () => {
    sessionStorage.removeItem('usuarioLogado');
    window.location.href = '../index.html';
});

protegerPagina();
const usuarios = obterUsuarios();
if (usuarios.length) {
    usuarioSelecionado = usuarios.find((usuario) => usuario.role !== 'admin') || null;
}
listarUsuarios();
renderizarComentarios(usuarioSelecionado);
