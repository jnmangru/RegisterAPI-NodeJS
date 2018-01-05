import * as restify from 'restify';
import RouteController from './routeController';
import ByIdQuery from './commands/product/byIdQuery';
import SearchQuery from './commands/product/searchQuery';
import CreateCommand from './commands/product/createCommand';
import DeleteCommand from './commands/product/deleteCommand';
import UpdateCommand from './commands/product/updateCommand';
import ProductEntity from '../models/entities/productEntity';
import {IProductRepository, CommandResponse} from '../types';
import ByLookupCodeQuery from './commands/product/byLookupCodeQuery';
import ProductRepository from '../models/repositories/productRepository';

export default class ProductRouteController extends RouteController {
	public queryProducts(req: restify.Request, res: restify.Response, next: restify.Next) {
		(new SearchQuery({ productRepository: ProductRouteController.productRepository }))
			.execute()
			.then((response: CommandResponse) => {
				res.send(response.status, response.data);
				return next();
			}, (reason: CommandResponse) => {
				res.send(reason.status, reason.message);
				return next();
			});
	}

	public queryProductById(req: restify.Request, res: restify.Response, next: restify.Next) {
		ProductRouteController.productRepository.get(req.params.id)
			.then((productEntity: (ProductEntity | undefined)) => {
				if (productEntity) {
					res.send(200, productEntity.toJSON());
				} else {
					res.send(404)
				}
				return next();
			}, (reason: any) => {
				return next(new Error(reason.message));
			});
	}

	public queryProductByLookupCode(req: restify.Request, res: restify.Response, next: restify.Next) {
		(new ByLookupCodeQuery({ lookupCode: req.params.lookupCode }))
			.execute()
			.then((response: CommandResponse) => {
				res.send(response.status, response.data);
				return next();
			}, (reason: CommandResponse) => {
				res.send(reason.status, reason.message);
				return next();
			});
	}

    public createProduct(req: restify.Request, res: restify.Response, next: restify.Next) {
		(new CreateCommand({ productToSave: req.body, productRepository: ProductRouteController.productRepository }))
			.execute()
			.then((response: CommandResponse) => {
				res.send(response.status, response.data);
				return next();
			}, (reason: CommandResponse) => {
				res.send(reason.status, reason.message);
				return next();
			});
	}

    public updateProductById(req: restify.Request, res: restify.Response, next: restify.Next) {
		(new UpdateCommand({ productId: req.params.id, productToSave: req.body, productRepository: ProductRouteController.productRepository }))
			.execute()
			.then((response: CommandResponse) => {
				res.send(response.status, response.data);
				return next();
			}, (reason: CommandResponse) => {
				res.send(reason.status, reason.message);
				return next();
			});
	}

    public deleteProductById(req: restify.Request, res: restify.Response, next: restify.Next) {
        (new DeleteCommand({ productId: req.params.id, productRepository: ProductRouteController.productRepository }))
            .execute()
            .then((response: CommandResponse) => {
                res.send(response.status);
                return next();
            }, (reason: CommandResponse) => {
                res.send(reason.status, reason.message);
                return next();
            });
	}

	private static productRepository: IProductRepository = new ProductRepository();
}