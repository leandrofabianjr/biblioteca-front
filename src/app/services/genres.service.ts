import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Genre } from '../models/genre';
import { ApiService, IDto } from './api.service';

export interface IGenreDTO extends IDto {
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class GenresService extends ApiService<Genre, IGenreDTO> {
  constructor(http: HttpClient) {
    super(http, 'genres');
  }

  protected toDto(obj: Genre): IGenreDTO {
    return {
      uuid: obj.uuid,
      ownerUuid: obj.ownerUuid,
      description: obj.description,
    };
  }

  protected toModel(dto: IGenreDTO): Genre {
    const obj = new Genre();
    obj.uuid = dto.uuid;
    obj.ownerUuid = dto.ownerUuid;
    obj.description = dto.description;
    return obj;
  }
}
