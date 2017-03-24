var knex = require("knex");
var conection = require("../config/connection").conection;
var bookshelf = require("bookshelf");
var baseDatos = bookshelf(knex(conection));

module.exports.baseDatos = baseDatos;