import { Router } from "express";
import ProductManager from '../managers/ProductManager.js'

const pwd = "Products"

const router = Router();

const pm = new ProductManager();


router.get("/", (req, res) => {
    const products = pm.getProducts();
    if (typeof req.query.limit === "undefined") {
        res.json(products)
        return
    }

    const limit = Number(req.query.limit);
    if (Number.isNaN(limit) || (!Number.isNaN(limit) && limit < 0)) {
        res.status(400).json({ error: "Bad query" });
        return
    }

    if (limit < products.length) {
        products.length = limit;
    }

    res.json({ products });
    return
}
)


router.get("/:pid", (req, res) => {
    const productId = Number(req.params.pid);
    if (Number.isNaN(productId) || (!Number.isNaN(productId) && productId < 0)) {
        res.status(400).json({ error: "Bad request" });
        return
    }

    const result = pm.getProductById(productId);

    if (result.error) {
        res.status(404).json(result)
        return
    }

    res.json(result)
    return
})

router.post('/', async (req, res) => {
    const newProduct = req.body;
    const result = await pm.addProduct(newProduct);

    if (result.error) {
        res.status(400).json(result);
        return
    }

    if (result.sysError) {
        res.status(500).json({error: result.sysError})
        return
    }

    res.status(201).json(result);
    return


})

router.put('/:pid',async (req, res)=>{
    const result = await pm.updateProduct(req.params.pid, req.body);

    if(result.message){
        res.json(result);
        return
    }

    if(result.error){
        res.status(result.code?result.code:400).json(result);
        return
    }
})

router.delete('/:pid', async (req, res) => {

    const pid = Number(req.params.pid);
    const result = await pm.deleteProduct(pid);

    if (result.error){
        res.status(400).json(result);
        return
    }

    if (result.sysError) {
        res.status(500).json({error: result.sysError});
        return
    }

    res.json({message: "Producto eliminado correctamente"});
    return
})

export default router;