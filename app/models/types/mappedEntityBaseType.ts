const uuid = require('uuidv4');
import * as moment from 'moment';

export class MappedEntityBaseType {
    constructor(
      public id: string = uuid.empty(),
      public createdOn: moment.Moment = moment()) { }
}