import {SQLKeyword} from '../../../constants/sql/keywords';
import {SQLSortOrder} from '../../../constants/sql/sortOrders';
import {StringExtensions} from '../../../../extensions/StringExtensions';

export default class OrderByContainer {
    private _tableName: string;
    public get tableName (): string { return this._tableName; }
    public set tableName (value: string) { this._tableName = value; }

    private _fieldName: string;
    public get fieldName (): string { return this._fieldName; }
    public set fieldName (value: string) { this._fieldName = value; }

    private _direction: string;
    public get direction (): string { return this._direction; }
    public set direction (value: string) { this._direction = value; }

    public toString(): string {
        if (!this.validate()) {
            return '';
        }

        return (this._tableName + SQLKeyword.TABLE_FIELD_SEPARATOR + this._fieldName + SQLKeyword.SPACE + this._direction);
    }

    public validate(): boolean {
        return (!StringExtensions.isNullOrWhitespace(this._tableName) && !StringExtensions.isNullOrWhitespace(this._fieldName));
    }

    constructor({ tableName = '', fieldName = '', direction = '' } = {}) {
        this._fieldName = fieldName;
        this._tableName = tableName;
        this._direction = (!StringExtensions.isNullOrWhitespace(direction) ? direction : SQLSortOrder.ASCENDING);
    }
}