import {SQLKeyword} from '../../../constants/sql/keywords';
import {SQLComparison} from '../../../constants/sql/comparisons';
import {StringExtensions} from '../../../../extensions/StringExtensions';

export default class AdditionalJoinCriteria {
    private _conditional: string;
    public get conditional (): string { return this._conditional; }
    public set conditional (value: string) { this._conditional = value; }

    private _joinOnTableName: string;
    public get joinOnTableName (): string { return this._joinOnTableName; }
    public set joinOnTableName (value: string) { this._joinOnTableName = value; }

    private _joinOnApplyFunction: string;
    public get joinOnApplyFunction (): string { return this._joinOnApplyFunction; }
    public set joinOnApplyFunction (value: string) { this._joinOnApplyFunction = value; }

    private _joinOnFieldName: string;
    public get joinOnFieldName (): string { return this._joinOnFieldName; }
    public set joinOnFieldName (value: string) { this._joinOnFieldName = value; }

    private _joinOnFieldType: string;
    public get joinOnFieldType (): string { return this._joinOnFieldType; }
    public set joinOnFieldType (value: string) { this._joinOnFieldType = value; }

    private _comparison: string;
    public get comparison (): string { return this._comparison; }
    public set comparison (value: string) { this._comparison = value; }

    private _externalTableName: string;
    public get externalTableName (): string { return this._externalTableName; }
    public set externalTableName (value: string) { this._externalTableName = value; }

    private _externalFieldName: string;
    public get externalFieldName (): string { return this._externalFieldName; }
    public set externalFieldName (value: string) { this._externalFieldName = value; }

    private _equivalency: string;
    public get equivalency (): string { return this._equivalency; }
    public set equivalency (value: string) { this._equivalency = value; }

    public toString(): string {
        if (!this.validate()) {
            return '';
        }

        var joinClause: string = (SQLKeyword.SPACE + this._conditional + SQLKeyword.SPACE);
        if (!StringExtensions.isNullOrWhitespace(this._joinOnApplyFunction)) {
            joinClause += (this._joinOnApplyFunction + SQLKeyword.OPEN_FUNCTION);
        }
        joinClause += (this._joinOnTableName + SQLKeyword.TABLE_FIELD_SEPARATOR + this._joinOnFieldName);
        if (!StringExtensions.isNullOrWhitespace(this._joinOnApplyFunction)) {
            joinClause += (SQLKeyword.CLOSE_FUNCTION);
        }
        joinClause += (SQLKeyword.SPACE + this._comparison + SQLKeyword.SPACE);
        if (!StringExtensions.isNullOrWhitespace(this._equivalency)) {
            joinClause += this._equivalency;
        } else if (StringExtensions.isNullOrWhitespace(this._externalTableName)) {
            joinClause += (SQLKeyword.OPEN_PLACEHOLDER + this._joinOnTableName + this._joinOnFieldName + SQLKeyword.CLOSE_PLACEHOLDER);
            if (!StringExtensions.isNullOrWhitespace(this._joinOnFieldType)) {
                joinClause += (SQLKeyword.TYPE_SEPARATOR + this._joinOnFieldType);
            }
        } else {
            joinClause += (this._externalTableName + SQLKeyword.TABLE_FIELD_SEPARATOR + this._externalFieldName);
        }

        return joinClause;
    }

    public validate(): boolean {
        var valid: boolean = true;

        if (StringExtensions.isNullOrWhitespace(this._joinOnTableName)) {
            valid = false;
        }
        if (valid && StringExtensions.isNullOrWhitespace(this._joinOnFieldName)) {
            valid = false;
        }
        if (valid && (StringExtensions.isNullOrWhitespace(this._comparison) || (this._comparison === SQLComparison.IS_NULL) || (this._comparison === SQLComparison.IS_NOT_NULL))) {
            valid = false;
        }

        return valid;
    }

    constructor({ conditional = '', joinOnTableName = '', joinOnApplyFunction = '', joinOnFieldName = '', joinOnFieldType = '', comparison = '', externalTableName = '', externalFieldName = '', equivalency = '' } = {}) {
        this._comparison = comparison;
        this._conditional = conditional;
        this._equivalency = equivalency;
        this._joinOnFieldName = joinOnFieldName;
        this._joinOnFieldType = joinOnFieldType;
        this._joinOnTableName = joinOnTableName;
        this._externalFieldName = externalFieldName;
        this._externalTableName = externalTableName;
        this._joinOnApplyFunction = joinOnApplyFunction;
    }
}