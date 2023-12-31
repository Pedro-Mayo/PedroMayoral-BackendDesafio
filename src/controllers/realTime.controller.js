import { Router } from "express";
import fs from 'fs';
const aFs = fs.promises;


async function getProducts() {
    
let products = [];

    try {
        products = JSON.parse(await aFs.readFile(process.cwd() + "/output/productos.json")).products;
    }
    catch {
    }

    return products;
}

const router = Router();

router.get("/", async (req, res) => {
    res.render("realTime", { products: await getProducts() })
})

export default router;