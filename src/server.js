import express from "express";
import handlebars from "express-handlebars";

const server = express();

server.engine("handlebars", handlebars.engine());
server.set('views', process.cwd() + `/src/views/` );
server.set('view engine', "handlebars");
server.use(express.static(process.cwd() + '/src/public'));
server.use(express.json());

export default server;


