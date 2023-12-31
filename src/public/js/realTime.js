const socket = io();

socket.on('productUpdate', ()=>{
    location.reload();
})