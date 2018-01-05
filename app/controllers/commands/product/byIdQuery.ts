const uuid = require('uuidv4');
import {CommandResponse, IProductRepository} from '../../../types';
import ProductEntity from '../../../models/entities/productEntity';
import ProductRepository from '../../../models/repositories/productRepository';

export default class ByIdQuery {
    public execute(): Promise<CommandResponse> {
        var self = this;
        return new Promise<CommandResponse>((resolveToRouter, rejectToRouter) => {
            self._productRepository.get(self._id)
                .then((productEntity: ProductEntity | undefined) => {
                    if (productEntity) {
                        resolveToRouter({ status: 200, message: '', data: productEntity.toJSON() });
                    } else {
                        rejectToRouter({ status: 404, message: 'Product was not found.', data: {} });
                    }
                }, (reason: any) => {
                    rejectToRouter({ status: 500, message: reason.message, data: {} });
                })
        });
    }

    private _id: string;
    public get id (): string { return this._id; }
    public set id (value: string) { this._id = value; }

    private _productRepository: IProductRepository;
    public get productRepository (): any { return this._productRepository; }
    public set productRepository (value: any) { this._productRepository = value; }

    constructor({ id = uuid.empty(), productRepository = new ProductRepository() }: any = {}) {
        this._id = id;
        this._productRepository = productRepository;
    }
}