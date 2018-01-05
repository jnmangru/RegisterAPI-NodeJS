import * as pgPromise from 'pg-promise';
import {IMain, IDatabase} from 'pg-promise';
import {settings} from '../../../config/config';

const pgp: IMain = pgPromise({});
const db: IDatabase<any> = pgp(process.env.DATABASE_URL || '');
// const db: IDatabase<any> = pgp({
//     host: settings.db.host,
//     port: settings.db.port,
//     user: settings.db.user,
//     database: settings.db.database,
//     password: settings.db.password
// });

export = db;