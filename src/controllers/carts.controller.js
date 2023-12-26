import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const cm = new CartManager()

const pwd = "Carts"

const router = Router();

router.get('/:cId', (req, res) => {
    const cId = Number(req.params.cId);
    const result = cm.getCart(cId);
    if(result.error){
        res.status(result.code).json({error: result.error});
        return
    }
    res.json(result);
})

router.post('/', async (req, res)=>{
    const result = await cm.createCart();

    if (result.sysError) {
        res.status(500).json({error: result.sysError})
        return
    }

    res.status(201).json(result);
    return
})

router.post('/:cId/product/:pId', async (req, res)=>{
    const {cId, pId} = req.params;
    const quantity = req.body.quantity;

    const result = await cm.addProduct(cId, pId, quantity);
    console.log("codigo " + result.code)
    if (result.sysError) {
        res.status(500).json({error: result.sysError})
        return
    }

    if(result.error){
        res.status(result.code).json({error: result.error});
        return
    }

    res.status(200).json(result);
    return
    
})

export default router;