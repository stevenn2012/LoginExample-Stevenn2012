var baseDatos = require("../config/dbLogin").baseDatos;

var usuarios = baseDatos.Model.extend(
    {
        tableName: "usuarios_tb",
        idAttribute: "codUsuario"
    }
);

module.exports = {usuarios:usuarios};