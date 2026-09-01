const formLogin = document.getElementById('formLogin');
const mensagem = document.getElementById('mensagem');

function garantirAdmin() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const adminJaExiste = usuarios.some((usuario) => usuario.email === 'admin');

    if (!adminJaExiste) {
        usuarios.push({
            nome: 'admin',
            email: 'admin',
            senha: 'admin@1234',
            role: 'admin'
        });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
}

guardarAdmin = garantirAdmin;

guardarAdmin();

formLogin.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('password').value.trim();

    if (!email || !senha) {
        mensagem.textContent = 'Preencha e-mail e senha.';
        mensagem.classList.add('erro');
        mensagem.classList.remove('sucesso');
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuarioValido = usuarios.find((usuario) => {
        const emailNormalizado = usuario.email.toLowerCase();
        const emailDigitado = email.toLowerCase();
        return emailNormalizado === emailDigitado && usuario.senha === senha;
    });

    if (!usuarioValido) {
        mensagem.textContent = 'E-mail ou senha inválidos.';
        mensagem.classList.add('erro');
        mensagem.classList.remove('sucesso');
        return;
    }

    sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioValido));

    mensagem.textContent = `Login realizado com sucesso, ${usuarioValido.nome}!`;
    mensagem.classList.add('sucesso');
    mensagem.classList.remove('erro');
    formLogin.reset();

    setTimeout(() => {
        if (usuarioValido.role === 'admin') {
            window.location.href = '../Admin/admin.html';
        } else {
            window.location.href = '../inicio/inicio.html';
        }
    }, 500);
});
