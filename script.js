document.addEventListener('DOMContentLoaded', function () {
    const cepInput = document.getElementById('cep');
    const erroDiv = document.getElementById('erro');
    const btnSalvar = document.getElementById('salvar');

    cepInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        e.target.value = value;

        if (value.length === 8) {
            consultarCEP();
        }
    });

    cepInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            consultarCEP();
        }
    });

    btnSalvar.addEventListener('click', salvarDados);

    function consultarCEP() {
        const cep = cepInput.value.trim();

        if (cep.length !== 8 || !/^\d+$/.test(cep)) {
            mostrarErro('Por favor, digite um CEP válido com 8 dígitos.');
            return;
        }

        erroDiv.style.display = 'none';

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição');
                }
                return response.json();
            })
            .then(data => {
                if (data.erro) {
                    mostrarErro('CEP não encontrado.');
                } else {
                    preencherFormulario(data);
                }
            })
            .catch(error => {
                mostrarErro('Ocorreu um erro ao consultar o CEP. Por favor, tente novamente.');
                console.error('Erro:', error);
            });
    }

    function preencherFormulario(data) {
        document.getElementById('logradouro').value = data.logradouro || '';
        document.getElementById('bairro').value = data.bairro || '';
        document.getElementById('localidade').value = data.localidade || '';
        document.getElementById('uf').value = data.uf || '';
        document.getElementById('complemento').value = data.complemento || '';
        document.getElementById('unidade').value = data.unidade || '';
        document.getElementById('ddd').value = data.ddd || '';
    }

    function salvarDados() {
        const campos = ['nome', 'cep', 'logradouro', 'bairro', 'localidade', 'uf', 'complemento', 'unidade', 'estado', 'regiao', 'ddd'];
        const dados = {};

        campos.forEach(id => {
            const input = document.getElementById(id);
            if (input) dados[id] = input.value;
        });

        const lista = JSON.parse(localStorage.getItem('listaCep')) || [];

        lista.push(dados);

        localStorage.setItem('listaCep', JSON.stringify(lista));

        limparCampos();

        alert('Dados salvos com sucesso!');
    }

    function limparCampos() {
        const campos = ['nome', 'cep', 'logradouro', 'bairro', 'localidade', 'uf', 'complemento', 'unidade', 'estado', 'regiao', 'ddd'];
        campos.forEach(id => {
            const input = document.getElementById(id);
            if (input) input.value = '';
        });
    }

    function mostrarErro(mensagem) {
        erroDiv.textContent = mensagem;
        erroDiv.style.display = 'block';
        limparCampos();
    }
});
