function reg(){
    // r = document.getElementById(col_reg).children;
    // добавить через form или children для быстрого анализа формы
    data = {
        name: document.getElementById("r_name").value, 
        surname: document.getElementById("r_surname").value, 
        mail: document.getElementById("r_mail").value, 
        pass: document.getElementById("r_pass").value
    }
    POST("/reg", data, (text) => {
        console.log(text);
    })
}

