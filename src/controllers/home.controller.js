import { Router } from "express";
import fs from 'fs';
const aFs = fs.promises;

const router = Router();


async function getProducts() {
    
let products = [];

    try {
        products = JSON.parse(await aFs.readFile(process.cwd() + "/output/productos.json")).products;
    }
    catch {
    }

    return products;
}




router.get("/", async (req, res)=>{
    res.render("home", {products: await getProducts()})
})


export default router;