import { Publisher } from './publisher';
import { Location } from './location';
import { Author } from './author';
import { Genre } from './genre';
import { IModel, OldIModel } from './model.interface';

export class Item implements OldIModel, IModel {
  uuid!: string;
  ownerId!: string;
  id?: string;
  uid?: string;
  description?: string;
  publishers?: Publisher[];
  year?: number;
  location?: Location;
  authors?: Author[];
  genres?: Genre[];
}
