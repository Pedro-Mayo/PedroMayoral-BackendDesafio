import cartsController from "../controllers/carts.controller.js";
import productsController from "../controllers/products.controller.js";


function routeSetter(app){
    app.use('/api/products', productsController);
    app.use('/api/carts', cartsController);
}

export default routeSetter;
