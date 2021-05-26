$(document).ready(function () {

    var result;
    var cotacaoD0 = {};

    var dataInicial = new Date();

    var diaDaSemana = dataInicial.getDate();

    if (diaDaSemana == 6) {
        dataInicial = dataInicial.setDate(dataInicial.getDate() - 1);
        dataInicial = new Date(dataInicial);
    }
    if (diaDaSemana == 7) {
        dataInicial = dataInicial.setDate(dataInicial.getDate() - 2);
        dataInicial = new Date(dataInicial);
    }


    $.ajax({
        url: "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?%40dataCotacao=" + FormatarParametroQueryString(dataInicial) + "&%24format=json",
        contentType: "application/json",
        dataType: 'json',
        success: function (data) {
            cotacaoD0 = data;
            if (cotacaoD0.value == '') {
                dataInicial = dataInicial.setDate(dataInicial.getDate() - 1);
                dataInicial = new Date(dataInicial);

                $.ajax({
                    url: "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?%40dataCotacao=" + FormatarParametroQueryString(dataInicial) + "&%24format=json",
                    contentType: "application/json",
                    dataType: 'json',
                    success: function (data) {
                        cotacaoD0 = data;
                        document.getElementById("dolar").innerHTML = cotacaoD0.value[0].cotacaoVenda.toString().replace(".", ",");
                        document.getElementById("log").innerHTML = cotacaoD0.value[0].dataHoraCotacao;
                    }
                })
            }
            else {
                document.getElementById("dolar").innerHTML = cotacaoD0.value[0].cotacaoVenda.toString().replace(".", ",");
                document.getElementById("log").innerHTML = "Fechamento de " + cotacaoD0.value[0].dataHoraCotacao;
            }
        }
    });

    function Feriados() {
        //Lista de feriados do site da Febraban
        var feriados = [
            new Date('2021-01-01'),
            new Date('2021-02-15'),
            new Date('2021-02-16'),
            new Date('2021-04-02'),
            new Date('2021-04-21'),
            new Date('2021-05-01'),
            new Date('2021-06-03'),
            new Date('2021-09-07'),
            new Date('2021-10-12'),
            new Date('2021-11-02'),
            new Date('2021-11-15'),
            new Date('2021-12-25'),
        ];
        return feriados;
    }

    function FormatarParametroQueryString(data) {
        var dia = ("0" + (dataInicial.getDate())).slice(-2);
        var mes = ("0" + (dataInicial.getMonth() + 1)).slice(-2);
        var ano = dataInicial.getFullYear();

        var dataIncialQueryString = "'" + mes + "-" + dia + "-" + ano + "'";

        return dataIncialQueryString;
    }
})