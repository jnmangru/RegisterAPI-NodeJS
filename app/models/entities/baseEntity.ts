const uuid = require('uuidv4');
import * as moment from 'moment';
import {IDatabase} from 'pg-promise';
import {SQLKeyword} from '../constants/sql/keywords';
import {SQLComparison} from '../constants/sql/comparisons';
import {PostgreFormat} from '../constants/sql/postgreFormats';
import db = require('../repositories/helpers/databaseConnection');
import {MappedEntityBaseType} from '../types/mappedEntityBaseType';
import {BaseFieldName} from '../constants/fieldNames/baseFieldNames';

export default abstract class BaseEntity {
    private _id: string;
    public get id (): string { return this._id; }
    public set id (value: string) { this._id = value; }

    private _createdOn: moment.Moment;
    public get createdOn (): moment.Moment { return this._createdOn; }
    public set createdOn (value: moment.Moment) { this._createdOn = value; }

    private _isNew: boolean;
    public get isNew (): boolean { return this._isNew; }

    private _isDirty: boolean
    public get isDirty (): boolean { return this._isDirty; }

    private _tableName: string;
    public get tableName () { return this._tableName; }
    
    public toJSON(): any {
        return {
            id: this._id,
            createdOn: this._createdOn
        };
    }

    public fillFromRecord(row: any): void {
        this._isNew = false;
        this._isDirty = false;

        this._id = row[BaseFieldName.ID];
        this._createdOn = moment.utc(row[BaseFieldName.CREATED_ON], PostgreFormat.TIMESTAMP_WITHOUT_TIMEZONE);
    }

    protected fillRecord(): any {
        return ((this._id && (this._id !== uuid.empty())) ? { [BaseFieldName.ID]: this._id } : {});
    }

    protected propertyChanged(propertyName: string): void {
        if (!this._isDirty) {
            this._isDirty = true;
        }

        if (this._toUpdateFieldNames.indexOf(propertyName) < 0) {
            this._toUpdateFieldNames.push(propertyName);
        }
    }

    public save(): Promise<string>;
    public save(connection: IDatabase<any>): Promise<string>;
    public save(connection?: IDatabase<any>): Promise<string> {
        var self = this;
        return new Promise<string>(function(resolveToController, rejectToController) {
            self.saveAction(connection ? connection : db)
                .then(() => {
                        self._isNew = false;
                        self._isDirty = false;
                        self._toUpdateFieldNames = [];
                        resolveToController(self._id);
                    }, (reason: any) => {
                        rejectToController(reason);
                    });
        });
    }

    public delete(): Promise<null>;
    public delete(connection: IDatabase<any>): Promise<null>;
    public delete(connection?: IDatabase<any>): Promise<null> {
        if (this._isNew) {
            return Promise.resolve<null>(null);
        }

        const deleteStatement: string = (
            SQLKeyword.DELETE + SQLKeyword.SPACE + SQLKeyword.FROM + SQLKeyword.SPACE + this._tableName
            + SQLKeyword.SPACE + SQLKeyword.WHERE + SQLKeyword.SPACE + BaseFieldName.ID
            + SQLKeyword.ASSIGN + SQLKeyword.OPEN_PLACEHOLDER + BaseFieldName.ID
            + SQLKeyword.CLOSE_PLACEHOLDER
            );
        const databaseConnection = (connection ? connection : db);

        return databaseConnection.none(deleteStatement, { [BaseFieldName.ID]: this._id });
    }

    private saveAction(connection: IDatabase<any>): Promise<null> {
        if (this._isNew) {
            return this.insertRecord(connection);
        } else if (this._isDirty && (this._toUpdateFieldNames.length > 0)) {
            return this.updateRecord(connection);
        } else {
            return Promise.resolve(null);
        }
    }

    private insertRecord(connection: IDatabase<any>): Promise<null> {
        var self = this;
        var insertRecord: any = this.fillRecord();
        return new Promise<null>(function(resolveToController, rejectToController) {
            connection.one(self.buildInsertStatement(insertRecord), insertRecord)
                .then((data: any) => {
                        if (data) {
                            self._id = data[BaseFieldName.ID];
                            self._createdOn = data[BaseFieldName.CREATED_ON];
                        }
                        resolveToController();
                    }, (reason: any) => {
                        rejectToController(reason);
                    });
        });
    }

    private updateRecord(connection: IDatabase<any>): Promise<null> {
        var updateRecord: any = this.fillRecord();

        return connection.none(this.buildUpdateStatement(updateRecord), updateRecord);
    }

    private buildInsertStatement(insertRecord: any): string {
        var appendFieldDivider: boolean = false;
        var insertStatement: string = (SQLKeyword.INSERT_PREAMBLE + SQLKeyword.SPACE + this._tableName + SQLKeyword.OPEN_FUNCTION);

        for (var property in insertRecord) {
            if (appendFieldDivider) {
                insertStatement += (SQLKeyword.FIELD_SEPARATOR + SQLKeyword.SPACE);
            } else {
                appendFieldDivider = true;
            }
            insertStatement += property;
        }

        insertStatement += (SQLKeyword.CLOSE_FUNCTION + SQLKeyword.SPACE + SQLKeyword.VALUES + SQLKeyword.OPEN_FUNCTION);

        appendFieldDivider = false;
        for (var property in insertRecord) {
            if (appendFieldDivider) {
                insertStatement += (SQLKeyword.FIELD_SEPARATOR + SQLKeyword.SPACE);
            } else {
                appendFieldDivider = true;
            }
            insertStatement += (SQLKeyword.OPEN_PLACEHOLDER + property + SQLKeyword.CLOSE_PLACEHOLDER);
        }

        return (
            insertStatement + SQLKeyword.CLOSE_FUNCTION + SQLKeyword.SPACE + SQLKeyword.RETURNING
            + SQLKeyword.SPACE + BaseFieldName.ID + SQLKeyword.FIELD_SEPARATOR + BaseFieldName.CREATED_ON
        );
    }

    private buildUpdateStatement(updateRecord: any): string {
        var appendFieldDivider: boolean = false;
        var updateStatement: string = (
            SQLKeyword.UPDATE + SQLKeyword.SPACE + this._tableName + SQLKeyword.SPACE
            + SQLKeyword.SET + SQLKeyword.SPACE
        );

        updateStatement += this._toUpdateFieldNames.map((value: string) => {
            return (value + SQLKeyword.ASSIGN + SQLKeyword.OPEN_PLACEHOLDER + value + SQLKeyword.CLOSE_PLACEHOLDER);
        }).join();

        return (
            updateStatement + SQLKeyword.SPACE + SQLKeyword.WHERE + SQLKeyword.SPACE
            + BaseFieldName.ID + SQLComparison.EQUALS + SQLKeyword.OPEN_PLACEHOLDER
            + BaseFieldName.ID + SQLKeyword.CLOSE_PLACEHOLDER
        );
    }

    private _toUpdateFieldNames: string[];
    
    constructor(request?: MappedEntityBaseType, tableName: string = '') {
        this._isNew = true;
        this._isDirty = true;
        this._toUpdateFieldNames = [];
        
        this._tableName = tableName;
        this._id = (request ? request.id : uuid.empty());
        this._createdOn = (request ? request.createdOn : moment());
    }
}