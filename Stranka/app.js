/////////////////////////////////////// ON LOAD ///////////////////////////////////////
$('#document').ready(() => {
    getAccounts();
    $("#name").append((getUser().client.login).charAt(0).toUpperCase() + (getUser().client.login).slice(1));
})

/////////////////////////////////////// GET ACCOUNTS ///////////////////////////////////////
const getAccounts = () => {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "http://localhost:8081/accounts",
        data: JSON.stringify({
            token: getUser().token, id: getUser().client.idclient
        }),
        success: (result) => {
            $.each(result, (i, item) => {
                $("#accounts").append($("<option>").attr({'value': item.accnum, 'id': item.id}).text(item.accnum));
              });
        },
        error: (xhr) => { 
            console.log(xhr.status);
        }	
    });
}

/////////////////////////////////////// ACCOUNT INFO ///////////////////////////////////////
const getAccInfo = () => {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "http://localhost:8081/accInfo",
        data: JSON.stringify({
            accNum: $("#accounts option:selected").val()
        }),
        success: (result) => {
            $('#money').text(result[0].amount + ' €');
        },
        error: (xhr) => { 
            console.log(xhr.status);
        }	
    });
    getTransHistory();
}

/////////////////////////////////////// TRANS INFO ///////////////////////////////////////
const getTransHistory = () => {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "http://localhost:8081/transHistory",
        data: JSON.stringify({
            accID: $('#accounts option:selected').attr('id')
        }),
        success: (result) => {  
            renderTransaction(result);
            renderChart(result);
        },
        error: (xhr) => { 
            console.log(xhr.status);
        }	
    });
}

/////////////////////////////////////// GET CARDS ///////////////////////////////////////
const getCards = () => {
    if($('#accounts option:selected').attr('id') == null) {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "http://localhost:8081/cards",
            data: JSON.stringify({
                accID: $('#accounts option:selected').attr('id')
            }),
            success: (result) => {  
                console.log(result);
                
                $.each(result, (i, item) => {
                    $("#cards").append($("<option>").attr({'value': item.cardnum, 'id': item.id}).text(item.cardnum));
                });
            },
            error: (xhr) => { 
                console.log(xhr.status);
            }	
        });
    } else {
        $("#account_bottom").append("<p>choose acc num</p>");
    }
}   

const getUser = () => {
    return JSON.parse(localStorage.getItem('login'));
}

const logout = () => {
    localStorage.removeItem('login');
    location.href = "index.html";
}

//////////////////////////////////////// RENDER TRANSACTIONS, CHARTS ////////////////////////////////////////
const renderTransaction = (result) => {
    $('#transBottom').empty();
    let index = 0;
    $.each(result, (i, item) => {
        index++;
        $('#transBottom').append("<div class='transaction' id='transaction"+ item.id +"' class='transaction'></div>");
        $('#transaction' + item.id).append("<p style='margin-left: 30px';>" + index + "</p>");
        $('#transaction' + item.id).append("<p style='margin-left: 10em';>" + item.recaccount + "</p>");
        if(item.type == 1)
            $('#transaction' + item.id).append("<p style='margin-left: 9em';>" + '- ' + item.transamount + ' €' + "</p>");
        else
            $('#transaction' + item.id).append("<p style='margin-left: 9em';>" + '+ ' + item.transamount + ' €' + "</p>");
      });
    console.log(result);
}

const renderChart = (result) => {
    let chart = document.getElementById('expenses').getContext('2d');
    let expenses = new Chart(chart, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: "Expenese", 
                fill: false,
                borderColor: 'red',
                data: []
            },{
                label: "Income", 
                fill: false,
                borderColor: 'green',
                data: []
            }]
        },
        options: {
            
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    //1 expense 0 income
    $.each(result, (i, item) => {
        if(item.type == 1) {
            expenses.data.labels.push(item.transdate);
            expenses.data.datasets[0].data.push(item.transamount);
        } else {
            expenses.data.labels.push(item.transdate);
            expenses.data.datasets[1].data.push(item.transamount);
        } 
    })
    
    expenses.update();
} 

const renderCards = () => {
    $('.account_bottom').empty();
    $('.account_bottom').append("<p class='title' >Card Number: </p>");
    $('.account_bottom').append("<select id='cards' style='margin-left: 30px; margin-top: -10px; border-radius: 5px; width: 110px' onchange='getCardInfo()'><option value=''></option></select> ");
    
    getCards();
}

const renderAccounts = () => {
    $('.account_upper').empty();
    $('.account_upper').append("<p class='title' id='name'>Account Owner:</p>");
    $('.account_upper').append("<p class='title' id='name'>Account Owner:</p>");
}

