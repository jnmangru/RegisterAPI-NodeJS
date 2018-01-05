const uuid = require('uuidv4');
import {CommandResponse, IProductRepository} from '../../../types';
import ProductEntity from '../../../models/entities/productEntity';
import ProductRepository from '../../../models/repositories/productRepository';

export default class DeleteCommand {
    public execute(): Promise<CommandResponse> {
        var self = this;

        return new Promise<CommandResponse>((resolveToRouter, rejectToRouter) => {
            self._productRepository.get(self._productId)
                .then((existingProductEntity: ProductEntity | undefined) => {
                    if (existingProductEntity) {
						existingProductEntity
							.delete()
							.then(
								() => {
                                    resolveToRouter({ status: 200, message: '', data: {} });
								}, (reason: any) => {
                                    rejectToRouter({ status: 500, message: reason.message, data: {} });
								});
                    } else {
                        rejectToRouter({ status: 404, message: 'Product was not found.', data: {} });
                    }
                }, (reason: any) => {
                    rejectToRouter({ status: 500, message: reason.message, data: {} });
                });
        });
    }

    private _productId: string;
    public get productId (): string { return this._productId; }
    public set productId (value: string) { this._productId = value; }

    private _productRepository: IProductRepository;
    public get productRepository (): IProductRepository { return this._productRepository; }
    public set productRepository (value: IProductRepository) { this._productRepository = value; }

    constructor({ productId = uuid.empty(), productRepository = new ProductRepository() }: any = {}) {
		this._productId = productId;
        this._productRepository = productRepository;
    }
}