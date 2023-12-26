import server from './server.js'
import routeSetter from './routes/index.js'

const port = 8080;

routeSetter(server);

server.listen(port, ()=>{
    console.log("Servidor iniciado en puerto " + port)
})