const express = require("express");
const multer = require('multer');
const uploadT = multer({ dest: 'uploads/theory' });
const uploadE = multer({ dest: 'uploads/experiment' });

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

//! ЧИСТО ДЛЯ ВЕРСТКИ - ПОТОМ УБРАТЬ!
app.get("/", (req, res) => {
  req.session.uid = 16;
  res.render("pages/admin", {data: [16, "Богдан"]});
})
//! БЛОК РЕНДЕРА
// app.get("/", (req, res) => {
//   if (!req.session.uid) {
//       res.render("pages/reg");
//       return
//     }

//   db.all("SELECT * FROM users WHERE uid = ?", [req.session.uid], (err,row)=>{
//       if(err){
//           res.send("Внутренняя ошибка")
//       }else{
//         switch(row[0].role){ 
//           //switch case после верно выполненного условия выполняет ВСЁ что идёт далее (до конца break/всего switch)
//           case "admin":
//             res.render("pages/admin", {data: row[0]});
//             break;
//           case "teacher":
//             res.render("pages/teacher", {data: row[0]});
//             break;
//           case "student":
//             res.render("pages/student", {data: row[0]});
//             break;
//           default:
//             res.render("pages/wait", {data: row[0]});
//             break;
//         }
//       }
//   })
// })

//! ОБРАБОТКА ЗАПРОСОВ
app.post("/reg", (req, res) => {
  db.run(
    `INSERT INTO users (name, surname, mail, pass) VALUES (?,?,?,?)`,
    [req.body.name, req.body.surname, req.body.mail, req.body.pass],
    (err, row) => {
      if (err) {
        console.log(err);
        res.send("Внутренняя ошибка");
      } else {
        res.send("OK");
    }
  });
});


app.post('/log', (req, res) => {

  db.all("SELECT * FROM users WHERE name=? AND mail=? AND pass=?", [req.body.name, req.body.mail, req.body.pass], (err, row) => {
    if (err) {
      res.send("Внутренняя ошибка");
    } else {
      if (row[0]) {

        req.session.name = req.body.name;
        req.session.uid = row[0].uid;

        res.send("OK");

      } else {
        res.send("Несуществующие данные");
        
      }
    }
  })
})

app.post('/getUsers', (req, res) => {
  if (!req.session.uid) {
    res.render("pages/reg");
    return
  }

  db.all("SELECT uid,name,surname,mail,role FROM users", (err, row) => {
  if (err) {
    res.send("Внутренняя ошибка");
  } else {
    res.send(row);
  }
})})

app.post('/changeRole', (req,res) => {
  if (!req.session.uid) {
    res.render("pages/reg");
    return
  }

  db.run("UPDATE users SET role = ? WHERE uid = ?", [req.body.role, req.body.uid], (err,row) => {
    if (err) {
      res.send("Внутренняя ошибка");
    } else {
      res.send("OK");
    }
  })
})

app.post("/newTheory", uploadT.single("file"), function (req, res, next) {
  if (!req.session.uid) {
    res.render("pages/reg");
    return
  }

  db.run(
    `INSERT INTO theory (title, mtext, image) VALUES (?,?,?)`,
    [req.body.title, req.body.text, req.file.path], //можно также filename чтобы хранить чисто имя
    (err) => {
      if (err) {
        console.log(err);
        res.send("Внутренняя ошибка");
      } else {
        // res.send(`Загружено! <a href="/admin1234">Нажите чтобы вернуться</a>`);
        res.send("OK");
      }
    }
  );
});


app.post("/newExpirement", uploadE.array("EFiles", 3), function (req, res, next) {
  if (!req.session.uid) {
    res.render("pages/reg");
    return
  }
  db.run(
    `INSERT INTO expirement (title, theme, file, solution, criteria) VALUES (?,?,?,?,?)`,
    [req.body.title, req.body.theme, req.files[0].path, req.files[1].path, req.files[2].path], //path - ПОЛНЫЙ ПУТЬ, можно также filename чтобы хранить чисто имя
    (err) => {
      if (err) {
        console.log(err);
        res.send("Внутренняя ошибка");
      } else {
        // res.send(`Загружено! <a href="/admin1234">Нажите чтобы вернуться</a>`);
        res.send("OK");
      }
    }
  );
});

app.post('/account_exit', (req, res) => {
  req.session.name = "";
  req.session.uid = "";
  res.send("OK");
})



app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

console.log('Time to rest!')