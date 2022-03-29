import { IModel } from './model.interface';

export class Publisher implements IModel {
  uuid?: string;
  ownerUuid?: string;
  name?: string;
}
