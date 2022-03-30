import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Author } from '../models/author';
import { ApiService, IDto } from './api.service';

export interface IAuthorDTO extends IDto {
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthorsService extends ApiService<Author, IAuthorDTO> {
  constructor(http: HttpClient) {
    super(http, 'authors');
  }

  protected toDto(obj: Author): IAuthorDTO {
    return {
      uuid: obj.uuid!,
      ownerUuid: obj.ownerUuid!,
      name: obj.name,
    };
  }

  protected toModel(dto: IAuthorDTO): Author {
    const obj = new Author();
    obj.uuid = dto.uuid;
    obj.ownerUuid = dto.ownerUuid;
    obj.name = dto.name;
    return obj;
  }
}
