import { Injectable } from '@angular/core';
import { BaseDtoService, CollectionType, aaIDto } from './base-dto.service';
import { Author } from '../models/author';

export interface IAuthorDTO extends aaIDto {
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthorsService extends BaseDtoService<Author, IAuthorDTO> {
  constructor() {
    super({}, CollectionType.Authors, {});
  }

  protected toDto(dto: Author): IAuthorDTO {
    return {
      id: dto.id,
      uid: dto.uid,
      name: dto.name,
    };
  }

  protected toModel(dto: IAuthorDTO): Author {
    const obj = new Author();
    obj.id = dto.id;
    obj.uid = dto.uid;
    obj.name = dto.name;
    return obj;
  }
}
