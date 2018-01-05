const uuid = require('uuidv4');
import {Product} from '../../../models/types/product';
import {CommandResponse, IProductRepository} from '../../../types';
import ProductEntity from '../../../models/entities/productEntity';
import {StringExtensions} from '../../../extensions/StringExtensions';
import ProductRepository from '../../../models/repositories/productRepository';

export default class UpdateCommand {
    public execute(): Promise<CommandResponse> {
        var self = this;

        return new Promise<CommandResponse>((resolveToRouter, rejectToRouter) => {
            if (StringExtensions.isNullOrWhitespace(self._productToSave.lookupCode)) {
                rejectToRouter({ status: 422, message: 'Missing or invalid parameter: lookupCode.', data: {} });
            }

            self._productRepository.get(self._productId)
                .then((existingProductEntity: ProductEntity | undefined) => {
                    if (existingProductEntity) {
						existingProductEntity.synchronize(self._productToSave);

						existingProductEntity
							.save()
							.then(
                                (value: string) => {
                                    resolveToRouter({ status: 200, message: '', data: existingProductEntity.toJSON() });
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

    private _productToSave: Product;
    public get productToSave (): Product { return this._productToSave; }
    public set productToSave (value: Product) { this._productToSave = value; }

    private _productRepository: IProductRepository;
    public get productRepository (): IProductRepository { return this._productRepository; }
    public set productRepository (value: IProductRepository) { this._productRepository = value; }

    constructor({ productId = uuid.empty(), productToSave = new Product(), productRepository = new ProductRepository() }: any = {}) {
		this._productId = productId;
        this._productToSave = productToSave;
        this._productRepository = productRepository;
    }
}