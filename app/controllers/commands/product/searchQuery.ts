import ProductEntity from '../../../models/entities/productEntity';
import {CommandResponse, IProductRepository} from '../../../types';
import ProductRepository from '../../../models/repositories/productRepository';

export default class SearchQuery {
    public execute(): Promise<CommandResponse> {
        var self = this;
        return new Promise<CommandResponse>((resolveToRouter, rejectToRouter) => {
            self._productRepository.all()
                .then((productEntities: ProductEntity[]) => {
                    resolveToRouter({
                        status: 200
                        , message: ''
                        , data: productEntities.map((productEntity: ProductEntity) => {
                            return productEntity.toJSON()
                        })});
                }, (reason: any) => {
                    rejectToRouter({ status: 500, message: reason.message, data: {} });
                })
        });
    }

    private _productRepository: IProductRepository;
    public get productRepository (): IProductRepository { return this._productRepository; }
    public set productRepository (value: IProductRepository) { this._productRepository = value; }

    constructor({ productRepository = new ProductRepository() }: any = {}) {
        this._productRepository = productRepository;
    }
}