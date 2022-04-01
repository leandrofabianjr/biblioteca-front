import { IModel } from './model.interface';

export class Location implements IModel {
  uuid?: string;
  ownerUuid?: string;
  description?: string;
}
