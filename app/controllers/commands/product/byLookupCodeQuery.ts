import ProductEntity from '../../../models/entities/productEntity';
import {CommandResponse, IProductRepository} from '../../../types';
import ProductRepository from '../../../models/repositories/productRepository';

export default class ByLookupCodeQuery {
    public execute(): Promise<CommandResponse> {
        var self = this;
        return new Promise<CommandResponse>((resolveToRouter, rejectToRouter) => {
            self._productRepository.byLookupCode(self._lookupCode)
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

    private _lookupCode: string;
    public get lookupCode (): string { return this._lookupCode; }
    public set lookupCode (value: string) { this._lookupCode = value; }

    private _productRepository: IProductRepository;
    public get productRepository (): IProductRepository { return this._productRepository; }
    public set productRepository (value: IProductRepository) { this._productRepository = value; }

    constructor({ lookupCode = '', productRepository = new ProductRepository() }: any = {}) {
        this._lookupCode = lookupCode;
        this._productRepository = productRepository;
    }
}