const modeloMensajes = require("../common/mongoModels/modeloMensajes");
if (process.env.NODE_ENV === "test") {
    const modeloMensajes = require("../common/mongoModels/modeloMensajes");
    const modeloProductos = require("../common/mongoModels/modeloProductos");
    const modeloUsuarios = require("../common/mongoModels/modeloUsuario");

    class TestManager {
        constructor() {
        }

        async resetDatabase() {
            await modeloMensajes.deleteMany({});
            await modeloProductos.deleteMany({});
            await modeloUsuarios.deleteMany({});
        }

        async addEssentials() {
            const mensajeSaveModel = new modeloProductos({id: 1, nombre: "test", precio: "12", imagen: "https://www.test.com"});
            await mensajeSaveModel.save();
        }
    }
    module.exports = new TestManager();
}