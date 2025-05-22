// function escapeHtml(str) {
//     return str
//       .replace(/&/g, '&amp;')
//       .replace(/</g, '&lt;')
//       .replace(/>/g, '&gt;')
//       .replace(/"/g, '&quot;')
//       .replace(/'/g, '&#39;')
//       .replace(/`/g, '&#x60;');
//   }
//* не уверен, что проверка необходима на пароль, ввиду того, что там могут быть разные символы

function reg() {
    err = false;
    r = document.getElementById("col_reg").children;

    if ((/^[а-яА-Я]+$/.test(r[2].value)) && (/^[а-яА-Я]+$/.test(r[3].value))) {
        //имя фамилия норм
    } else {
        Alert('Ваше ФИ неверно');
        err = true;
    }

    const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
    if (EMAIL_REGEXP.test(r[4].value)) {
        //почта в порядке
    } else {
        Alert('Неверные данные почты');
        err = true;
    }

    if (r[5].value == r[6].value) {
        //пароли совпадают
    } else {
        Alert('Пароли не совпадают');
        err = true;
    }


    if (!err) {
        data = {
            name: r[2].value,
            surname: r[3].value,
            mail: r[4].value,
            pass: r[5].value,
        }
        POST("/reg", data, (text) => {
            if(text != "OK"){
                Alert(text);
            }else{
                Alert("Успешно!", () => {window.location.replace("/")})
                console.log(text);
            }
        })
    }
}

function log() {

    err = false;

    l = document.getElementById("col_log").children;

    if (/^[а-яА-Я]+$/.test(l[2].value)) {
        //имя норм
    } else {
        Alert('Ваше Имя неверно');
        err = true;
    }

    const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
    if (EMAIL_REGEXP.test(l[3].value)) {
        //почта в порядке
    } else {
        Alert('Неверные данные почты');
        err = true;
    }

    if (!err) {
        data = {
            name: l[2].value,
            mail: l[3].value,
            pass: l[4].value,
        }
        POST("/log", data, (text) => {
            if(text != "OK"){
                Alert(text);
            }else{
                Alert("Успешно!", () => {window.location.replace("/")})
                console.log(text);
            }
        })
    }
}