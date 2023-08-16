class CaixaDaLanchonete {

    calcularValorDaCompra(metodoDePagamento, itens) {
        var menu = [
            {"codigo":"cafe", "descricao":"Café", "valor":3.00, "tipo":"principal"},
            {"codigo":"chantily", "descricao":"Chantily (extra do Café)", "valor":1.5, "tipo":"extra", "codigoPrincipal":"cafe"},
            {"codigo":"suco", "descricao":"Suco Natural", "valor":6.2, "tipo":"principal"},
            {"codigo":"sanduiche", "descricao":"Sanduíche", "valor":6.5, "tipo":"principal"},
            {"codigo":"queijo", "descricao":"Queijo (extra do Sanduíche)", "valor":2.0, "tipo":"extra", "codigoPrincipal":"sanduiche"},
            {"codigo":"salgado", "descricao":"Salgado", "valor":7.25, "tipo":"principal"},
            {"codigo":"combo1", "descricao":"1 Suco e 1 Sanduíche", "valor":9.5, "tipo":"combo"},
            {"codigo":"combo2", "descricao":"1 Café e 1 Sanduíche", "valor":7.5, "tipo":"combo"}
        ];
       
        var temItemPrincipal = false;
        var metodoPagamentoValido = verificaMetodoPagamentoValido(metodoDePagamento);
        var valorTotal = 0.0;
        var mensagemErro = "";

        //Verifica se o metodo de pagamento é válido
        if (!metodoPagamentoValido) {
            return 'Forma de pagamento inválida!';
        }

        //Verifica se a lista de itens está vazia
        if (itens == null || itens.length == 0) {
            return "Não há itens no carrinho de compra!";
        }

        /* Percorre a lista de itens pedidos
            1 - Verifica código do item é valido
            2 - verifica itens extras sem o pedido principal
            3 - Calcula valor total
        */
        itens.forEach(function (item) {
            var itemPedido = item.split(','); //Retorna um array [codigo, quantidade]
            var itemMenu = procuraItemNoMenu(itemPedido, menu);

            //Verifica se o código do item não existe
            if(itemMenu == null) {
                mensagemErro = "Item inválido!";
                return mensagemErro;
            }

            //Verifica se a quantidade do item é zero
            if (itemPedido[1] == 0) {
                mensagemErro = "Quantidade inválida!";
                return mensagemErro;
            }

            //Se o item pedido for extra, verifica se existe algum item principal no pedido
            if (itemMenu.tipo == "extra") {
                temItemPrincipal = verificaSeTemItemPrincipal(itemMenu, itens)

                //Verifica sem o item principal no pedido
                if (!temItemPrincipal) {
                    mensagemErro = "Item extra não pode ser pedido sem o principal";
                    return mensagemErro;
                }
            }

            //Calcula o valor da compra, valor x quantidade
            var valorDoItem = itemMenu.valor * itemPedido[1]
            valorTotal += valorDoItem; //soma no valor total do pedido
        });

        //Pagamento em dinheiro tem 5% de desconto
        if (metodoDePagamento == "dinheiro") {
            var desconto = valorTotal * 0.05;
            valorTotal -= desconto;
        }

        //Pagamento a crédito tem acréscimo de 3% no valor total
        if (metodoDePagamento == "credito") {
            var acrescimo = valorTotal * 0.03;
            valorTotal += acrescimo;
        }

        //fixa em apenas dois digitos depois da virgula, e converste p Float
        valorTotal = parseFloat(valorTotal.toFixed(2));
        var valorTotalFormatado = parseFloat(valorTotal).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});

        //Se tiver mensagem de erro, retorna a mensagem
        if(mensagemErro != "") {
            return mensagemErro;
        }
        return valorTotalFormatado;
    }

}

/*Percorre a lista de itens para verificar se tem o item principal*/
function verificaSeTemItemPrincipal(itemExtra, itens) {
    var itemPrincipal = false;
    itens.forEach(function (item) {
        var itemSelecionado = item.split(',');
        if(itemExtra.codigoPrincipal == itemSelecionado[0]) {
            itemPrincipal = true;
            return itemPrincipal;
        }
    })
    return itemPrincipal;
}

/*Percorre o menu e pega o item pedido*/
function procuraItemNoMenu(itemPedido, menu) {
    var itemEncontrado = null;
    menu.forEach(function(itemMenu) {
        if(itemPedido[0] == itemMenu.codigo) {
            itemEncontrado = itemMenu;
            return itemMenu;
        }
    })
    return itemEncontrado;
}

function verificaMetodoPagamentoValido(metodoPagamento) {
    var metPagamentos = ['dinheiro','credito','debito']; 
    if (metPagamentos.includes(metodoPagamento)) {
        return true;
    }
    return false;
}


export { CaixaDaLanchonete };
