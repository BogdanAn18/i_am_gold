const express = require("express");

const app = express();
const port = 3000;
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("db.db");

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ dest: "upload/", extended: false })); 
//*пара парсеров на будущее

app.set("view engine", "ejs"); 

app.use(express.static("public"));

app.use((req, res, next) => {
  if (!req.cookies.tid) {
    req.cookies.tid = Date.now();
    res.cookie("tid", req.cookies.tid, { maxAge: 9000000000000, httpOnly: true });
  }
  next();
});

//! БЛОК РЕНДЕРА
app.get("/", function (req, res) {
  res.render("pages/main");
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

console.log('Hello to all!')
console.log('Time to rest!')