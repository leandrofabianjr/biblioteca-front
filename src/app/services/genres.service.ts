import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Genre } from '../models/genre';
import { RestService, IDto } from './rest.service';

export interface IGenreDTO extends IDto {
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class GenresService extends RestService<Genre, IGenreDTO, IGenreDTO> {
  constructor(http: HttpClient) {
    super(http, 'genres');
  }

  toDto(obj: Genre): IGenreDTO {
    return {
      uuid: obj.uuid,
      ownerUuid: obj.ownerUuid,
      description: obj.description,
    };
  }

  toModel(dto: IGenreDTO): Genre {
    const obj = new Genre();
    obj.uuid = dto.uuid;
    obj.ownerUuid = dto.ownerUuid;
    obj.description = dto.description;
    return obj;
  }
}
