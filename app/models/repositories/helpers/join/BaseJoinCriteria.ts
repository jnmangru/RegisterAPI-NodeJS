import {SQLKeyword} from '../../../constants/sql/keywords';
import {SQLComparison} from '../../../constants/sql/comparisons';
import {StringExtensions} from '../../../../extensions/StringExtensions';

export default class BaseJoinCriteria {
    private _joinType: string;
    public get joinType (): string { return this._joinType; }
    public set joinType (value: string) { this._joinType = value; }

    private _joinOnTableName: string;
    public get joinOnTableName (): string { return this._joinOnTableName; }
    public set joinOnTableName (value: string) { this._joinOnTableName = value; }

    private _joinOnFieldName: string;
    public get joinOnFieldName (): string { return this._joinOnFieldName; }
    public set joinOnFieldName (value: string) { this._joinOnFieldName = value; }

    private _comparison: string;
    public get comparison (): string { return this._comparison; }
    public set comparison (value: string) { this._comparison = value; }

    private _joinWithTableName: string;
    public get joinWithTableName (): string { return this._joinWithTableName; }
    public set joinWithTableName (value: string) { this._joinWithTableName = value; }

    private _joinWithFieldName: string;
    public get joinWithFieldName (): string { return this._joinWithFieldName; }
    public set joinWithFieldName (value: string) { this._joinWithFieldName = value; }

    public toString(): string {
        if (!this.validate()) {
            return '';
        }

        var joinClause: string = (SQLKeyword.SPACE + this._joinType + SQLKeyword.SPACE + SQLKeyword.JOIN + SQLKeyword.SPACE + SQLKeyword.ON + SQLKeyword.SPACE);
        joinClause += (this._joinOnTableName + SQLKeyword.TABLE_FIELD_SEPARATOR + this._joinOnFieldName + SQLKeyword.SPACE);
        joinClause += (this._comparison + SQLKeyword.SPACE);

        return (joinClause + this._joinWithTableName + SQLKeyword.TABLE_FIELD_SEPARATOR + this._joinWithFieldName);
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
        if (valid && StringExtensions.isNullOrWhitespace(this._joinWithTableName)) {
            valid = false;
        }
        if (valid && StringExtensions.isNullOrWhitespace(this._joinWithFieldName)) {
            valid = false;
        }

        return valid;
    }

    constructor({ joinType = '', joinOnTableName = '', joinOnFieldName = '', comparison = '', joinWithTableName = '', joinWithFieldName = '' } = {}) {
        this._joinType = joinType;
        this._comparison = comparison;
        this._joinOnFieldName = joinOnFieldName;
        this._joinOnTableName = joinOnTableName;
        this._joinWithFieldName = joinWithFieldName;
        this._joinWithTableName = joinWithTableName;
    }
}