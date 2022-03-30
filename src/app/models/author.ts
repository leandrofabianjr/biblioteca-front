import { IModel } from './model.interface';

export class Author implements IModel {
  uuid?: string;
  ownerUuid?: string;
  name?: string;
}
