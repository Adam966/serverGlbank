/////////////////////////////////////// ON LOAD ///////////////////////////////////////
$('#document').ready(() => {
    getAccounts();
    $("#name").append((getUser().client.login).charAt(0).toUpperCase() + (getUser().client.login).slice(1));
})

////////////////////////////////////// BUTTONS ////////////////////////////////////////
const renderCards = () => {
    $('.hideCards').show(); 
    $('.hideAccounts').hide();
}

const renderAccounts = () => {
    $('.hideCards').hide(); 
    $('.hideAccounts').show();
}

//////////////////////////////////////// LOGOUT ///////////////////////////////////////
const getUser = () => {
    return JSON.parse(localStorage.getItem('login'));
}

const logout = () => {
    localStorage.removeItem('login');
    location.href = "index.html";
}

/////////////////////////////////////// GET ACCOUNTS ///////////////////////////////////////
const getAccounts = () => {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "http://localhost:8081/accounts",
        data: JSON.stringify({
            token: getUser().token, 
            id: getUser().client.idclient
        }),
        success: (result) => {
            $.each(result, (i, item) => {
                console.log(result);
                
                $("#accounts").append($("<option>").attr({'value': item.accnum, 'id': item.id}).text(item.accnum));
                $("#accountCard").append($("<option>").attr({'value': item.accnum, 'id': item.id}).text(item.accnum));
            });
        },
        error: (xhr) => { 
            console.log(xhr.status);
        }	
    });
}

/////////////////////////////////////// GET CARDS ///////////////////////////////////////
const getCards = () => {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "http://localhost:8081/cards",
            data: JSON.stringify({
                token: getUser().token,
                accID: $('#accountCard option:selected').attr('id')
            }),
            success: (result) => {  
                console.log(result);
                $("#cards").empty();
                $.each(result, (i, item) => {
                    $("#cards").append($("<option>").attr({'value': item.cardnum, 'id': item.id}).text(item.cardnum));
                });
            },
            error: (xhr) => { 
                console.log(xhr.status);
            }	
        });
}   
/////////////////////////////////////// CARD INFO ///////////////////////////////////////
const getCardInfo = () => {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "http://localhost:8081/cardInfo",
        data: JSON.stringify({
            token: getUser().token,
            cardNum: $('#cards option:selected').attr('value')
        }),
        success: (result) => {  
            console.log(result);
            $('#date').text(result[0].expirey + '/' + result[0].expirem);
            if(result[0].active == 1)
                $('#status').text('active');
            else 
                $('#status').text('unactive');
        },
        error: (xhr) => { 
            console.log(xhr.status);
        }	
    });
}   

//////////////////////////////////////// PAYMENT ///////////////////////////////////////////
const payment = () => {
    console.log($('#amount').val());
    console.log(parseFloat($('#money').text()));
    
    if($('#amount').val() < parseFloat($('#money').text())) {
        let d = new Date();
        let datestring = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate() + 1
        $.ajax({
            type: "PUT",
            contentType: "application/json; charset=utf-8",
            url: "http://localhost:8081/trans",
            data: JSON.stringify({
                token: getUser().token,
                transamount: $('#amount').val(),
                transdate: datestring,
                recaccount: $('#recacc').val(),
                type: 1,
                idaccount: $('#accounts option:selected').attr('id'),
                balance: parseFloat($('#money').text()) - $('#amount').val()
            }),
            success: (result) => {  
                console.log(result);
                getTransHistory();
                getAccInfo();
            },
            error: (xhr) => { 
                console.log(xhr.status);
            }	
        });
    } else {
        alert('You dont have enough money!')
    }

}

//////////////////////////////////////// BLOCK CARD ////////////////////////////////////////
const blockCard = () => {
    $.ajax({
        type: "PUT",
        contentType: "application/json; charset=utf-8",
        url: "http://localhost:8081/block",
        data: JSON.stringify({
            token: getUser().token,
            cardnum: $('#cards option:selected').attr('value'),
            status: 0
        }),
        success: (result) => {  
            console.log(result);
            getCardInfo();
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
            token: getUser().token,
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
            token: getUser().token,
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


