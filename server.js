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

app.use(session(
  { secret: 'i_still%full_of&gold', 
    cookie: { maxAge: 900000000 },
    resave: true, //сохраняет на клиенте
    saveUninitialized: false,
  }
))

//зачем хэш если пароль изначально можно перехватить? только если бд взломают, но зачем?
//сделаю хэш, чтобы в будущем разместить бд где-то (что понижает уровень безопастности)
//* из-за неразумности идея отложена
// const { createHmac } = await import('node:crypto');
// const myhash = createHmac('sha256', 'iAmGold');

//также ввиду того, что uid может быть украден, он храниться через сессии

//! БЛОК РЕНДЕРА
app.get("/", (req, res) => {
  if (!req.session.uid) {
      res.render("pages/reg");
      return
    }

  db.all("SELECT * FROM users WHERE uid = ?", [req.session.uid], (err,row)=>{
      if(err){
          res.send("Внутренняя ошибка")
      }else{
        switch(row[0].role){
          case null:
            res.render("pages/main", {data: row[0]});
          case "admin":
            res.render("pages/teacher", {data: row[0]});
        }
        
      }
      
  })
})

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

        db.all("SELECT * FROM users WHERE name=? AND mail=? AND pass=?", [req.body.name, req.body.mail, req.body.pass], (err, row) => {
          if (err) {
            res.send("Внутренняя ошибка");
          } else {
            if (row[0]) {
      
              req.session.name = req.body.name
              req.session.uid = row[0].uid
      
              res.send("OK");
      
            } else {
              res.send("Внутренняя ошибка 2");
            }
          }
        })

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
        req.session.uid = row[0].uid

        res.send("OK");

      } else {
        res.send("Несуществующие данные");
      }
    }
  })
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

console.log('Time to rest!')