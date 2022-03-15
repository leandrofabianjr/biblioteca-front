import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BaseDtoService, CollectionType, IDto } from './base-dto.service';
import { Author } from '../models/author';
import { AngularFireAuth } from '@angular/fire/compat/auth';

export interface IAuthorDTO extends IDto {
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthorsService extends BaseDtoService<Author, IAuthorDTO> {
  constructor(afs: AngularFirestore, afAuth: AngularFireAuth) {
    super(afs, CollectionType.Authors, afAuth);
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
