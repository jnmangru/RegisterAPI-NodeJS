import BaseJoinCriteria  from './BaseJoinCriteria';
import AdditionalJoinCriteria from './AdditionalJoinCriteria';

export default class JoinContainer {
    public toString(): string {
        if (!this.validate()) {
            return '';
        }

        var joinClause: string = this._baseJoinCriteria.toString();
        for (var i: number = 0; i < this._additionalJoinCriteria.length; i++) {
            joinClause += this._additionalJoinCriteria[i].toString();
        }

        return joinClause;
    }

    private validate(): boolean {
        var valid: boolean = this._baseJoinCriteria.validate();

        for (var i: number = 0; i < this._additionalJoinCriteria.length; i++) {
            if (valid === false) {
                break;
            }

            valid = this._additionalJoinCriteria[i].validate();
        }

        return valid;
    }

    private _baseJoinCriteria: BaseJoinCriteria;
    private _additionalJoinCriteria: AdditionalJoinCriteria[];

    constructor({ baseJoinCriteria = new BaseJoinCriteria(), additionalJoinCriteria = [] } = {}) {
        this._baseJoinCriteria = baseJoinCriteria;
        this._additionalJoinCriteria = additionalJoinCriteria;
    }
}