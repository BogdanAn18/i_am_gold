const express = require("express");

const app = express();
const port = 3000;
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("db.db");

const bodyParser = require("body-parser");
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ dest: "upload/", extended: false })); 
//* заставляет читать body, изначальная библиотека Node.js

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

const { createHmac } = await import('node:crypto');
//зачем хэш если пароль изначально можно перехватить? только если бд взломают, но зачем?
//сделаю хэш, чтобы в будущем разместить бд где-то (что понижает уровень безопастности)
const myhash = createHmac('sha256', 'iAmGold');

//! БЛОК РЕНДЕРА
app.get("/", function (req, res) {
  res.render("pages/reg");
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


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
console.log('Time to rest!')