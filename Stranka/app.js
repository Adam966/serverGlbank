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
                    
            if(xhr.status == 403){
                error.empty();
                $("#errorLogin").append("Error login account not found.");
            }
    
            if(xhr.status == 401){
                error.empty();
                $("#errorLogin").append("Error bad login");
            }
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
                    
            if(xhr.status == 403){
                error.empty();
                $("#errorLogin").append("Error login account not found.");
            }
    
            if(xhr.status == 401){
                error.empty();
                $("#errorLogin").append("Error bad login");
            }
        }	
    });
    getTransHistory();
}

/////////////////////////////////////// ACCOUNT INFO ///////////////////////////////////////
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
                    
            if(xhr.status == 403){
                error.empty();
                $("#errorLogin").append("Error login account not found.");
            }
    
            if(xhr.status == 401){
                error.empty();
                $("#errorLogin").append("Error bad login");
            }
        }	
    });
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
        $('#transaction' + item.id).append("<p style='margin-left: 10em';>" + item.transamount + ' €' + "</p>");
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
                backgroundColor: "rgb(229, 18, 28)",
                data: []
            },{
                label: "Income", 
                backgroundColor: "rgb(37, 206, 18)",
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
        } /* else {
            expenses.data.labels.push(item.transdate);
            expenses.data.datasets[1].data.push(item.transamount);
        } */
    })
    
    expenses.update();
} 