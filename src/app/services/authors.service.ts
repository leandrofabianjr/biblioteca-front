import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Author } from '../models/author';
import { RestService, IDto } from './rest.service';

export interface IAuthorDTO extends IDto {
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthorsService extends RestService<
  Author,
  IAuthorDTO,
  IAuthorDTO
> {
  constructor(http: HttpClient) {
    super(http, 'authors');
  }

  toDto(obj: Author): IAuthorDTO {
    return {
      uuid: obj.uuid!,
      ownerUuid: obj.ownerUuid!,
      name: obj.name,
    };
  }

  toModel(dto: IAuthorDTO): Author {
    const obj = new Author();
    obj.uuid = dto.uuid;
    obj.ownerUuid = dto.ownerUuid;
    obj.name = dto.name;
    return obj;
  }
}
