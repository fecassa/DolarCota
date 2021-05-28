$(document).ready(function () {

    var dataInicial = new Date();
    var dataFinal = new Date();

    dataInicial = new Date(dataInicial.setDate(dataInicial.getDate() - 15));

    var dataIncialQueryString = FormatarParametroQueryString(dataInicial);
    var dataFinalQueryString = FormatarParametroQueryString(dataFinal);

    var historicoCotacoes = {};
    var totalCotacoes;

    console.log("Data inicial : " + dataIncialQueryString)
    console.log("Data final : " + dataFinalQueryString)

    var urlbcb = "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?%40dataInicial=" + dataIncialQueryString + "&%40dataFinalCotacao=" + dataFinalQueryString + "&%24format=json";

    console.log("URL bacen: " + urlbcb);

    // Set chart options
    var options = {
        'titlePosition': 'none',
        'width': 600,
        'height': 300,
        'legend': { position: 'none' },
    };

    $.ajax({
        url: urlbcb,
        contentType: "application/json",
        dataType: 'json',
        success: function (data) {
            totalCotacoes = data.value.length;
            historicoCotacoes = data;
            console.log("Número de cotações no período: " + totalCotacoes);

            document.getElementById("dolar").innerHTML = historicoCotacoes.value[totalCotacoes - 1].cotacaoVenda.toString().replace(".", ",");

            google.charts.load('current', { 'packages': ['line'] });
            google.charts.setOnLoadCallback(drawChart);
        }
    });

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawChart() {

        var indiceCotacao = totalCotacoes - 10;
        var dataCotacaoGrafico;
        var valorCotacaoGrafico;

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Dia');
        data.addColumn('number', 'Cotacao');

        for (var contador = 1; contador <= 10; contador++) {
            dataCotacaoGrafico = new Date(historicoCotacoes.value[indiceCotacao].dataHoraCotacao);
            valorCotacaoGrafico = historicoCotacoes.value[indiceCotacao].cotacaoVenda.toString();

            data.addRows([
                [(dataCotacaoGrafico.getDate().toString() + "/" + (dataCotacaoGrafico.getMonth() + 1).toString()), Number(valorCotacaoGrafico)]
            ]);

            indiceCotacao = indiceCotacao + 1;
        }

        var NumberFormat = new google.visualization.NumberFormat(
            //You can explore various type of patterns in Documentation
            { pattern: '##.####' }
        );

        NumberFormat.format(data, 1); // Apply formatter to second column

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.charts.Line(document.getElementById('chart_div'));

        chart.draw(data, google.charts.Line.convertOptions(options));
    }

    function FormatarParametroQueryString(data) {
        var dia = ("0" + (data.getDate())).slice(-2);
        var mes = ("0" + (data.getMonth() + 1)).slice(-2);
        var ano = data.getFullYear();

        var dataIncialQueryString = "'" + mes + "-" + dia + "-" + ano + "'";

        return dataIncialQueryString;
    }
})