const express = require("express");


const app = express();
const port = 3000;
var session = require('express-session');
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("db.db");

const bodyParser = require("body-parser");
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ dest: "upload/", extended: false })); 
//* заставляет читать body, изначальная библиотека Node.js
//* "Модуль body-parser необходим для корректной обработки передаваемых в теле данных."

app.set("view engine", "ejs"); 

app.use(express.static("public"));

// app.use((req, res, next) => {
//   if (!req.cookies.tid) {
//     req.cookies.tid = Date.now();
//     res.cookie("tid", req.cookies.tid, { maxAge: 9000000000000, httpOnly: true });
//   }
//   next();
// });
//? куки на будущее

app.use(session({ secret: 'i_still%full_of&gold', cookie: { maxAge: 60000 } }))

//зачем хэш если пароль изначально можно перехватить? только если бд взломают, но зачем?
//сделаю хэш, чтобы в будущем разместить бд где-то (что понижает уровень безопастности)
//* из-за неразумности идея отложена
// const { createHmac } = await import('node:crypto');
// const myhash = createHmac('sha256', 'iAmGold');

//! БЛОК РЕНДЕРА
app.get("/reg", function (req, res) {
  res.render("pages/reg");
});

app.get("/", function (req, res) {
  res.render("pages/main");
});


//! ОБРАБОТКА ЗАПРОСОВ
app.post("/reg", (req, res) => {
  db.all(
    `INSERT INTO users (name, surname, mail, pass) VALUES (?,?,?,?)`,
    [req.body.name, req.body.surname, req.body.mail, req.body.pass],
    (err, row) => {
      if (err) {
        console.log(err);
        res.send("ERR");
      } else {
        res.send("OK");
      }
    }
  );
});


app.post('/log', (req, res) => {

  db.all("SELECT * FROM users WHERE name=? AND mail=? AND pass=?", [req.body.name, req.body.mail, req.body.pass], (err, row) => {
    if (err) {
      res.send("Внутрянняя ошибка");
    } else {
      if (row[0]) {

        req.session.name = req.body.name
        req.session.uid = row[0].id

        res.send("OK");

      } else {
        res.send("Несуществующие данные");
      }
    }
  })
})

app.get("/getUserInfo", (req, res) => {
  if (!req.session.uid) {
      res.send("NO");
      return
    }

  db.all("SELECT * FROM users WHERE uid = ?", [req.session.uid], (err,row)=>{
      if(err){
          res.send("Внутряння ошибка")

      }else{
        res.send(row);
      }
      
  })
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
console.log('Time to rest!')