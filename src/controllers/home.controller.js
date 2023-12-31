import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";



const router = Router();
const pm = new ProductManager();


router.get("/", (req, res)=>{
    res.render("home", {products: pm.getProducts()})
})


export default router;