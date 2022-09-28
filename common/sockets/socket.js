const {logError} = require("../../server/utils/loggers");
const socketio = require("socket.io");
const {container: Container} = require("../productos");
const {mensajes: Mensajes} = require("../mensajes");

const mensajes = new Mensajes();

class Socket{
    constructor() {

    }
    build(server) {
        this.io = socketio(server);
        this.io.on('connection', (socket) =>{
            mensajes.cargar_mensajes().then((mensaje) => {
                try {
                    this.io.sockets.emit('mensajes', mensaje);
                }
                catch (e) {
                    logError.error(e);
                }
            });

            socket.on('cargarMensajes', ()=>{
                try {
                    mensajes.cargar_mensajes().then((mensaje) => {
                        this,io.sockets.emit('mensajes', mensaje);
                    });
                }
                catch (e) {
                    logError.error(e);
                }
            })

            socket.on('nuevo mensaje', (mensaje) =>{
                try {
                    mensajes.guardar_mensajes(mensaje).then(() =>{
                        mensajes.cargar_mensajes().then((mens)=>{
                            this.io.sockets.emit('mensajes', mens);
                        });
                    });
                }
                catch (e) {
                    logError.error(e);
                }
            });
        });
    }

    sendProducts() {
        this.io.sockets.emit('productos');
    }
}

const ioSocket = new Socket();
module.exports = ioSocket;
