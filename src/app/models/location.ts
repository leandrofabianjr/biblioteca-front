import { IModel } from './model.interface';

export class Location implements IModel {
  uuid!: string;
  ownerId!: string;
  description?: string;
}
