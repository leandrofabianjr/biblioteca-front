import { Injectable } from '@angular/core';
import { BaseDtoService, CollectionType, IDto } from './base-dto.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Location } from '../models/location';
import { AngularFireAuth } from '@angular/fire/compat/auth';

export interface ILocationDTO extends IDto {
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LocationsService extends BaseDtoService<Location, ILocationDTO> {
  constructor(afs: AngularFirestore, afAuth: AngularFireAuth) {
    super(afs, CollectionType.Locations, afAuth);
  }

  toDto(obj: Location): ILocationDTO {
    return {
      id: obj.id,
      uid: obj.uid,
      description: obj.description,
    };
  }

  toModel(dto?: ILocationDTO): Location {
    if (!dto) return {};

    const obj = new Location();
    obj.id = dto.id;
    obj.description = dto.description;
    return obj;
  }
}
