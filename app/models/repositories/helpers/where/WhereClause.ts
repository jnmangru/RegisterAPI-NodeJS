import {SQLKeyword} from '../../../constants/sql/keywords';
import {SQLComparison} from '../../../constants/sql/comparisons';
import {PostgreFunction} from '../../../constants/sql/postgreFunctions';
import {StringExtensions} from '../../../../extensions/StringExtensions';

export default class WhereClause {
    private _conditional: string;
    public get conditional (): string { return this._conditional; }
    public set conditional (value: string) { this._conditional = value; }

    private _tableName: string;
    public get tableName (): string { return this._tableName; }
    public set tableName (value: string) { this._tableName = value; }

    private _postgreFunction: string;
    public get postgreFunction (): string { return this._postgreFunction; }
    public set postgreFunction (value: string) { this._postgreFunction = value; }

    private _fieldName: string;
    public get fieldName (): string { return this._fieldName; }
    public set fieldName (value: string) { this._fieldName = value; }

    private _fieldType: string;
    public get fieldType (): string { return this._fieldType; }
    public set fieldType (value: string) { this._fieldType = value; }

    private _comparison: string;
    public get comparison (): string { return this._comparison; }
    public set comparison (value: string) { this._comparison = value; }

    public toString(): string {
        var whereClause: string = SQLKeyword.SPACE
        if (!StringExtensions.isNullOrWhitespace(this._conditional)) {
            whereClause += (this._conditional + SQLKeyword.SPACE);
        }
        var validFunctionDefinition: boolean = (!StringExtensions.isNullOrWhitespace(this._postgreFunction) && (this._postgreFunction !== PostgreFunction.ANY));
        if (validFunctionDefinition) {
            whereClause += (this._postgreFunction + SQLKeyword.OPEN_FUNCTION)
        }
        whereClause += (this._tableName + SQLKeyword.TABLE_FIELD_SEPARATOR + this._fieldName);
        if (validFunctionDefinition) {
            whereClause += SQLKeyword.CLOSE_FUNCTION;
        }
        whereClause += (SQLKeyword.SPACE + this._comparison);

        if ((this._comparison !== SQLComparison.IS_NULL) && (this._comparison !== SQLComparison.IS_NOT_NULL)) {
            whereClause += SQLKeyword.SPACE;

            var isAnyFunction = (this._postgreFunction === PostgreFunction.ANY);
            if (isAnyFunction) {
                whereClause += (this._postgreFunction + SQLKeyword.OPEN_FUNCTION);
            }

            whereClause += (SQLKeyword.OPEN_PLACEHOLDER + this._tableName + this._fieldName + SQLKeyword.CLOSE_PLACEHOLDER);
            if (!StringExtensions.isNullOrWhitespace(this._fieldType)) {
                whereClause += (SQLKeyword.TYPE_SEPARATOR + this._fieldType);
            }

            if (isAnyFunction) {
                whereClause += SQLKeyword.CLOSE_FUNCTION;
            }
        }

        return whereClause;
    }

    public validate(initialClause: boolean  = false): boolean {
        var valid: boolean = true;

        if ((initialClause === false) && StringExtensions.isNullOrWhitespace(this._conditional)) {
            valid = false;
        }
        if (valid && StringExtensions.isNullOrWhitespace(this._tableName)) {
            valid = false;
        }
        if (valid && StringExtensions.isNullOrWhitespace(this._fieldName)) {
            valid = false;
        }
        if (valid && StringExtensions.isNullOrWhitespace(this._comparison)) {
            valid = false;
        }

        return valid;
    }

    constructor({ conditional = '', tableName = '', postgreFunction = '', fieldName = '', fieldType = '', comparison = '' } = {}) {
        this._fieldName = fieldName;
        this._fieldType = fieldType;
        this._tableName = tableName;
        this._comparison = comparison;
        this._conditional = conditional;
        this._postgreFunction = postgreFunction;
    }
}