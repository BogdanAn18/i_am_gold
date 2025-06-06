let ExpirementalThemes = ["Электричество", "Механика", "Гидростатика", "Оптика", "Динамика"]
ExpSelect = document.getElementById("expirement_theme_select");
for (let i = 0; i < ExpirementalThemes.length; i++) {
    const el = ExpirementalThemes[i];
    let newExpTheme = document.createElement('option');
    newExpTheme.textContent = el;
    ExpSelect.appendChild(newExpTheme);
}


UsersData = document.getElementById("UsersData");
POST("/getUsers", {}, (text) => {
    data = JSON.parse(text);
    let uids = [];
    UsersData.innerHTML = "";
    for (let index = 0; index < data.length; index++) {
        let user = data[index];
        inpId = "tabel_input_"+user.uid;

        uids.push(user.uid);

        UsersData.innerHTML += `
            <tr>
                <td>${user.surname}</td>
                <td>${user.name}</td>
                <td>${user.mail}</td>
                <th>
                    <input id = "${inpId}" type="text" class="roletext" value="${user.role}"></input>
                </th>
            </tr>
        `
    }

    //для загрузки онкликов
    for (let index2 = 0; index2 < uids.length; index2++) {
        let elId = uids[index2];
        inp16 = document.getElementById("tabel_input_"+elId);
        inp16.addEventListener('keydown', (event)=>{
            if(event.key == 'Enter'){
                roleChange(elId);
            }
        })
    }
})


//* Изменение ролей
function roleChange(uid){
    let inpItem = document.getElementById("tabel_input_"+uid);
    data = {
        'uid': uid, 
        'role': inpItem.value
    }
    POST('/changeRole', data, (text) => {
        if(text == "OK"){
            Alert("Роль изменена.");
        }else{
            Alert("Ошибка: " + text);
        }
    });
}


//* Drag-n-Drop

let ZonesId = ["TheoryDropZone","EDZ_Task", "EDZ_Sol", "EDZ_Criteria"]
let InputsId = ["theory_file","EF_Task", "EF_Sol", "EF_Criteria"]

for (let AreaIndex = 0; AreaIndex < ZonesId.length; AreaIndex++) {
    let dropArea = document.getElementById(ZonesId[AreaIndex]);

    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('active');
    });
    
    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('active');
    });

    dropArea.addEventListener('drop', (e)=> {
        e.preventDefault();
        dropArea.classList.remove('active');
        file = e.dataTransfer.files;
        Input_html = document.getElementById(InputsId[AreaIndex]);
        Input_html.files = file;
    });
}

//* Отправка теор листочков на сервер

function newTheory(){
    Theory_file = document.getElementById('theory_file').files[0];
    title =  document.getElementById('theory_title_text');
    text = document.getElementById('theory_text');

    const formData = new FormData();

    formData.append("title", title.value);
    formData.append("text", text.value);
    formData.append("file", Theory_file);

    fetch('/newTheory', {
        method: 'POST',
        body: formData
    })
    .then((response) => response.text())
        .then((text) => {
            if(text == "OK"){
                Alert("Файл загружен!")
            }else{
                Alert("Внутренняя ошибка")
            }
        });
}

//* Отправка праков на сервер

function newExpirement(){
    Expirement_file = document.getElementById('expirement_file').files[0];
    title =  document.getElementById('expirement_title_text');
    text = document.getElementById('expirement_text');

    const formData = new FormData();

    formData.append("title", title.value);
    formData.append("text", text.value);
    formData.append("file", Expirement_file);

    fetch('/newExpirement', {
        method: 'POST',
        body: formData
    })
    .then((response) => response.text())
        .then((text) => {
            if(text == "OK"){
                Alert("Файл загружен!")
            }else{
                Alert("Внутренняя ошибка")
            }
        });
}


function uploadUsers(){   
    document.getElementById('table_cont').hidden = false;
}

function uploadTheory(){
    document.getElementById('Theory').hidden = false;
}
function uploadExpirement(){
    document.getElementById('Expirement').hidden = false;
}