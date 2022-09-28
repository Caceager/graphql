const { expect } = require("chai");
const supertest = require("supertest");
const {describe, it} = require("mocha");
const app = require('./server');
const request = supertest(app);
const suiteManager = require("./tests/testsUtils");

beforeEach( async () => {
    await suiteManager.addEssentials();
})

afterEach( async() => {
     await suiteManager.resetDatabase();
});

describe("/api/productos", async () => {
    describe("GET /api/productos", async () => {
        it('Debería traer una lista con los productos disponibles.', async () => {
            const response = await request.get('/api/productos');
            expect(response.status).to.equal(200);
            expect(typeof response.body).to.equal("object");
        });

        it ("Si existe al menos un producto en la base de datos, el tamaño de la respuesta debería ser mayor a 0", async () => {
            const response = await request.get('/api/productos');
            expect(response.status).to.equal(200);
            expect(response.body.length).to.be.greaterThan(0);
        });
    });
    describe("POST /api/productos", async () => {
        it ("Si guardo un producto, éste debería persistir en la base de datos.", async() => {
           const response1 = await request.post('/api/productos').send({title: "test", price: 40, url: "www.test.com"});
           expect(response1.status).to.equal(200);
           const productId = response1.body.productId;
           const response2 = await request.get('/api/productos');
           const productoGuardado = response2.body.find( (producto) => producto.id === productId);
           expect(productoGuardado).to.exist;
        });
    });

    describe("GET /api/productos/:idProducto", async() => {
       it("Si busco un producto por su id, éste debería ser devuelto.", async () => {
            const response = await request.get('/api/productos/1');
            expect(response.body[0].id).to.equal(1);
       });
    });

    describe("DELETE /api/productos/:idProducto", async() => {
        it("Si elimino un producto por su id, éste debería ser efectivamente eliminado.", async () => {
            const response = await request.get('/api/productos/1');
            expect(response.status).to.equal(200);
            expect(response.body[0].id).to.equal(1);

            const response1 = await request.delete('/api/productos/1');
            expect(response1.status).to.equal(200);
            expect(response1.body.deletedCount).to.equal(1);

            const response2 = await request.get('/api/productos/1');
            expect(response2.status).to.equal(200);
            console.log(response2.body);
            expect(response2.body.length).to.equal(0);
        });
    });

});