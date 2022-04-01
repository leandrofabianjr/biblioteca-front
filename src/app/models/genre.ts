import { IModel } from './model.interface';

export class Genre implements IModel {
  uuid?: string;
  ownerUuid?: string;
  description?: string;
}
