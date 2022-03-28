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
export class PublishersService extends ApiService<Publisher, IPublisherDTO> {
  constructor(http: HttpClient) {
    super(http, 'publishers');
  }

  protected toDto(obj: Publisher): IPublisherDTO {
    return {
      uuid: obj.uuid!,
      ownerId: obj.ownerId!,
      name: obj.name,
    };
  }

  protected toModel(dto: IPublisherDTO): Publisher {
    const obj = new Publisher();
    obj.uuid = dto.uuid;
    obj.ownerId = dto.ownerId;
    obj.name = dto.name;
    return obj;
  }
}
