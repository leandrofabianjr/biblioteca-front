import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from '../models/item';
import { RestService, IDto } from './rest.service';
import { AuthorsService, IAuthorDTO } from './authors.service';
import { GenresService, IGenreDTO } from './genres.service';
import { ILocationDTO, LocationsService } from './locations.service';
import { IPublisherDTO, PublishersService } from './publishers.service';

export interface IItemDTO extends IDto {
  description?: string;
  year?: number;
  location?: any;
  authors?: string[];
  genres?: string[];
  publishers?: string[];
}

export interface IFetchItemDTO extends IDto {
  description: string;
  year: number;
  location: ILocationDTO;
  authors: IAuthorDTO[];
  genres: IGenreDTO[];
  publishers: IPublisherDTO[];
}

@Injectable({
  providedIn: 'root',
})
export class ItemsService extends RestService<Item, IItemDTO, IFetchItemDTO> {
  constructor(
    http: HttpClient,
    private locSrv: LocationsService,
    private pubSrv: PublishersService,
    private autSrv: AuthorsService,
    private gnrSrv: GenresService
  ) {
    super(http, 'items');
  }

  toDto(obj: Item): IItemDTO {
    return {
      uuid: obj.uuid,
      ownerUuid: obj.ownerUuid,
      description: obj.description,
      year: obj.year,
      location: obj.location?.uuid,
      authors: obj.authors?.map((aut) => aut?.uuid ?? '') ?? [],
      genres: obj.genres?.map((gnr) => gnr?.uuid ?? ''),
      publishers: obj.publishers?.map((pub) => pub?.uuid ?? ''),
    };
  }

  toModel(dto: IFetchItemDTO): Item {
    const obj = new Item();
    obj.uuid = dto.uuid;
    obj.ownerUuid = dto.ownerUuid;
    obj.year = dto.year;
    obj.description = dto.description;
    obj.location = this.locSrv.toModel(dto.location);
    obj.publishers = dto.publishers?.map((ref) => this.pubSrv.toModel(ref));
    obj.authors = dto.authors.map((ref) => this.autSrv.toModel(ref));
    obj.genres = dto.genres.map((ref) => this.gnrSrv.toModel(ref));
    return obj;
  }
}
