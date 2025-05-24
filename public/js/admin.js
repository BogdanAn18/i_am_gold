

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


function getUsers(){   
    document.getElementById('table_cont').hidden = false;
}

