const uuid = require('uuidv4');
import BaseEntity from './baseEntity';
import {Product} from '../types/product';
import {DatabaseTableName} from '../constants/databaseTableNames';
import {ProductFieldName} from '../constants/fieldNames/productFieldNames';

export default class ProductEntity extends BaseEntity {
    private _lookupCode: string;
    public get lookupCode (): string { return this._lookupCode; }
    public set lookupCode (value: string) {
        if (this._lookupCode !== value) {
            this._lookupCode = value;
            this.propertyChanged(ProductFieldName.LOOKUP_CODE);
        }
    }

    private _count: number;
    public get count (): number { return this._count; }
    public set count (value: number) {
        if (this._count !== value) {
            this._count = value;
            this.propertyChanged(ProductFieldName.COUNT);
        }
    }

    public toJSON(): Product {
        return new Product(
            super.id,
            this._lookupCode,
            this._count,
            super.createdOn);
    }

    public fillFromRecord(row: any): void {
        super.fillFromRecord(row);

        this._count = row[ProductFieldName.COUNT];
        this._lookupCode = row[ProductFieldName.LOOKUP_CODE];
    }

    protected fillRecord(): any {
        var record: any = super.fillRecord();

        record[ProductFieldName.COUNT] = this._count;
        record[ProductFieldName.LOOKUP_CODE] = this._lookupCode;
        
        return record;
    }

    public synchronize(productRequest: Product): void {
        this.count = (productRequest.count || -1);
        this.lookupCode = (productRequest.lookupCode || '');
    }

    constructor(productRequest?: Product) {
        super(productRequest, DatabaseTableName.PRODUCT);

        this._count = (productRequest ? productRequest.count : -1);
        this._lookupCode = (productRequest ? productRequest.lookupCode : '');
    }
}