import server from './server.js'
import routeSetter from './routes/index.js'
import { Server } from 'socket.io';
const port = 8080;



// middlewares para actualizar sockets
server.post('/api/products', (req, res, next)=>{
    io.emit('productUpdate');
    next()
})

server.put('/api/products', (req, res, next)=>{
    io.emit('productUpdate');
    next()
})

server.delete('/api/products', (req, res, next)=>{
    io.emit('productUpdate');
    next()
})

routeSetter(server);


const httpServer = server.listen(port, ()=>{
    console.log("Servidor iniciado en puerto " + port)
})

const io = new Server(httpServer);

io.on("connection", (socket)=>{
    console.log("Conexion esablecida " + socket.id)
})