/////////////////////////////////////// ON LOAD ///////////////////////////////////////
$( document ).ready(() => {
    getAccounts();
    $("#name").append((getUser().client.login).charAt(0).toUpperCase() + (getUser().client.login).slice(1));
})


/////////////////////////////////////// GET LOGIN ///////////////////////////////////////
const login = () => {
    if($('#name').val() || $('#password').val() != "") {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "http://localhost:8081/login",
            data: JSON.stringify({name: $('#name').val(), password: $('#password').val()}),
            success: (result) => {
                localStorage.setItem('login', JSON.stringify(result));  
                location.href = "home.html";
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
    else {
        $("#errorLogin").append("You must type password and name.");
    }
}

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
            $('#transBottom').empty();
            $.each(result, (i, item) => {
                $('#transBottom').append("<div class='transaction' id='transaction"+ item.id +"' class='transaction'></div>");
                $('#transaction' + item.id).append("<p style='margin-left: 30px';>" + i+1 + "</p>");
                $('#transaction' + item.id).append("<p style='margin-left: 10em';>" + item.recaccount + "</p>");
                $('#transaction' + item.id).append("<p style='margin-left: 10em';>" + item.transamount + ' €' + "</p>");
              });
            console.log(result);
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