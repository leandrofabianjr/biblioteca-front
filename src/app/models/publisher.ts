import { IModel } from './model.interface';

export class Publisher implements IModel {
  uuid?: string;
  ownerId?: string;
  name?: string;
}
