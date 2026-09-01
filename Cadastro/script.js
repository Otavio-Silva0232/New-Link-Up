const formCadastro = document.getElementById('formCadastro');
const mensagem = document.getElementById('mensagem');

formCadastro.addEventListener('submit', function (event) {
    event.preventDefault();

    const nome = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('password').value.trim();

    if (!nome || !email || !senha) {
        mensagem.textContent = 'Preencha todos os campos.';
        mensagem.classList.add('erro');
        mensagem.classList.remove('sucesso');
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const emailJaExiste = usuarios.some((usuario) => usuario.email.toLowerCase() === email.toLowerCase());

    if (emailJaExiste) {
        mensagem.textContent = 'Este e-mail já está cadastrado.';
        mensagem.classList.add('erro');
        mensagem.classList.remove('sucesso');
        return;
    }

    const novoUsuario = {
        nome: nome,
        email: email,
        senha: senha
    };

    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    const jsonUsuarios = JSON.stringify(usuarios, null, 2);
    const blob = new Blob([jsonUsuarios], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const linkDownload = document.createElement('a');
    linkDownload.href = url;
    linkDownload.download = 'usuarios.json';
    linkDownload.click();
    URL.revokeObjectURL(url);

    mensagem.textContent = 'Cadastro realizado com sucesso! O arquivo JSON foi gerado.';
    mensagem.classList.add('sucesso');
    mensagem.classList.remove('erro');
    formCadastro.reset();
});
