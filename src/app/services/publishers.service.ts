import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Publisher } from '../models/publisher';
import { aaIDto, BaseDtoService, CollectionType } from './base-dto.service';

export interface IPublisherDTO extends aaIDto {
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PublishersService extends BaseDtoService<
  Publisher,
  IPublisherDTO
> {
  constructor(afs: AngularFirestore, afAuth: AngularFireAuth) {
    super(afs, CollectionType.Publishers, afAuth);
  }

  protected toDto(obj: Publisher): IPublisherDTO {
    return {
      id: obj.id,
      uid: obj.uid,
      name: obj.name,
    };
  }

  protected toModel(dto: IPublisherDTO): Publisher {
    const obj = new Publisher();
    obj.id = dto.id;
    obj.uid = dto.uid;
    obj.name = dto.name;
    return obj;
  }
}
