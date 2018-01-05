import * as restify from 'restify';
import productRouteController from '../controllers/productRouteController'

function productRoute(server: restify.Server) {
  let routeController = new productRouteController();

  server.get({ path: '/api/product/', version: '0.0.1' }, routeController.queryProducts);
  
  server.get({ path: '/api/product/:id', version: '0.0.1' }, routeController.queryProductById);

  server.get({ path: '/api/product/byLookupCode/:lookupCode', version: '0.0.1' }, routeController.queryProductByLookupCode);
  
  server.post({ path: '/api/product/', version: '0.0.1' }, routeController.createProduct)

  server.put({ path: '/api/product/:id', version: '0.0.1' }, routeController.updateProductById);

  server.del({ path: '/api/product/:id', version: '0.0.1' }, routeController.deleteProductById);
  
  server.get({ path: '/api/test/product/', version: '0.0.1' }, (req: restify.Request, res: restify.Response, next: restify.Next) => {
    res.send(200, 'Successful test. (Product routing).');
    return next();
  });
}

module.exports.routes = productRoute;
