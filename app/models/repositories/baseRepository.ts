import {IDatabase} from 'pg-promise';
import {IBaseRepository} from '../../types';
import BaseEntity from '../entities/baseEntity';
import db = require('./helpers/databaseConnection');
import {SQLKeyword} from '../constants/sql/keywords';
import WhereClause from './helpers/where/WhereClause';
import JoinContainer from './helpers/join/JoinContainer';
import {PostgreType} from '../constants/sql/postgreTypes';
import {SQLComparison} from '../constants/sql/comparisons';
import WhereContainer from './helpers/where/WhereContainer';
import OrderByContainer from './helpers/orderBy/OrderByContainer';
import {BaseFieldName} from '../constants/fieldNames/baseFieldNames';

export default abstract class BaseRepository<T extends BaseEntity> implements IBaseRepository<T> {
    private _tableName: string;
    get tableName (): string { return this._tableName; }

    protected abstract createOne(row: any): T;

    public get(id: string): Promise<T | undefined> {
        return this.firstOrDefaultWhere(
            this.buildByIdParameters(id)
        );
    }

    public all(): Promise<T[]> {
        return this.allWhere();
    }

    public exists(id: string): Promise<boolean> {
        return this.existsWhere(
            this.buildByIdParameters(id)
        )
    }

    public inRange(limit: number, offset: number): Promise<T[]> {
        return this.allWhere({limit: limit, offset: offset});
    }

    public saveMany(toSave: T[]): Promise<null> {
        return new Promise(function(resolveToController, rejectToController) {
            db.tx((t: any) => {
                var saveCommands: Promise<string>[] = [];

                toSave.forEach((entityToSave) => {
                    saveCommands.push(entityToSave.save(t));
                });

                return t.batch(saveCommands);
            }).then((data: any) => {
                    resolveToController();
                }, (reason: any) => {
                    rejectToController(reason);
                });
        });
    }

    public deleteMany(toDelete: T[]): Promise<null> {
        return new Promise(function(resolveToController, rejectToController) {
            db.tx((t: any) => {
                var deleteCommands: Promise<null>[] = [];

                toDelete.forEach((entityToDelete) => {
                    deleteCommands.push(entityToDelete.delete(t));
                });

                return t.batch(deleteCommands);
            }).then((data: any) => {
                    resolveToController();
                }, (reason: any) => {
                    rejectToController(reason);
                });
        });
    }

    public connectAndRun(context: T, action: (self: T, connection: IDatabase<any>) => Promise<any>): Promise<any> {
        if (action) {
            return new Promise(function(resolveToController, rejectToController) {
                action(context, db)
                    .then((data: any) => {
                            resolveToController(data);
                        }, (reason: any) => {
                            rejectToController(reason);
                        })
            });
        } else {
            return new Promise(function(resolveToController, rejectToController) {
                resolveToController();
            });
        }
    }

    protected firstOrDefaultWhere({ joinContainers = [], whereContainer = undefined, orderByContainers = [], values = undefined }: any = {}): Promise<T | undefined> {
        return this.queryFirstOrDefault(
            this.buildSelectQuery([ this.buildDefaultProjection() ], joinContainers, whereContainer, orderByContainers, 1, BaseRepository._invalidIndex)
            , values
        )
    }

    protected queryFirstOrDefault(query: string, values: any): Promise<T | undefined> {
        var self: BaseRepository<T> = this;

        return new Promise(function(resolveToController, rejectToController) {
            db.oneOrNone(query, values)
                .then((data: any) => {
                        resolveToController(data ? self.createOne(data) : undefined);
                    }, (reason: any) => {
                        rejectToController(reason);
                    });
        });
    }

    protected allWhere({ joinContainers = [], whereContainer = undefined, orderByContainers = [], limit = BaseRepository._invalidIndex, offset = BaseRepository._invalidIndex, values = undefined }: any = {}): Promise<T[]> {
        return this.queryAll(
            this.buildSelectQuery([ this.buildDefaultProjection() ], joinContainers, whereContainer, orderByContainers, limit, offset)
            , values
        )
    }

    protected queryAll(query: string, values: any): Promise<T[]> {
        var self: BaseRepository<T> = this;

        return new Promise(function(resolveToController, rejectToController) {
            db.any(query, values)
                .then((data: any) => {
                        var results: T[] = [];
                        for (var i = 0; i < data.length; i++) {
                            results.push(
                                self.createOne(data[i])
                            );
                        }

                        resolveToController(results);
                    }, (reason: any) => {
                        rejectToController(reason);
                    });
        });
    }

    protected existsWhere({ joinContainers = [], whereContainer = undefined, orderByContainers = [], values = undefined }: any = {}): Promise<boolean> {
        return this.queryExists(
            this.buildExistsQuery(joinContainers, whereContainer, orderByContainers, 1, BaseRepository._invalidIndex)
            , values
        )
    }

    protected queryExists(query: string, values: any): Promise<boolean> {
        return new Promise(function(resolveToController, rejectToController) {
            db.one(query, values)
                .then((data: any) => {
                        resolveToController(data && (data.exists === true));
                    }, (reason: any) => {
                        rejectToController(reason);
                    });
        });
    }

    protected buildSelectQuery(projections: string[], joins: JoinContainer[], where: WhereContainer | undefined, orderBys: OrderByContainer[], limit: number, offset: number): string {
        return (
            SQLKeyword.SELECT + SQLKeyword.SPACE + projections.join()
            + this.buildFromAndWhereClause(joins, where, orderBys, limit, offset)
        );
    }

    protected buildExistsQuery(joins: JoinContainer[], where: WhereContainer | undefined, orderBys: OrderByContainer[], limit: number, offset: number): string {
        return (
            SQLKeyword.SELECT + SQLKeyword.SPACE + SQLKeyword.EXISTS + SQLKeyword.SPACE
            + SQLKeyword.OPEN_FUNCTION + SQLKeyword.SELECT + SQLKeyword.SPACE + BaseRepository._existsSelectCount
            + this.buildFromAndWhereClause(joins, where, orderBys, limit, offset)
            + SQLKeyword.CLOSE_FUNCTION
        );
    }

    protected buildFromAndWhereClause(joins: JoinContainer[], where: WhereContainer | undefined, orderBys: OrderByContainer[], limit: number, offset: number): string {
        var fromAndWhereClause: string = (SQLKeyword.SPACE + SQLKeyword.FROM + SQLKeyword.SPACE + this._tableName);

        joins.forEach((joinTo: JoinContainer) => {
            fromAndWhereClause += joinTo.toString();
        }, this);

        if (where) {
            fromAndWhereClause += where.toString();
        }

        orderBys.forEach((orderBy: OrderByContainer) => {
            fromAndWhereClause += orderBy.toString();
        }, this);

        if (limit > 0) {
            fromAndWhereClause += (SQLKeyword.SPACE + SQLKeyword.LIMIT + SQLKeyword.SPACE + limit);
        }

        if (offset > 0) {
            fromAndWhereClause += (SQLKeyword.SPACE + SQLKeyword.OFFSET + SQLKeyword.SPACE + offset);
        }

        return fromAndWhereClause;
    }

    protected buildDefaultProjection(): string {
        return (this._tableName + SQLKeyword.TABLE_FIELD_SEPARATOR + SQLKeyword.PROJECTION_ALL);
    }

    protected buildByIdParameters(id: string): any {
        return {
            whereContainer: new WhereContainer({
                whereClauses: [
                    new WhereClause({
                        tableName: this._tableName,
                        fieldName: BaseFieldName.ID,
                        fieldType: PostgreType.UUID,
                        comparison: SQLComparison.EQUALS
                    })
                ]
            })
            , values: { [this._tableName + BaseFieldName.ID]: id }
        };
    }

    private static _invalidIndex: number = -1;
    private static _existsSelectCount: string = '1';

    constructor(tableName: string) {
        this._tableName = tableName;
    }
}