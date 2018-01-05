import WhereClause from './WhereClause';
import {SQLKeyword} from '../../../constants/sql/keywords';

export default class WhereContainer {
    public toString(): string {
        if (!this.validate()) {
            return '';
        }

        var whereClause: string = (SQLKeyword.SPACE + SQLKeyword.WHERE);
        for (var i: number = 0; i < this._whereClauses.length; i++) {
            whereClause += this._whereClauses[i].toString();
        }

        return whereClause;
    }

    public validate(): boolean {
        var valid: boolean = (this._whereClauses.length > 0);

        for (var i: number = 0; i < this._whereClauses.length; i++) {
            if (valid === false) {
                break;
            }

            valid = this._whereClauses[i].validate(i == 0);
        }

        return valid;
    }

    private _whereClauses: WhereClause[];

    constructor({ whereClauses = [] }: any = {}) {
        this._whereClauses = whereClauses;
    }
}