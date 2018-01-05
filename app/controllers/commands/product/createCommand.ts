const uuid = require('uuidv4');
import {Product} from '../../../models/types/product';
import {CommandResponse, IProductRepository} from '../../../types';
import ProductEntity from '../../../models/entities/productEntity';
import {StringExtensions} from '../../../extensions/StringExtensions';
import ProductRepository from '../../../models/repositories/productRepository';

export default class CreateCommand {
    public execute(): Promise<CommandResponse> {
        var self = this;

        return new Promise<CommandResponse>((resolveToRouter, rejectToRouter) => {
            if (StringExtensions.isNullOrWhitespace(self._productToSave.lookupCode)) {
                rejectToRouter({ status: 422, message: 'Missing or invalid parameter: lookupCode.', data: {} });
            }

            self._productRepository.byLookupCode(self._productToSave.lookupCode)
                .then((existingProductEntity: ProductEntity | undefined) => {
                    if (!existingProductEntity) {
                        var newProductEntity = new ProductEntity(this._productToSave);
                        newProductEntity.save()
                            .then(
                                (value: string) => {
                                    resolveToRouter({ status: 201, message: '', data: newProductEntity.toJSON() });
                                }, (reason: any) => {
                                    rejectToRouter(reason);
                                });
                    } else {
                        rejectToRouter({ status: 409, message: 'Conflict on parameter: lookupCode', data: {} });
                    }
                }, (reason: any) => {
                    rejectToRouter({ status: 500, message: reason.message, data: {} });
                });
        });
    }

    private _productToSave: Product;
    public get productToSave (): Product { return this._productToSave; }
    public set productToSave (value: Product) { this._productToSave = value; }

    private _productRepository: IProductRepository;
    public get productRepository (): IProductRepository { return this._productRepository; }
    public set productRepository (value: IProductRepository) { this._productRepository = value; }

    constructor({ productToSave = new Product(), productRepository = new ProductRepository() }: any = {}) {
        this._productToSave = productToSave;
        this._productRepository = productRepository;
    }
}