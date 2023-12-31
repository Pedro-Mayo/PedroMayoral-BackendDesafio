import cartsController from "../controllers/carts.controller.js";
import productsController from "../controllers/products.controller.js";
import homeController from "../controllers/home.controller.js"
import realTimeController from "../controllers/realTime.controller.js"

function routeSetter(app){
    app.use('/', homeController)
    app.use('/realtimeproducts', realTimeController)
    app.use('/api/products', productsController);
    app.use('/api/carts', cartsController);
}

export default routeSetter;
