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
export class LocationsService extends ApiService<Location, ILocationDTO> {
  constructor(http: HttpClient) {
    super(http, 'locations');
  }

  protected toDto(obj: Location): ILocationDTO {
    return {
      uuid: obj.uuid,
      ownerId: obj.ownerId,
      description: obj.description,
    };
  }

  protected toModel(dto: ILocationDTO): Location {
    const obj = new Location();
    obj.uuid = dto.uuid;
    obj.ownerId = dto.ownerId;
    obj.description = dto.description;
    return obj;
  }
}
