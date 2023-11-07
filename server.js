const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const db = require("./db/users");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require('./auth.js')(passport);
const login = require("./routes/login.js");
const users = require("./routes/users.js");
const lgpd = require("./routes/lgpd.js");
dotenv.config();
const app = express();


app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser())


function authenticationMiddleware(req, res, next){
  const token = req.cookies.jwt;
  if(token){
    jwt.verify(token, process.env.JWTSECRET, (err)=>{
      if(err){
        req.session.returnTo = req.originalUrl;
        res.redirect("/login?invalido=true");
      } else {
        next();
      }
    })
  }else{
    req.session.returnTo = req.originalUrl;
    res.redirect("/login?invalido=true");
  }
}

const checkUser = (req, res, next)=>{
  const token = req.cookies.jwt

  if(token){
    jwt.verify(token, process.env.JWTSECRET, async(err, decodedToken)=>{
      if(err){
        res.locals.user = null;
        next();
      } else {
        let user = await db.getUserByIdForJwt(decodedToken.id);
        if(user){
          res.locals.user = user;
          next();
        }else{
          res.send("Usuário inativado")
        }
      }
    })
  } else{
    res.locals.user = null;
    next();
  }
}


app.use(
  session({
    secret: process.env.PASSWORD,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 8 * 60 * 60 * 1000}
  })
);

app.get("/", async(req, res)=>{
  res.redirect("/login")
});

app.use("*", checkUser)
app.use("/login", login);
app.use("/usuarios", authenticationMiddleware, users);
app.use("/", authenticationMiddleware, lgpd);

app.listen(process.env.PORT, function () {
  console.log("Node.js funcionando na porta " + process.env.PORT);
});