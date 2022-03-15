import { IModel } from './model.interface';

export class Genre implements IModel {
  id?: string;
  uid?: string;
  description?: string;
}
