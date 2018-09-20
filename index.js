const express = require("express");
const server = express();
const bodyParser = require('body-parser');
const routes = require("./api-routes");

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// Указание статической папки public
server.use('/public', express.static('public'));
server.use('/api/', routes)
/* Подключение обработчика шаблонов pug, шаблоны - в папке views
*/
server.set("view engine", "pug");
server.set("views", `./views`);


server.listen(3000);