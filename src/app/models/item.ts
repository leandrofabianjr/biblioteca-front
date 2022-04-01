import { Publisher } from './publisher';
import { Location } from './location';
import { Author } from './author';
import { Genre } from './genre';
import { IModel } from './model.interface';

export class Item implements IModel {
  uuid?: string;
  ownerUuid?: string;
  description?: string;
  publishers?: Publisher[];
  year?: number;
  location?: Location;
  authors?: Author[];
  genres?: Genre[];
}
