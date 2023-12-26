import fs from "fs";
const aFs = fs.promises;

export default class CartManager {

    #abortController;
    constructor(path = "./output/carrito.json") {

        this.#abortController = new AbortController();
        this.path = path;

        try {
            const { cartList, idEnum } = JSON.parse(fs.readFileSync(path, 'utf-8'));
            this.cartList = cartList??[];
            this.idEnum = idEnum??0;
        }
        catch {
            this.cartList = [];
            this.idEnum = 0;
            fs.writeFileSync(path, JSON.stringify(this))
        }
    }

    async createCart() {
        const newId = this.idEnum++;
        this.cartList.push({ id: newId, products: [] });
        try {
            this.#abortController.abort();
            this.#abortController = new AbortController();

            await aFs.writeFile(this.path, JSON.stringify(this), { signal: this.#abortController.signal });
            return { message: `Carrito creado correctamente con el id ${newId}` }
        } catch ({ message }) {
            return { error: message }
        }
    }

    // {id, products: []}
    getCart(cId) {
        cId = Number(cId);
        if (Number.isNaN(cId)) {
            return { error: "Los parametros no fueron definidos correctamente", code: 400 }
        }
        if (cId < 0) {
            return { error: "Los parametros no fueron definidos correctamente", code: 400 }
        }
        const result = this.cartList.find(current => current.id == cId);
        if (!result) {
            return { error: "ID not found", code: 404 }
        }

        const [...decoupled] = result.products;

        return decoupled
    }

    // product object {product, quantity}
    async addProduct(cId, pId, quantity) {

        cId = Number(cId);
        if (Number.isNaN(cId)) {
            return { error: "El Id del carrito esta definido incorrectamente", code: 400 }
        }
        if (cId < 0) {
            return { error: "El Id del carrito esta definido incorrectamente", code: 400 }
        }

        pId = Number(pId);
        if (Number.isNaN(pId)) {
            return { error: "El Id del producto esta definido incorrectamente", code: 400 }
        }
        if (pId < 0) {
            return { error: "El Id del carrito esta definido incorrectamente", code: 400 }
        }

        quantity = Number(quantity);
        if (Number.isNaN(quantity)) {
            return { error: "Cantidad no valida", code: 400 }
        }
        if (quantity < 0) {
            return { error: "Cantidad no valida", code: 400 }
        }


        const result = this.cartList.find(current => current.id == cId);
        console.log(result)

        if (!result) {
            return { error: "Carrito no encontrado", code: 404 }
        }

        const productsResult = result.products.find(current => current.product === pId);

        if (productsResult) {
            productsResult.quantity = productsResult.quantity + quantity;
        } else {
            result.products.push({ product: pId, quantity })
        }

        try {
            this.#abortController.abort();
            this.#abortController = new AbortController();

            await aFs.writeFile(this.path, JSON.stringify(this), { signal: this.#abortController.signal });
            return { message: `Producto agregado correctamente` }
        } catch ({ message }) {
            return { sysError: message }
        }
    }




}