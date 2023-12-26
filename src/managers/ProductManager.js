import fs from "fs";
const aFs = fs.promises;

export default class ProductManager {

    #abortController;
    constructor(path = "./output/productos.json") {
        this.#abortController = new AbortController();

        this.path = path;

        try {
            const { products, idEnum } = JSON.parse(fs.readFileSync(path, 'utf-8'));
            this.products = products??[];
            this.idEnum = idEnum??0;
        }
        catch {
            this.products = [];
            this.idEnum = 0;
            fs.writeFileSync(path, JSON.stringify(this))
        }



    }

    // { title, description, price, thumbnail, code, stock}
    async addProduct(newProduct) {

        const { title, description, price, thumbnails, code, category, stock, status} = newProduct;
        // Chequeamos si todos los campos contienen info, y si esa info es valida
        //Status es true por default Y obiligatorio???
        if (
            !(typeof title === "string" &&
                typeof description === "string" &&
                typeof code === "string" &&
                typeof price === "number" &&
                typeof status === "boolean" &&
                typeof stock === "number" &&
                typeof category === "string" &&
                (Array.isArray(thumbnails) || typeof thumbnails === "undefined")
                )
        ) {
            return { error: "Producto no agregado, hay campos ausentes o no validos." }
        }

        //Chequeamos la existencia del producto
        if (this.products.some(current => current.code == code)) {
            return { error: "Producto no agregado, codigo ya utilizado." }
        }

        //Si todo sale bien se agrega el producto

        try {
            this.#abortController.abort();
            this.#abortController = new AbortController();

            const newId = this.idEnum++;

            this.products.push({ title, description, price, thumbnails, status, code, stock, id: newId });

            await aFs.writeFile(this.path, JSON.stringify(this), { signal: this.#abortController.signal });

            return {message: `Producto cargado correctamente con el Id ${newId}`}

        } catch ({ message }) {

            return { sysError: message }

        }


    }

    // hay q pasar un array separado al original pq sino cualquier cambio al array pedido afecta al original
    getProducts() {
        const [...decouple] = this.products;
        return decouple;

    }

    getProductById(id) {
        id = Number(id);
        if (Number.isNaN(id)) {            
            return {error : "Los parametros no fueron definidos correctamente"}
        }
        const result = this.products.find(current => current.id == id);
        if (!result) {
            return { error: "ID not found" }
        }

        const { ...decoupled } = result;

        return decoupled
    }

    async updateProduct(id, productUpdate) {

        id = Number(id);

        if (Number.isNaN(id) || typeof productUpdate !== "object") {            
            return {error : "Los parametros no fueron definidos correctamente"}
        }

        const indexSeleccionado = this.products.findIndex(current => current.id === id);
        productUpdate.id = id;


        // Si no existe el producto con el id solicitado devuelve menos 1, tiro error
        if (indexSeleccionado == -1) {
            return {error:"El producto a ser actualizado no existe", code: 404}            
        }

        //Si encuentro un producto con el mismo codigo en un indice que no es el a actualizar tiro error.
        if (this.products.findIndex(current => current.code == productUpdate.code) >= 0
            && this.products.findIndex(current => current.code == productUpdate.code) !== indexSeleccionado) {

            return {error: "El codigo de producto ya se encuentra utilizado en otro producto."}

        }

        const objetoViejo = this.products[indexSeleccionado];

        Object.keys(productUpdate).forEach((key) => { objetoViejo[key] = productUpdate[key] });

        try {
            this.#abortController.abort();
            this.#abortController = new AbortController();

            await aFs.writeFile(this.path, JSON.stringify(this), { signal: this.#abortController.signal });
            return {message: "Producto actualizado correctamente"}
        } catch ({ message }) {
            return {sysError: message}
        }
    }

    async deleteProduct(id) {
        const pId = Number(id);

        if(Number.isNaN(pId)){
            return {error: "ID Invalido"}
        }
        

        const indexSeleccionado = this.products.findIndex(current => current.id === pId);
        if (indexSeleccionado === -1) {
            return {error: "El producto a eliminar no existe"}
        }

        this.products.splice(indexSeleccionado, 1);

        try {
            this.#abortController.abort();
            this.#abortController = new AbortController();

            await aFs.writeFile(this.path, JSON.stringify(this), { signal: this.#abortController.signal });
            return {message: `El producto con el id ${pId} fue eliminado correctamente`};
        } catch ({ message }) {
            return {sysError: message}
        }

    }
}