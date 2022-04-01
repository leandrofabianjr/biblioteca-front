import { Injectable } from '@angular/core';
import { Location } from '../models/location';
import { HttpClient } from '@angular/common/http';
import { ApiService, IDto } from './api.service';

export interface ILocationDTO extends IDto {
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LocationsService extends ApiService<
  Location,
  ILocationDTO,
  ILocationDTO
> {
  constructor(http: HttpClient) {
    super(http, 'locations');
  }

  toDto(obj: Location): ILocationDTO {
    return {
      uuid: obj.uuid,
      ownerUuid: obj.ownerUuid,
      description: obj.description,
    };
  }

  toModel(dto: ILocationDTO): Location {
    const obj = new Location();
    obj.uuid = dto.uuid;
    obj.ownerUuid = dto.ownerUuid;
    obj.description = dto.description;
    return obj;
  }
}
