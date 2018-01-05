const uuid = require('uuidv4');
import * as moment from 'moment';
import {MappedEntityBaseType} from './mappedEntityBaseType';

export class Product extends MappedEntityBaseType {
    constructor(
        public id: string = uuid.empty(),
        public lookupCode: string = '',
        public count: number = -1,
        public createdOn: moment.Moment = moment()) {
            super(id, createdOn);
    }
}