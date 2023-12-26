import express from "express";
import handlebars from "express-handlebars";

const server = express();

server.engine("handlebars", handlebars.engine());
server.set('views', process.cwd + `/src/views` );
server.use(express.json());

export default server;


