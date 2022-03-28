import { Injectable } from '@angular/core';
import { BaseDtoService, CollectionType, aaIDto } from './base-dto.service';
import { Genre } from '../models/genre';

export interface IGenreDTO extends aaIDto {
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class GenresService extends BaseDtoService<Genre, IGenreDTO> {
  constructor() {
    super({}, CollectionType.Genres, {});
  }

  protected toDto(obj: Genre): IGenreDTO {
    return {
      id: obj.id,
      uid: obj.uid,
      description: obj.description,
    };
  }

  protected toModel(dto: IGenreDTO): Genre {
    const obj = new Genre();
    obj.id = dto.id;
    obj.uid = dto.uid;
    obj.description = dto.description;
    return obj;
  }
}
