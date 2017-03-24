var express = require('express');
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var session = require("express-session");
var bcrypt = require("bcrypt-nodejs");
var usuarioModel = require("../models/usuarios");
var bodyParser = require("body-parser");
var urlencodeParse = bodyParser.urlencoded({extended:false});

/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/
router.post("/signUp",function(request, res){
  var usuario = request.body;
  var usuarioPromise = new usuarioModel.usuarios({correo:usuario.correo}).fetch();
  return usuarioPromise.then(
    function(modelo){
      if(modelo){
        res.render("index",{title: "Registro Usuario",error:"El usuario existe"});
      }else{
        usuario.clave = bcrypt.hashSync(usuario.clave);
        var modeloUsuario = new usuarioModel.usuarios(
          {
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            correo: usuario.correo,
            clave: usuario.clave
          }
        );
        modeloUsuario.save().then(function(modelo){
          res.render("index",{title: "Registro Usuario",error:"El usuario fue Creado"});
        });
      }
    }
  );
});

router.post("/iniciarSesion",urlencodeParse, function(req, res, next){
  passport.authenticate('local', 
  {
    successRedirect:"/bienvenido",
    failureRedirec: "/login",  
  },
  function(err, usuario, info){
    if(err){
      return res.render("login",{title:"Express",error: err.message});
    }
    if(!usuario){
      return res.render("login",{title:"Express",error: info.message});
    }
    return req.logIn(usuario, function(err){
      if(err){
        return res.render("login",{title:"Express",error: err.message});
      }else{
        res.render("bienvenido",{title: "Bienvenido", usuario:usuario});
      }
    });
  }
  )(req,res,next);
});

router.post("/cerrarSesion",function(){
  if(!req.isAuthenticated()){
    res.render("login",{title: "Express"});
  }else{
    req.logout();
    res.redirect("/");
    }
});

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirec: '/login'}), function(request, response){
  response.redirect('/bienvenido');
});

module.exports = router;
