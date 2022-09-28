const express = require("express");
const productoModel = require("../productos");
const path = require("path");
const productRouter = express.Router();
const ioSocket = require("../sockets/socket");
const fs = require('fs');
productRouter.use(express.json());
const { buildSchema } = require("graphql");
const { graphqlHTTP } = require("express-graphql");

const borrarProducto = async(args) => {
    const { id } = args;
    return await productoModel.borrarProducto(id);
}

const cargarProductos = async() => {
    return await productoModel.cargar_productos();
}

const guardarProducto = async(args) => {
    const { nombre, precio, imagen } = args;
    const producto = await productoModel.guardar_producto({nombre, precio, imagen});
    ioSocket.sendProducts();
    return producto;
}
productRouter.get('/', async (req, res) => {
   res.send(await cargarProductos());
});
productRouter.get('/:id', async (req, res) => {
    const args = { id: req.params.id };
    res.send(await productoModel.cargarProducto(args));
});

productRouter.post('/', async (req, res) => {
    const response = (await guardarProducto({
        nombre: req.body.title,
        precio: req.body.price,
        imagen: req.body.url
    }));

    return response.id;
});

productRouter.delete('/:id', async (req, res) => {
    res.send(await borrarProducto(req.params.id));
});

const schemaContenido = fs.readFileSync(path.resolve(__dirname + "/../graphql/schemas/schema.graphql")).toString();
const schema = buildSchema(schemaContenido);
const graphMiddle = graphqlHTTP({
    schema,
    graphiql: true,
    rootValue: {
        borrarProducto,
        guardarProducto,
        cargarProductos,
    }
})
module.exports = { productRouter, graphMiddle };