import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from '../models/item';
import { ApiService, IDto } from './api.service';

export interface IItemDTO extends IDto {
  description?: string;
  publishers?: [];
  year?: number;
  location?: any;
  authors?: [];
  genres?: [];
}

@Injectable({
  providedIn: 'root',
})
export class ItemsService extends ApiService<Item, IItemDTO> {
  constructor(http: HttpClient) {
    super(http, 'items');
  }

  protected toDto(obj: Item): IItemDTO {
    return {} as IItemDTO;
  }

  protected toModel(dto: IItemDTO): Item {
    const obj = new Item();
    obj.id = dto.uuid;
    obj.uid = dto.ownerUuid;
    obj.year = dto.year;
    obj.description = dto.description;
    // obj.location = this.locSrv.get(dto.location?.id ?? '');
    // obj.publishers = dto.publishers?.map((ref) => this.pubSrv.get(ref.id));
    // obj.authors = dto.authors?.map((ref) => this.autSrv.get(ref.id));
    // obj.genres = dto.genres?.map((ref) => this.gnrSrv.get(ref.id));
    return obj;
  }
}
