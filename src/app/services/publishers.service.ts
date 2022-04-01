import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Publisher } from '../models/publisher';
import { ApiService, IDto } from './api.service';

export interface IPublisherDTO extends IDto {
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PublishersService extends ApiService<
  Publisher,
  IPublisherDTO,
  IPublisherDTO
> {
  constructor(http: HttpClient) {
    super(http, 'publishers');
  }

  toDto(obj: Publisher): IPublisherDTO {
    return {
      uuid: obj.uuid!,
      ownerUuid: obj.ownerUuid!,
      name: obj.name,
    };
  }

  toModel(dto: IPublisherDTO): Publisher {
    const obj = new Publisher();
    obj.uuid = dto.uuid;
    obj.ownerUuid = dto.ownerUuid;
    obj.name = dto.name;
    return obj;
  }
}
