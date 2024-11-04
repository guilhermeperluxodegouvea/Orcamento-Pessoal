class Despesa {
    // Formato de uma despesa
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }
    // Se algum dado estiver vazio, não deixa continuar e alerta o user
    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == "" || this[i] == null) {
                return false;
            }
        }
        return true;
    }
}

class Bd {
    // Salva as despesas numa ordem
    constructor() {
        let id = localStorage.getItem("id");

        if (id === null) {
            localStorage.setItem("id", 0);
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem("id");
        return parseInt(proximoId) + 1;
    }
    // Salva elas de fato
    gravar(d) {
        let id = this.getProximoId();

        localStorage.setItem(id, JSON.stringify(d));

        localStorage.setItem("id", id);
    }

    recuperarTodosRegistros() {
        // Array de despesas
        let despesas = Array();

        let id = localStorage.getItem("id");

        // Recuperar todas as despesas em bd
        for (let i = 1; i <= id; i++) {
            // Recupera a despesa
            let despesa = JSON.parse(localStorage.getItem(i));

            // Verifica se tem índices pulados
            if (despesa === null) {
                continue;
            }

            despesa.id = i;
            // Adiciona a despesa recuperada na array
            despesas.push(despesa);
        }

        return despesas;
    }
    // Pesquisa despesas
    pesquisar(despesa) {
        let despesasFiltradas = Array();
        despesasFiltradas = this.recuperarTodosRegistros();

        //ano
        if (despesa.ano != "") {
            despesasFiltradas = despesasFiltradas.filter(
                (d) => d.ano == despesa.ano
            );
        }

        //mes
        if (despesa.mes != "") {
            despesasFiltradas = despesasFiltradas.filter(
                (d) => d.mes == despesa.mes
            );
        }

        //dia
        if (despesa.dia != "") {
            despesasFiltradas = despesasFiltradas.filter(
                (d) => d.dia == despesa.dia
            );
        }

        //tipo
        if (despesa.tipo != "") {
            despesasFiltradas = despesasFiltradas.filter(
                (d) => d.tipo == despesa.tipo
            );
        }

        //descricao
        if (despesa.descricao != "") {
            despesasFiltradas = despesasFiltradas.filter(
                (d) => d.descricao == despesa.descricao
            );
        }

        //valor
        if (despesa.valor != "") {
            despesasFiltradas = despesasFiltradas.filter(
                (d) => d.valor == despesa.valor
            );
        }

        return despesasFiltradas;
    }
    // Deleta uma despesa
    remover(id) {
        localStorage.removeItem(id);
    }
}

let bd = new Bd();

function cadastrarDespesa() {
    // Pega os valores inseridos pelo user
    let ano = document.getElementById("ano");
    let mes = document.getElementById("mes");
    let dia = document.getElementById("dia");
    let tipo = document.getElementById("tipo");
    let descricao = document.getElementById("descricao");
    let valor = document.getElementById("valor");
    // Cria o objeto despesa para salvar esses dados
    const despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    );
    // Grava no BD ou mostra a mensagem de erro, dependendo do resultado de validarDados()
    if (despesa.validarDados()) {
        bd.gravar(despesa);

        document.getElementById("modalTituloDiv").className =
            "modal-header text-success";
        document.getElementById("modalBotao").className =
            "btn btn-primary btn-success";
        document.getElementById("modalTitulo").innerHTML = "Sucesso";
        document.getElementById("modalRetorno").innerHTML =
            "Despesa salva com sucesso.";

        // Mostra o modal de sucesso
        $("#modalRegistraDespesa").modal("show");

        // Deixa os campos vazios após o registro das despesas
        ano.value = "";
        mes.value = "";
        dia.value = "";
        tipo.value = "";
        descricao.value = "";
        valor.value = "";
    } else {
        document.getElementById("modalTituloDiv").className =
            "modal-header text-danger";
        document.getElementById("modalBotao").className =
            "btn btn-primary btn-danger";
        document.getElementById("modalTitulo").innerHTML = "Erro";
        document.getElementById("modalRetorno").innerHTML =
            "Há campos não preenchidos.";

        // Mostra o modal de erro
        $("#modalRegistraDespesa").modal("show");
    }
}

function carregaListaDespesas(despesas = Array(), filtro = false) {
    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros();
    }
    // Seleciona tbody da tabela
    let listaDespesas = document.getElementById("listaDespesas");
    listaDespesas.innerHTML = "";

    // Percorrer o array despesas de maneira dinâmica
    despesas.forEach(function (d) {
        // Criando tr
        let linha = listaDespesas.insertRow();

        // Criando td
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;

        // ajustando o tipo
        switch (parseInt(d.tipo)) {
            case 1:
                d.tipo = "Alimentação";
                break;
            case 2:
                d.tipo = "Educação";
                break;
            case 3:
                d.tipo = "Lazer";
                break;
            case 4:
                d.tipo = "Saúde";
                break;
            case 4:
                d.tipo = "Transporte";
                break;
        }

        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;

        // Criando botão de excluir
        let btn = document.createElement("button");
        btn.className = "btn btn-danger";
        btn.innerHTML = "<i class='fas fa-times'></i>";
        btn.id = `id_despesa_${d.id}`;
        btn.onclick = function () {
            let id = this.id.replace("id_despesa_", "");
            bd.remover(id);
            window.location.reload();
        };
        linha.insertCell(4).append(btn);
    });
}

function pesquisarDespesa() {
    // Pega os valores inseridos pelo user
    let ano = document.getElementById("ano").value;
    let mes = document.getElementById("mes").value;
    let dia = document.getElementById("dia").value;
    let tipo = document.getElementById("tipo").value;
    let descricao = document.getElementById("descricao").value;
    let valor = document.getElementById("valor").value;

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

    let despesas = bd.pesquisar(despesa);

    carregaListaDespesas(despesas, true);
}
