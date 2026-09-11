//LOGIN//
const formLogin = document.getElementById('formLogin');
const mensagem = document.getElementById('mensagem');
const botaoCadastro = document.getElementById('botaoCadastro');
const botaoLogin = document.getElementById('botaoLogin');

function atualizarToggle(cadastroAtivo) {
    botaoCadastro.classList.toggle('ativo', cadastroAtivo);
    botaoLogin.classList.toggle('ativo', !cadastroAtivo);
}

botaoCadastro.addEventListener('click', function () {
    document.body.classList.add('cadastro-ativo');
    atualizarToggle(true);
});

botaoLogin.addEventListener('click', function () {
    document.body.classList.remove('cadastro-ativo');
    atualizarToggle(false);
});

//ENTRADA ADM//
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
            window.location.href = 'Admin/admin.html';
        } else {
            window.location.href = 'inicio/inicio.html';
        }
    }, 500);
});


//CADASTRO//
const formCadastro = document.getElementById('formCadastro');
const mensagemCadastro = formCadastro.nextElementSibling;

formCadastro.addEventListener('submit', function (event) {
    event.preventDefault();

    const nome = document.getElementById('name').value.trim();
    const email = document.getElementById('emailCadastro').value.trim();
    const senha = document.getElementById('passwordCadastro').value.trim();

    if (!nome || !email || !senha) {
        mensagemCadastro.textContent = 'Preencha todos os campos.';
        mensagemCadastro.classList.add('erro');
        mensagemCadastro.classList.remove('sucesso');
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const nomeNormalizado = nome.toLowerCase().replace(/\s+/g, ' ');
    const emailJaExiste = usuarios.some((usuario) => usuario.email.toLowerCase() === email.toLowerCase());
    const nomeJaExiste = usuarios.some((usuario) => {
        const nomeUsuario = (usuario.nome || '').toLowerCase().replace(/\s+/g, ' ').trim();
        return nomeUsuario === nomeNormalizado;
    });

    if (emailJaExiste) {
        mensagemCadastro.textContent = 'Este e-mail já está cadastrado.';
        mensagemCadastro.classList.add('erro');
        mensagemCadastro.classList.remove('sucesso');
        return;
    }

    if (nomeJaExiste) {
        mensagemCadastro.textContent = 'Este nome já está cadastrado.';
        mensagemCadastro.classList.add('erro');
        mensagemCadastro.classList.remove('sucesso');
        return;
    }

    const novoUsuario = {
        nome: nome,
        email: email,
        senha: senha
    };

    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    mensagemCadastro.textContent = 'Cadastro realizado com sucesso!';
    mensagemCadastro.classList.add('sucesso');
    mensagemCadastro.classList.remove('erro');
    formCadastro.reset();
});
